const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    ListID: {
      type: Text,
      isRequired: true
    },
    SegmentID: {
      type: Text,
      isRequired: true,
      isUnique: true
    },
    Title: {
      type: Text,
      isRequired: true
    }
  },
  labelField: 'Title',
};