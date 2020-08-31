import { makeSchema, objectType, stringArg, asNexusMethod, inputObjectType, arg } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'; // for unique images
import crypto from 'crypto'; // for signupUser mutation
import path from 'path'
import aws from 'aws-sdk'
import jwt from 'jsonwebtoken';


import dotenv from 'dotenv'
dotenv.config()

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

const prisma = new PrismaClient()

const Image = objectType({
  name: "Image",
  definition(t) {
    t.id("id");
    t.string("url");
    t.boolean('privateImg');
    t.int('userId');
  }
});

const ImageInput = inputObjectType({
  name: "ImageInput",
  definition(t) {
    t.string("path", { required: true });
  }
});

const Token = objectType({
  name: 'Token',
  definition(t) {
    t.string('token');
  },
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('email')
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('getUserImages', {
      type: 'String',
      args: {
        token: stringArg(),
      },
      resolve: async (_, { token }, ctx) => {
        const images = await prisma.image.findMany();
        const string_images = JSON.stringify(images);
        console.log(JSON.parse(string_images));

        return string_images;
      },
    })

    t.field('getAllUserImages', {
      type: 'String',
      args: {
        token: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        let images = await prisma.image.findMany();
        images = images.filter((image) => {
          return !image.privateImg;
        });

        const string_images = JSON.stringify(images);
        console.log(JSON.parse(string_images));

        return string_images;
      },
    });
  },
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // custom resolver for images from frontend
    t.field('uploadImage', {
      type: Image,
      args: {
        input: arg({
          type: ImageInput,
          required: true,
        }),
        token: stringArg({ nullable: false })
      },
      resolve: async (_, { input, token }, ctx) => {
        console.log('AT RESOLVER FOR UPLOAD IMAGE');

        // const res = await uploadImage(input.path);
        console.log(input.path);
        console.log('User passed token image upload: ' + token);

        // Ensure that the token isn't fradulent.
        const decoded_token: any = jwt.verify(
          token,
          process.env.JWT_TOKEN_SECRET
        );
        if (!decoded_token) {
          console.log('unauthorized user detected');
          return;
        }
        // User is valid
        console.log(decoded_token);

        // Configure AWS with your access and secret key.

        // Configure AWS to use promise
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
          Key: `${userId}.${type}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64', // required
          ContentType: `image/${type}`, // required. Notice the back ticks
        };

        let location = '';
        let key = '';
        try {
          const { Location, Key } = await s3.upload(params).promise();
          location = Location;
          key = Key;
        } catch (error) {
          // console.log(error)
        }

        console.log(location, key);

        // Now need to upload the image into the database with no id needed
        // need to set the url to location for the upload

        console.log('adding image to database...');
        try {
          await prisma.image.create({
            data: {
              url: location,
              privateImg: false,
              userEmail: decoded_token.email, // applied any type, no time to write interface
            },
          });
          console.log('added image to database');
        } catch (error) {
          console.log(error);
          console.log('error adding image to database');
        }

        return {
          id: location,
          userId: 11,
          privateImg: false,
          url: 'www.goaway.com',
        };
      },
    });

    t.field("loginUser", {
      type: Token,
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: async (_, args, ctx) => {
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
      resolve: async (_, { email, password }, ctx) => {
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
        token: stringArg()
      },
      resolve: async (_, { imgUrl, token }, ctx) => {
        console.log(imgUrl)
        console.log(token)
        const decodedToken: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
        const fetchOneImg = await prisma.image.findOne({
          where: {
            url: imgUrl
          }
        })
        await prisma.image.update({
          where: {
            url: imgUrl
          }, data: {
            privateImg: !fetchOneImg.privateImg
          }
        })
        return ""
      }
    })

    t.field('deletePhoto', {
      type: 'String',
      args: {
        imgUrl: stringArg(),
        token: stringArg()
      },
      resolve: async (_, { imgUrl, token }, ctx) => {
        console.log(imgUrl)
        console.log(token)
        const decodedToken: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET)
        const fetchOneImg = await prisma.image.findOne({
          where: {
            url: imgUrl
          }
        })
        await prisma.image.delete({
          where: {
            url: imgUrl
          }
        })
        return ""
      }
    })
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, Image, User, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql'),
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  schema,
  context({ req }) { },
}).createHandler({
  path: '/api',
});
