const { Text, Checkbox, DateTime, Relationship, File } = require('@keystonejs/fields');
const { S3Adapter } = require('@keystonejs/file-adapters');

const CF_DISTRIBUTION_ID = 'd2a9wahbz2pglr';
const S3_PATH = 'cms/uploads';
const SENDER_NAME = 'the DONUT';
const SENDER_EMAIL = 'kevin@robo-house.com';

const fileAdapter = new S3Adapter({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-1',
  bucket: 'mydonut',
  folder: S3_PATH,
  publicUrl: ({ id, filename, _meta }) => `https://${CF_DISTRIBUTION_ID}.cloudfront.net/${S3_PATH}/${filename}`
});

module.exports = {
  fields: {
    name: {
      type: Text,
      isRequired: true,
      isUnique: true,
      adminDoc: 'The name of the campaign used in Campaign Monitor'
    },
    subject: {
      type: Text,
      isRequired: true,
      adminDoc: 'The subject line of the campaign that will appear in subscribers inboxes'
    },
    description: {
      type: Text,
      isRequired: true,
      adminDoc: 'An internal descriptor field'
    },
    image: {
      type: File,
      adapter: fileAdapter
    },
    preheader: {
      type: Text,
      isRequired: true
    },
    introTitle: {
      type: Text,
      isRequired: true
    },
    intro: {
      type: Text,
      isRequired: true
    },
    quote: {
      type: Text,
      isRequired: true
    },
    quoteAuthor: {
      type: Text,
      isRequired: true
    },
    sendDate: {
      type: DateTime,
      isRequired: true
    },
    vertical: {
      type: Relationship,
      ref: 'Vertical',
      many: false,
      isRequired: true,
    },
    doseOfDiscussion: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    politicsAndCurrentEvents: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    BizTechAndEconomy: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    DoseOfPositive: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    DoseOfRandom: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    DoseOfKnowledge: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    DoseOfKnowledgeAnswer: {
      type: Relationship,
      ref: 'Article',
      many: false
    },
    template: {
      type: Relationship,
      ref: 'Template',
      many: false,
      require: true
    },
    segment: {
      type: Relationship,
      ref: 'Segment',
      many: false
    },
    list: {
      type: Relationship,
      ref: 'List',
      many: false,
      require: true
    },
    client: {
      type: Relationship,
      ref: 'Client',
      many: false,
      require: true
    },
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true
    },
    campaignId: {
      type: Text
    }
  },
  hooks: {
    afterChange: async (req) => {
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

      const options = {
        variables: { id: req.updatedItem.id },
      };

      const { errors, data } = await req.actions.query(GET_NEWSLETTER_DETAILS, {
        variables: {
          id: req.updatedItem.id
        }
      });

      const newsletter = data.Newsletter;

      if(errors) {
        console.log("error!", errors)
      }

      const jsonContent = JSON.stringify({
        "Name": newsletter.name,
        "Subject": newsletter.subject,
        "FromName": SENDER_NAME,
        "FromEmail": SENDER_EMAIL,
        "ReplyTo": SENDER_EMAIL,
        "TemplateID": newsletter.template.TemplateID,
        "ListIDs": [newsletter.list.ListID],
        // "SegmentIDs": [newsletter.segment ? newsletter.segment.SegmentID : ''],
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
            },{
              "Content": `
                <a href="https://www.facebook.com/sharer/sharer.php?u=https://thedonut.co/latest#dose-of-discussion" target="_blank" style="margin:5px;display:inline-block">
                  <img src="/csimport/section-share-fb_4.png" alt="" style="border:0;outline:none;-ms-interpolation-mode:bicubic" width="35">
                </a>
                <a href="https://twitter.com/home?status=https://thedonut.co/latest#dose-of-discussion Check out the Daily DONUT's sweet Dose of Discussion coverage today. It's a daily email that delivers just the facts and a 360 view on the news of the day" target="_blank" style="margin:5px;display:inline-block">
                  <img src="/csimport/section-share-twitter_5.png" alt="" style="border:0;outline:none;-ms-interpolation-mode:bicubic" width="35">
                </a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://thedonut.co/latest#dose-of-discussion&title=&summary=Check out the Daily DONUT's sweet Dose of Discussion coverage today. It's a daily email that delivers just the facts and a 360 view on the news of the day&source=" target="_blank" style="margin:5px;display:inline-block">
                  <img src="/csimport/section-share-linkedin_6.png" alt="" style="border:0;outline:none;-ms-interpolation-mode:bicubic" width="35">
                </a>
                <a href="mailto:info@example.com?&subject=&body=https://thedonut.co/latest#dose-of-discussion Check out the Daily DONUT's sweet Dose of Discussion coverage today. It's a daily email that delivers just the facts and a 360 view on the news of the day" target="_blank" style="margin:5px;display:inline-block">
                  <img src="/csimport/section-share-email_7_7.jpg" alt="" style="border:0;outline:none;-ms-interpolation-mode:bicubic" width="35">
                </a>
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
              if(resp.status === 200) createCampaign(newsletter.client.ClientID, jsonContent, newsletter.id, req.actions.query)
            })

          } else {
            createCampaign(newsletter.client.ClientID, jsonContent, newsletter.id, req.actions.query)
          }
        })
      })

    },
  },
  labelField: 'name',
};

/**
 * Creates a new campaign in Campaign Monitor provided a client ID and the JSON for the new campaign
 * @param {String} clientId
 * @param {Object} jsonContent
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