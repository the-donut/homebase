// load env vars
require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const initialiseData = require('./initial-data');

const NewsletterSchema = require('./lists/Newsletter.js');
const ArticleSchema = require('./lists/Article.js');
const VerticalSchema = require('./lists/Vertical.js');
const TemplateSchema = require('./lists/Template.js');
const SegmentSchema = require('./lists/Segment.js');
const ListSchema = require('./lists/List.js');
const ClientSchema = require('./lists/Client.js');
const TagSchema = require('./lists/Tag.js');
const ArticleTypeSchema = require('./lists/ArticleType.js');
const SponsorSchema = require('./lists/Sponsor.js');

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const PROJECT_NAME = 'The DONUT Homebase';
const adapterConfig = { mongoUri: process.env.MONGO_URL };

console.log('Iinitializing Keyston app... 🚁')

const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: initialiseData,
  sessionStore: new MongoStore({
    url: process.env.MONGO_URL
  }),
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList('Newsletter', NewsletterSchema);
keystone.createList('Article', ArticleSchema);
keystone.createList('Vertical', VerticalSchema);
keystone.createList('Template', TemplateSchema);
keystone.createList('Segment', SegmentSchema);
keystone.createList('List', ListSchema);
keystone.createList('Client', ClientSchema);
keystone.createList('Tag', TagSchema);
keystone.createList('ArticleType', ArticleTypeSchema);
keystone.createList('Sponsor', SponsorSchema);

// todo: move this to a list in the directory for lists
keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: access.userIsAdmin,
    delete: access.userIsAdmin,
    auth: true,
  },
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new StaticApp({
      path: '/',
      src: 'assets'
    }),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
      hooks: require.resolve('./custom-hooks')
    }),
  ]
};
