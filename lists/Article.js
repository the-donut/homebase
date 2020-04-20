const { Text, Checkbox, Relationship, Url } = require('@keystonejs/fields');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');


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
    }
  },
  labelField: 'title',
};