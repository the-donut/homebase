const fs = require('fs');
const { Text, Checkbox, DateTime, Relationship } = require('@keystonejs/fields');

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
    articles: {
      type: Relationship,
      ref: 'Article',
      many: true
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
    campaign: {
      type: Text
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
          }
        }
      `

      const options = {
        variables: { id: req.updatedItem.id },
      };

      const { errors, data } = await req.actions.query(GET_NEWSLETTER_DETAILS, options);
      const newsletter = data.Newsletter;

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
              "Content": "This is a heading",
              "Href": "http://example.com/"
            }
          ],
          "Multilines": [
            {
              "Content": "<p>This is example</p><p>multiline <a href='http://example.com'>content</a>...</p>"
            }
          ],
          "Images": [
            {
              "Content": "https://via.placeholder.com/150.jpg",
              "Alt": "This is alt text for an image",
              "Href": "http://example.com/"
            }
          ],
          "Repeaters": [
            {
              "Items": [
                {
                  "Layout": "My layout",
                  "Singlelines": [
                    {
                      "Content": "This is a repeater heading",
                      "Href": "http://example.com/"
                    }
                  ],
                  "Multilines": [
                    {
                      "Content": "<p>This is example</p><p>multiline <a href='http://example.com'>content</a>...</p>"
                    }
                  ],
                  "Images": [
                    {
                      "Content": "https://via.placeholder.com/150.jpg",
                      "Alt": "This is alt text for a repeater image",
                      "Href": "http://example.com/"
                    }
                  ]
                }
              ]
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