const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { Text, Decimal, Checkbox, Password, Select, CalendarDay, Relationship, File } = require('@keystonejs/fields');
//const Stars = require('./fields/Stars');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');
const { S3Adapter } = require('@keystonejs/file-adapters');

const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const initialiseData = require('./initial-data');

const dotenv = require('dotenv');
dotenv.config();

const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const PROJECT_NAME = 'jxz-art';
const MONGO_URI = process.env.MONGO_URI;
const adapterConfig = { mongoUri: MONGO_URI || 'mongodb://localhost/cms-proj' };


//Create Keystone
const keystone = new Keystone({
  name: PROJECT_NAME,
  adapter: new Adapter(adapterConfig),
  onConnect: process.env.CREATE_TABLES !== 'true' && initialiseData,
  sessionStore: new MongoStore({ url: MONGO_URI || 'mongodb://localhost/cms-proj' }),
  cookie:{
    secure: process.env.NODE_ENV === 'production', // Defaults to true in production
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: false,
  },
  cookieSecret: process.env.COOKIE_SECRET || 'very-secret',
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
    accessKeyId: process.env.ACCESS_KEY,
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

keystone.createList('Story_Category', {
  fields: {
    topic: {type: Text},
  },
  labelField: "topic",
});

keystone.createList('Product', {
  fields: {
    hidden:{type: Checkbox, isRequired: true},
    name: {type: Text},
    main_category: {type: Relationship, ref: 'Mineral_Main_Category', many: false, isRequired: true},
    sub_category: {type: Relationship, ref: 'Mineral_Sub_Category', many: false, isRequired: true},
    seal:{type: Text},
    length_mm:{type: Decimal},
    width_mm:{type: Decimal},
    height_mm:{type: Decimal},
    weight:{type: Decimal},
    quality:{type: Text, isMultiline: true},
    material:{type: Text, isMultiline: true},
    creator:{type: Text},
    craftsmanship_comment:{type: Text, isMultiline: true},
    item_description: {type: Text, isMultiline: true},
    item_story: {type: Text, isMultiline: true},
    note:{type: Wysiwyg},
    favorite: {type: Checkbox},
    price_in_usd: {type: Decimal},
    tags:{type: Relationship, ref: 'Tag', many: true},
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
    tags:{type: Relationship, ref: 'Tag', many: true},
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
  labelField: "title",
});

keystone.createList('Tag', {
  fields:{
    name:{type: Text}
  },
  labelField: "name",
});


//Nodemailer
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  }
});

transporter.verify(function(error, success){
  if(error){
    console.log(error);
  }else{
    console.log("\nServer is ready to take our messages\n");
  }
})

function sendEmail(req, res, next) {
  console.log(req.body);
  
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;
  var content = `name: ${name} \nemail: ${email} \nsubject: ${subject} \nmessage: ${message}`

  var mail = {
    from: name,
    to: "dadsrocks12345@gmail.com",
    subject: subject,
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if(err){
      res.json({status: 'fail'});
    }else{
      res.json({status: 'success'});
    }
  });
  
}

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
  configureExpress: app => {
    app.set('trust proxy', 1);
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.post('/send', sendEmail);
    app.get('/xd', function (req, res) {
      res.send('hello world')
    })
  }
};
