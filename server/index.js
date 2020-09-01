const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { Text, Decimal, Checkbox, Password, Url, Select, CalendarDay, Relationship, File } = require('@keystonejs/fields');
//const Stars = require('./fields/Stars');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { S3Adapter } = require('@keystonejs/file-adapters');

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
});

const S3_PATH = 'uploads';
const bucket = "jxzart-host";

const fileAdapter = new S3Adapter({
  bucket: 'jxzart-host',
  folder: S3_PATH,
  //Due to someting in AWS S3, "/" between S3path and filename is replaced with %5C or the "\" character
  publicUrl: ({ id, filename, _meta }) =>
    `https://${bucket}.s3.amazonaws.com/${S3_PATH}/${filename}`,
  s3Options: {
    // Optional paramaters to be supplied directly to AWS.S3 constructor
    apiVersion: '2006-03-01',
    accessKeyId: 'AKIAZNM6XZP4XAT777EP',
    secretAccessKey: process.env.SECRET_KEY,
    region: 'us-west-1',
  },
  uploadParams: ({ filename, id, mimetype, encoding }) => ({
    Metadata: {
      keystone_id: `${id}`,
    },
  }),
});

//Keystone Lists
keystone.createList('Product', {
  fields: {
    name: {type: Text},
    main_category: {type: Relationship, ref: 'Mineral_Main_Category', many: false,isRequired: true},
    sub_category: {type: Relationship, ref: 'Mineral_Sub_Category', many: false, isRequired: true},
    seal:{type: Text},
    length_cm:{type: Decimal},
    width_cm:{type: Decimal},
    height_cm:{type: Decimal},
    weight:{type: Decimal},
    quality:{type: Text},
    creator:{type: Text},
    craftsmanship_comment:{type: Text, isMultiline: true},
    item_description: {type: Text, isMultiline: true},
    item_story: {type: Text, isMultiline: true},
    note:{type: Text, isMultiline: true},
    favorite: {type: Checkbox},
    price_in_usd: {type: Decimal},
    tags:{type: Relationship, ref: 'Product_Tag', many: true},
    main_image: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.main_image) {
            await fileAdapter.delete(existingItem.main_image);
          }
        },
      },
    },
    thumbnail: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.thumbnail) {
            await fileAdapter.delete(existingItem.thumbnail);
          }
        },
      },
    },
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if(existingItem.main_image){
        await fileAdapter.delete(existingItem.main_image);
      }
      if(existingItem.thumbnail){
        await fileAdapter.delete(existingItem.thumbnail);
      }
    },
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
    category:{type: Relationship, ref: 'Story_Category', many: false},
    date_published:{type: CalendarDay},
    story_content:{type: Wysiwyg},
    status:{type: Select, options: ['Draft', 'Published', 'Hidden']},
    tags:{type: Relationship, ref: 'Story_Tag', many: true},
    main_image: {
      type: File,
      adapter: fileAdapter,
      hooks: {
        beforeChange: async ({ existingItem }) => {
          if (existingItem && existingItem.main_image) {
            await fileAdapter.delete(existingItem.main_image);
          }
        },
      },
    },
  },
  hooks: {
    afterDelete: async ({ existingItem }) => {
      if(existingItem.main_image){
        await fileAdapter.delete(existingItem.main_image);
      }
    },
  },
});

keystone.createList('Story_Category', {
  fields: {
    topic: {type: Text},
  },
  labelField: "topic",
});

keystone.createList('Story_Tag', {
  fields: {
    tag: {type: Text},
  },
  labelField: "tag",
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
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};
