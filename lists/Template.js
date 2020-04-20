const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    TemplateID: {
      type: Text,
      isRequired: true,
      isUnique: true
    },
    Name: {
      type: Text
    },
    PreviewURL: {
      type: Text
    },
    ScreenshotURL: {
      type: Text
    }
  },
  labelField: 'Name',
};