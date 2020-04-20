const { Text, Checkbox, DateTime, Relationship } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

const SENDER_NAME = 'the DONUT';
const SENDER_EMAIL = 'kevin@robo-house.com';

module.exports = {
  fields: {
    subject: {
      type: Text,
      isRequired: true
    },
    description: {
      type: Text,
      isRequired: true,
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
    sendPreview: {
      type: Checkbox,
      defaultValue: false,
    },
    sendComplete: {
      type: Checkbox,
      defaultValue: false,
    },
  },
  hooks: {
    afterChange: async (req) => {
      const GET_NEWSLETTER_DETAILS = `
        query getNewsletterDetails($id: ID!) {
          Newsletter(where: { id: $id } ) {
            id
            subject
            preheader
            introTitle
            intro
            quote
            quoteAuthor
            sendDate
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
        "Name": newsletter.subject,
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
              "Content": newsletter.doseOfDiscussion.title
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
            }
          ],
          "Repeaters": [
            {
              "Items": [
                {
                  "Multilines": [
                    {
                      "Content": newsletter.doseOfDiscussion.content
                    }
                  ]
                }
              ]
            }
          ],
          "Images": [
            {
              // first (and only?) image is the header image, TODO: set up s3 buckets for image uploads
            }
          ]
        }
      });

      // create campaign in campaign monitor
      const createCampaignUrl = `https://api.createsend.com/api/v3.2/campaigns/${newsletter.client.ClientID}/fromtemplate.json`
      fetch(createCampaignUrl, {
        method: 'POST',
        body: jsonContent,
        headers: {
          Authorization: `Basic ${process.env.CAMPAIGN_MONITOR_KEY}`
        }
      }).then(resp => resp.json()).then(json => {
        console.log(json)
      }).catch((e) => {
        console.log('error:', e)
      })

    },
  },
  labelField: 'subject',
};