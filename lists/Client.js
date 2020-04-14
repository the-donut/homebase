const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    ClientID: {
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