const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    TemplateID: {
      type: Text,
      isRequired: true,
      isUnique: true
    },
    Name: {
      type: Text,
      isRequired: true
    },
    PreviewURL: {
      type: Text,
      isRequired: true
    },
    ScreenshotURL: {
      type: Text,
      isRequired: true
    }
  },
  labelField: 'Name',
};