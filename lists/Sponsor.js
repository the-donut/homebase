const { Text, File } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { S3Adapter } = require('@keystonejs/file-adapters');

const CF_DISTRIBUTION_ID = 'd2a9wahbz2pglr';
const S3_PATH = 'cms/uploads/sponsors';

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
      isRequired: true
    },
    logo: {
      type: File,
      adapter: fileAdapter
    },
    url: {
      type: Text,
      isRequired: true
    },
    content: {
      type: Wysiwyg,
      isRequired: true,
      editorConfig: {
        menubar: false
      }
    }
  },
  labelField: 'name',
};