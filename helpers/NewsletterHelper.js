// TODO: JDOCS
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

  const jsonContent = JSON.stringify({
    "Name": newsletter.name,
    "Subject": newsletter.subject,
    "FromName": SENDER_NAME,
    "FromEmail": SENDER_EMAIL,
    "ReplyTo": SENDER_EMAIL,
    "TemplateID": newsletter.template.TemplateID,
    "ListIDs": [newsletter.list.ListID],
    // "SegmentIDs": [newsletter.segment ? newsletter.segment.SegmentID : ''], // TODO: segment stuff
    "TemplateContent": {
      "Singlelines": [
        {
          "Content": new Date(newsletter.sendDate).toLocaleDateString()
        },{
          "Content": newsletter.introTitle
        },{
          "Content": newsletter.doseOfDiscussion ? newsletter.doseOfDiscussion.title : ''
        }, {
          "Content": newsletter.DoseOfKnowledge ? newsletter.DoseOfKnowledge.title : ''
        }
      ],
      "Multilines": [
        {
          "Content": `
            <span
              style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0"
            >
              ${newsletter.preheader}
              &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
              &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
            </span>
          `
        },{
          "Content": `
            <p
              class="staybig"
              style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:32px;color:#d1cdd0;font-size:20px"
            >
              ${newsletter.intro}
            </p>`
        },{
          "Content": `
            <p
              class="staymedium"
              style="Margin:0;padding-left:20px;padding-right:20px;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:28px;color:#d1cdd0;font-size:16px"
            >
              <em>"${newsletter.quote}"<br/>-&nbsp;<b style="color:#ffffff">${newsletter.quoteAuthor}</b></em>
            </p>
          `
        }, {
          "Content": `
            <p style="Margin:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;line-height:22px;color:#00292d;font-size:14px">
              ${newsletter.DoseOfKnowledge ? newsletter.DoseOfKnowledge.content : ''}
            </p>
          `
        }, {
          "Content": `
            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'poppins','helvetica neue',helvetica,arial,sans-serif;color:#fff !important;font-size:14px;line-height:22px">
              ${newsletter.DoseOfKnowledgeAnswer ? newsletter.DoseOfKnowledgeAnswer.content : ''}
            </p>
          `
        }
      ],
      "Repeaters": [
        {
          "Items": [
            {
              "Multilines": [
                {
                  "Content": newsletter.doseOfDiscussion ? newsletter.doseOfDiscussion.content : ''
                }
              ]
            }
          ]
        },{
          "Items": [
            {
              "Multilines": [
                {
                  "Content": newsletter.politicsAndCurrentEvents ? newsletter.politicsAndCurrentEvents.content : ''
                }
              ]
            }
          ]
        },{
          "Items": [
            {
              "Multilines": [
                {
                  "Content": newsletter.BizTechAndEconomy ? newsletter.BizTechAndEconomy.content : ''
                },
              ]
            }
          ]
        },{
          "Items": [
            {
              "Multilines": [
                {
                  "Content": newsletter.DoseOfPositive ? newsletter.DoseOfPositive.content : ''
                },
              ]
            }
          ]
        },{
          "Items": [
            {
              "Multilines": [
                {
                  "Content": newsletter.DoseOfRandom ? newsletter.DoseOfRandom.content : ''
                }
              ]
            }
          ]
        }
      ],
      "Images": [
        {
          "Content": newsletter.image.publicUrl,
          "Alt": newsletter.introTitle,
          "Href": newsletter.image.publicUrl
        }
      ]
    }
  });

  return jsonContent;
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
    console.log('Campaign created in Campaign Monitor:', json);
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