// TODO: JDOCS

const NoActionNoSponsor = require("../templates/NoActionNoSponsor");
const NoAction = require("../templates/NoAction");
const NoDibsNoAction = require("../templates/NoDibsNoAction");

const SENDER_NAME = 'the DONUT';
const SENDER_EMAIL = 'kevin@robo-house.com';

const getNewsletterDetails = async (query, newsletterId) => {
  const GET_NEWSLETTER_DETAILS = `
    query getNewsletterDetails($id: ID!) {
      Newsletter(where: { id: $id } ) {
        id
        name
        subject
        preheader
        introTitle
        intro
        quote
        quoteAuthor
        sendDate
        image {
          publicUrl
        }
        template {
          TemplateID
          Name
        }
        list {
          ListID
        }
        segment {
          SegmentID
        }
        template {
          TemplateID
        }
        client {
          ClientID
        }
        sponsor {
          logo {
            publicUrl
          }
          name
          url
          content
        }
        sponsorIntro
        doseOfDiscussion {
          title
          content
          tags {
            name
          }
        }
        politicsAndCurrentEvents {
          title
          content
          tags {
            name
          }
        }
        BizTechAndEconomy {
          title
          content
          tags {
            name
          }
        }
        DoseOfPositive {
          title
          content
          tags {
            name
          }
        }
        DoseOfRandom {
          title
          content
          tags {
            name
          }
        }
        DoseOfKnowledge {
          title
          content
          tags {
            name
          }
        }
        DoseOfKnowledgeAnswer {
          content
        }
      }
    }
  `

  const { errors, data } = await query(GET_NEWSLETTER_DETAILS, {
    variables: {
      id: newsletterId
    }
  });

  if(errors) {
    console.log("Error happened in newsletter helper fn getNewsletterDetails:", errors)
    return null
  } else {
    return data.Newsletter
  }
}

const createJsonContent = async (newsletter) => {
  // TODO: dynamic for sponsor template
  let templateContent;

  // TODO: MAKE THESE THE FINAL TEMPLATE ENUMS IMPORTED FROM ANOTHER FILE
  if(newsletter.template.Name === 'CMS - 3.0 No Action') {
    templateContent = NoAction(newsletter)
  } else if(newsletter.template.Name === 'CMS - 3.0 No Action No Sponsor') {
    templateContent = NoActionNoSponsor(newsletter);
  } else if(newsletter.template.Name === 'CMS - 3.0 No Dibs No Action') {
    templateContent = NoDibsNoAction(newsletter);
  }

  const jsonContent = {
    "Name": newsletter.name,
    "Subject": newsletter.subject,
    "FromName": SENDER_NAME,
    "FromEmail": SENDER_EMAIL,
    "ReplyTo": SENDER_EMAIL,
    "TemplateID": newsletter.template.TemplateID,
    "ListIDs": [newsletter.list.ListID],
    "SegmentIDs": newsletter.segment ? [newsletter.segment.SegmentID] : []
  };

  jsonContent.TemplateContent = templateContent;

  return JSON.stringify(jsonContent);
}

const updateCampaignMonitor = (newsletter, jsonContent, query) => {
  // get current scheduled campaigns to see if this one already exists or not
  // if it does exist we just want to update it
  const getScheduledCampaigns = `https://api.createsend.com/api/v3.2/clients/${newsletter.client.ClientID}/scheduled.json`;
  const getDraftCampaigns = `https://api.createsend.com/api/v3.2/clients/${newsletter.client.ClientID}/drafts.json`;
  const allCampaigns = [];
  const campaignNames = [];

  fetch(getScheduledCampaigns, {
    headers: {
      Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
    }
  }).then(resp => resp.json()).then(scheduledCampaigns => {
    allCampaigns.push(scheduledCampaigns)
    fetch(getDraftCampaigns, {
      headers: {
        Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
      }
    }).then(resp => resp.json()).then(draftCampaigns => {
      allCampaigns.push(draftCampaigns)

      const flattenedCampaigns = [].concat(...allCampaigns);

      flattenedCampaigns.forEach(campaign => {
        campaignNames.push(campaign.Name)
      })

      if(campaignNames.includes(newsletter.name)) {

        /**
         * Unfortunately campaign monitors API does not actually have an update endpoint
         * So we have to DELETE the campaign first and recreate it
         */
        const campaignToDelete = flattenedCampaigns.find(campaign => campaign.Name === newsletter.name);

        console.log('This campaign already exists in Campaign Monitor, re-creating instead...')

        const deleteCampaignUrl = `https://api.createsend.com/api/v3.2/campaigns/${campaignToDelete.CampaignID}.json`
        fetch(deleteCampaignUrl, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
          }
        }).then(resp => {
          if(resp.status === 200) createCampaign(newsletter.client.ClientID, jsonContent, newsletter.id, query)
        })

      } else {
        createCampaign(newsletter.client.ClientID, jsonContent, newsletter.id, query)
      }
    })
  })
}

/**
 * Creates a new campaign in Campaign Monitor provided a client ID and the JSON for the new campaign
 * @param {String} clientId the client id for who to send the email thought
 * @param {Object} jsonContent the content of the newsletter to send
 * @param {String} newsletterId the id of the newsletter to update
 * @param {Query} query the keystone query object TODO: this can be imported into this file directly probably
 */
const createCampaign = (clientId, jsonContent, newsletterId, query) => {
  const createCampaignUrl = `https://api.createsend.com/api/v3.2/campaigns/${clientId}/fromtemplate.json`
  fetch(createCampaignUrl, {
    method: 'POST',
    body: jsonContent,
    headers: {
      Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
    }
  }).then(resp => resp.json()).then(async json => {
    console.log('Campaign created in Campaign Monitor');
    const UPDATE_NEWSLETTER_ID = `mutation updateNewsletter($id: ID!, $data: NewsletterUpdateInput) {
      updateNewsletter(id: $id, data: $data){
        id
      }
    }`

    const { errors, data } = await query(UPDATE_NEWSLETTER_ID, {
      variables: {
        id: newsletterId,
        data: {
          campaignId: json
        }
      }
    });
  }).catch((e) => {
    console.log('Error creating campaign in Campaign Monitor:', e)
  })
}

module.exports = {
  createCampaign: createCampaign,
  createJsonContent: createJsonContent,
  getNewsletterDetails: getNewsletterDetails,
  updateCampaignMonitor: updateCampaignMonitor
}