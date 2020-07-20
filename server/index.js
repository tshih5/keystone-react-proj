const { Keystone, BaseKeystoneAdapter } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { Text, Decimal, Checkbox, Password, Url, Select, CalendarDay, Relationship } = require('@keystonejs/fields');
const Stars = require('./fields/Stars');
const { Content } = require('@keystonejs/field-content');

const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');


const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

const PROJECT_NAME = 'cms-proj';
const adapterConfig = { mongoUri: 'mongodb://localhost/cms-proj' };


const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
});

// Access control functions
const userIsAdmin = ({ authentication: { item: user } }) => Boolean(user && user.isAdmin);
const userOwnsItem = ({ authentication: { item: user } }) => {
  if (!user) {
    return false;
  }

  // Instead of a boolean, you can return a GraphQL query:
  // https://www.keystonejs.com/api/access-control#graphqlwhere
  return { id: user.id };
};

const userIsAdminOrOwner = auth => {
  const isAdmin = access.userIsAdmin(auth);
  const isOwner = access.userOwnsItem(auth);
  return isAdmin ? isAdmin : isOwner;
};

const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

keystone.createList('User', {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      // Field-level access controls
      // Here, we set more restrictive field access so a non-admin cannot make themselves admin.
      access: {
        update: access.userIsAdmin,
      },
    },
    password: {
      type: Password,
    },
  },
  // List-level access controls
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
  config: {
    identityField: 'username', // default: 'email'
    secretField: 'password', // default: 'password'
  },
});

keystone.createList('Product', {
  fields: {
    name: {type: Text},
    stone_type: {type: Relationship, ref: 'Mineral_Sub_Category', many: false},
    seal:{type: Text},
    length_cm:{type: Decimal},
    height_cm:{type: Decimal},
    width_cm:{type: Decimal},
    weight:{type: Decimal},
    quality:{type: Text},
    creator:{type: Text},
    craftsmanship_comment:{
      type: Content,
      blocks: [
        Content.blocks.blockquote,
        Content.blocks.image,
        Content.blocks.link,
        Content.blocks.orderedList,
        Content.blocks.unorderedList,
        Content.blocks.heading,
      ],
    },
    item_description: {
      type: Content,
      blocks: [
        Content.blocks.blockquote,
        Content.blocks.image,
        Content.blocks.link,
        Content.blocks.orderedList,
        Content.blocks.unorderedList,
        Content.blocks.heading,
      ],
    },
    item_story: {
      type: Content,
      blocks: [
        Content.blocks.blockquote,
        Content.blocks.image,
        Content.blocks.link,
        Content.blocks.orderedList,
        Content.blocks.unorderedList,
        Content.blocks.heading,
      ],
    },
    note:{type: Text, isMultiline: true},
    favorite: {type: Checkbox},
    price_in_usd: {type: Decimal},
    quality: {type: Stars, starCount: 5 },
    tags:{type: Relationship, ref: 'Product_Tag', many: true},
    image: {type: Url},
  },
  labelField: "id",
});

keystone.createList('Mineral_Main_Category', {
  fields: {
    name: {type: Text},
    subcategories:{
      type: Relationship,
      ref: 'Mineral_Sub_Category',
      many: true
    },
    description:{
      type: Text, 
      isMultiline: true
    },
  },
  labelField: "name",
});

keystone.createList('Mineral_Sub_Category',{
  fields:{
    name:{type: Text},
  },
  labelField: "name",
});

keystone.createList('Story',{
  fields: {
    title:{
      type: Text, 
      isUnique: true
    },
    category:{type: Relationship, ref: 'Story_Tag', many: false},
    date_published:{type: CalendarDay},
    story_content:{
      type: Content,
      blocks: [
        Content.blocks.blockquote,
        Content.blocks.image,
        Content.blocks.link,
        Content.blocks.orderedList,
        Content.blocks.unorderedList,
        Content.blocks.heading,
      ],
    },
    status:{type: Select, options: ['Published', 'In_Progress', 'Hidden']},
  },
  labelField: "id",
});

keystone.createList('Story_Tag', {
  fields: {
    topic: {type: Text},
  },
  labelField: "topic",
});

keystone.createList('Product_Tag', {
  fields:{
    tag:{type: Text}
  },
  labelField: "tag",
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};