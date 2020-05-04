const { Text, Relationship, File } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

const { getNewsletterIdFromArticle } = require('../helpers/ArticleHelper');
const { getNewsletterDetails, createJsonContent, updateCampaignMonitor } = require('../helpers/NewsletterHelper');

const { S3Adapter } = require('@keystonejs/file-adapters');

const CF_DISTRIBUTION_ID = 'd2a9wahbz2pglr';
const S3_PATH = 'cms/uploads';

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
    title: {
      type: Text,
      isRequired: true
    },
    content: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        menubar: false
      }
    },
    tags: {
      type: Relationship,
      ref: 'Tag',
      many: true
    },
    type: {
      type: Relationship,
      ref: 'ArticleType',
      many: false
    },
    newsletter: {
      type: Relationship,
      ref: 'Newsletter',
      many: false
    },
    image: {
      type: File,
      adapter: fileAdapter,
      adminDoc: 'Optional image for individual article shares and myDONUT website'
    },
  },
  hooks: {
    afterChange: async (req) => {
      const newsletterId = await getNewsletterIdFromArticle(req.actions.query, req.updatedItem.id);
      if(newsletterId) {
        const newsletter = await getNewsletterDetails(req.actions.query, newsletterId);
        const jsonContent = await createJsonContent(newsletter);
        updateCampaignMonitor(newsletter, jsonContent, req.actions.query);
      }
    },
  },
  labelField: 'title',
};