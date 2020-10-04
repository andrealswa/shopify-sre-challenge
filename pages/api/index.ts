import {
  makeSchema,
  objectType,
  stringArg,
  asNexusMethod,
  inputObjectType,
  arg,
} from '@nexus/schema';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import path from 'path';
import aws from 'aws-sdk';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Allow use of root .env values.
dotenv.config();

// ORM api for backend to database.
const prisma = new PrismaClient();

// Image models for frontend to backend api the client can directly call upon.
const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('id');
    t.string('url');
    t.boolean('privateImg');
    t.int('userId');
  },
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('email');
    t.list.field('images', {
      type: Image,
      resolve: (parent) =>
        prisma.user.findOne({ where: { id: parent.id } }).images(),
    });
  },
});

// These are models for the args of several resolvers.
// These are probably not needed.
const ImageInput = inputObjectType({
  name: 'ImageInput',
  definition(t) {
    t.string('path', { required: true });
  },
});

const Token = objectType({
  name: 'Token',
  definition(t) {
    t.string('token');
  },
});

// Helper function to check the validity of a token then extract and return its contents.
const verifyAndDecodeToken = (token) => {
  const decodedToken: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  if (!decodedToken) {
    // Could write something like this to a log for analytics for the development team.
    console.log('Unauthorized User Detected');
    return;
  }
  return decodedToken;
};

// Queries for Frontend to Backend.
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('getUser', {
      type: User,
      args: {
        token: stringArg(),
      },
      resolve: async (parent, { token }, ctx) => {
        const tokenData = verifyAndDecodeToken(token);

        const user = await prisma.user.findOne({
          where: { email: tokenData.email },
        });
        return user;
      },
    });

    t.field('getAllUserImages', {
      type: 'String',
      args: {
        token: stringArg(),
      },
      resolve: async (parent, args, ctx) => {
        let images = await prisma.image.findMany();

        images = images.filter((image) => {
          return !image.privateImg;
        });

        const string_images = JSON.stringify(images);

        return string_images;
      },
    });
  },
});

// Mutations for Frontend to Backend.
const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // custom resolver for images from frontend.
    t.field('uploadImage', {
      type: Image,
      args: {
        input: arg({
          type: ImageInput,
          required: true,
        }),
        token: stringArg({ nullable: false }),
      },
      resolve: async (parent, { input, token }, ctx) => {
        const tokenData = verifyAndDecodeToken(token);

        // Configure AWS with access and secret keywith bluebird promise.
        aws.config.setPromisesDependency(require('bluebird'));
        aws.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.ACCESS_KEY_SECRET,
          region: process.env.REGION,
        });

        const s3 = new aws.S3();
        const base64Data = Buffer.from(
          input.path.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
        const type = input.path.split(';')[0].split('/')[1];
        const userId = uuidv4();

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${userId}.${type}`,
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: `image/${type}`,
        };

        let location = '';
        let key = '';
        try {
          const { Location, Key } = await s3.upload(params).promise();
          location = Location;
          key = Key;
        } catch (error) {
          console.log(error);
        }
        // Now need to upload the image into the database with no id needed.
        // Need to set the url to location for the upload.

        try {
          await prisma.image.create({
            data: {
              url: location,
              privateImg: false,
              userEmail: tokenData.email,
              User: {
                connect: { id: tokenData.id },
              },
            },
          });
        } catch (error) {
          console.log(error);
        }

        return {
          id: 1,
          userId: 11,
          privateImg: false,
          url: location,
        };
      },
    });

    t.field('loginUser', {
      type: Token,
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (parent, args, ctx) => {
        const user = await prisma.user.findOne({
          where: { email: String(args.email) },
        });

        const inputHash = crypto
          .pbkdf2Sync(args.password, user.salt, 1000, 64, 'sha512')
          .toString('hex');

        const passwordsMatch = user.hash === inputHash;

        if (!passwordsMatch) {
          return;
        }

        // Should return the token here which contains the user info in the body.
        // The user will then store this token in the localstore.
        // make sure we do not return the hash and salt to the client.
        const returnedUser = {
          email: user.email,
          id: user.id,
        };
        return {
          token: jwt.sign(returnedUser, process.env.JWT_TOKEN_SECRET, {
            expiresIn: '1d',
          }),
        };
      },
    });

    t.field('signupUser', {
      type: Token,
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (parent, { email, password }, ctx) => {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto
          .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
          .toString('hex');

        const user = await prisma.user.create({
          data: {
            email,
            hash,
            salt,
          },
        });

        // We should return the token here with their user info.
        // The user will then store the token in their localstore.
        const returnedUser = {
          email: user.email,
          id: user.id,
        };
        return { token: jwt.sign(returnedUser, process.env.JWT_TOKEN_SECRET) };
      },
    });

    t.field('photoVisibility', {
      type: 'String',
      args: {
        imgUrl: stringArg(),
        token: stringArg(),
      },
      resolve: async (parent, { imgUrl, token }, ctx) => {
        verifyAndDecodeToken(token);

        const fetchOneImg = await prisma.image.findOne({
          where: {
            url: imgUrl,
          },
        });
        await prisma.image.update({
          where: {
            url: imgUrl,
          },
          data: {
            privateImg: !fetchOneImg.privateImg,
          },
        });
        return '';
      },
    });

    t.field('deletePhoto', {
      type: 'String',
      args: {
        imgUrl: stringArg(),
        token: stringArg(),
      },
      resolve: async (parent, { imgUrl, token }, ctx) => {
        verifyAndDecodeToken(token);
        // Note that user can delete the images of other users if they use the api directly.
        // Need to correct security issue here.
        await prisma.image.delete({
          where: {
            url: imgUrl,
          },
        });
        return imgUrl;
      },
    });
  },
});

// Combine all Queries, Mutations, and Models to generate the nexus-typegen and schema.
export const schema = makeSchema({
  types: [Query, Mutation, Image, User],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql'),
  },
});

// With Next.js with Apollo (Apollo-Server-Micro) you are going to run into an issue here.
// For the API, bodyParser must be false, this disables the bodyParser for Next.js.
// Not setting bodyParser to false, causes this server to hang on requests.
export const config = {
  api: {
    bodyParser: false,
  },
};

// It would be ideal to move the authentication into the context and to attach the token
// to the user's request headers.
export default new ApolloServer({
  schema,
  context({ req }) {
    // Ideally have authorization code from helper here.
    // Need to attach tokens to request headers as opposed to passing tokens as args to resolvers.
    // This can be done on the frontend in Apollo Client.
    // Context maybe implemented differently between Apollo-Server and Apollo-Server-Micro.
  },
}).createHandler({
  path: '/api',
});
