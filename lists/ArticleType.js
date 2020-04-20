const { Text } = require('@keystonejs/fields');

module.exports = {
  fields: {
    type: {
      type: Text,
      isRequired: true,
      isUnique: true
    }
  },
  labelField: 'type',
};