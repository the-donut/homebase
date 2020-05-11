const { Text, DateTime, Relationship, File } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { S3Adapter } = require('@keystonejs/file-adapters');

const { getNewsletterDetails, createJsonContent, updateCampaignMonitor } = require('../helpers/NewsletterHelper');

const CF_DISTRIBUTION_ID = 'd2a9wahbz2pglr';
const S3_PATH = 'cms/uploads/newsletters';

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
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        toolbar: "bold italic underline strikethrough | alignleft alignright aligncenter | p h1 h2 h3 h4 fontsize | bullist numlist",
      }
    },
    sponsor: {
      type: Relationship,
      ref: 'Sponsor',
      many: false,
      adminDoc: 'Make sure to set the template to allow for sponsors to show'
    },
    sponsorIntro: {
      type: Wysiwyg,
      isRequired: false,
      editorConfig: {
        menubar: false
      }
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
      isRequired: true
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
      isRequired: true
    },
    client: {
      type: Relationship,
      ref: 'Client',
      many: false,
      isRequired: true
    },
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true
    },
    campaignId: {
      adminDoc: 'This is not to be filled in as it is populated from Campaign Monitor when the campaign is created in their system',
      type: Text
    }
  },
  hooks: {
    afterChange: async (req) => {
      const newsletter = await getNewsletterDetails(req.actions.query, req.updatedItem.id);
      const jsonContent = await createJsonContent(newsletter);
      updateCampaignMonitor(newsletter, jsonContent, req.actions.query);
    },
  },
  labelField: 'name',
};