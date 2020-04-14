const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    ListID: {
      type: Text,
      isRequired: true,
      isUnique: true
    },
    Name: {
      type: Text,
      isRequired: true
    }
  },
  labelField: 'Name',
};