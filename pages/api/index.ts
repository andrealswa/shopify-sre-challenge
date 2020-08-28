import { makeSchema, objectType, stringArg, asNexusMethod, scalarType, inputObjectType, arg } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'; // for unique images
import crypto from 'crypto'; // for signupUser mutation
import path from 'path'
import aws, { PinpointEmail } from 'aws-sdk'
import * as FileType from "file-type";
import Iron from '@hapi/iron'
import { serialize } from 'cookie' // For making a new jwt


import dotenv from 'dotenv'
import { GraphQLError } from 'graphql';
dotenv.config()

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

const prisma = new PrismaClient()


const Upload = scalarType({
  name: "Upload",
  asNexusMethod: "upload", // We set this to be used as a method later as `t.upload()` if needed
  description: "desc",
  serialize: () => {
    throw new GraphQLError("Upload serialization unsupported.");
  },
  parseValue: async (value) => {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await FileType.fromStream(stream);

    if (fileType?.mime !== upload.mimetype)
      throw new GraphQLError("Mime type does not match file content.");

    return upload;
  },
  parseLiteral: (ast) => {
    throw new GraphQLError("Upload literal unsupported.", ast);
  },
});

const File = objectType({
  name: "File",
  definition(t) {
    t.id("id");
    t.string("path");
    t.string("filename");
    t.string("mimetype");
    t.string("encoding");
  },
});

const Image = objectType({
  name: "Image",
  definition(t) {
    t.id("id");
    t.string("publicId");
    t.string("format");
    t.string("version");
  }
});

const ImageInput = inputObjectType({
  name: "ImageInput",
  definition(t) {
    t.string("path", { required: true });
  }
});

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('email')
    t.list.field('posts', {
      type: 'Post',
      resolve: parent =>
        prisma.user
          .findOne({
            where: { id: Number(parent.id) },
          })
          .posts(),
    })
  },
})


const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('content', {
      nullable: true,
    })
    t.boolean('published')
    t.field('author', {
      type: 'User',
      nullable: true,
      resolve: parent =>
        prisma.post
          .findOne({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('post', {
      type: 'Post',
      args: {
        postId: stringArg({ nullable: false }),
      },
      resolve: (_, args) => {
        return prisma.post.findOne({
          where: { id: Number(args.postId) },
        })
      },
    })


    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('drafts', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: false },
        })
      },
    })

    t.list.field('getImages', {
      type: 'String',
      resolve: (_parent, _args, ctx) => {
        return null
      }
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {

    // authentication workflow is here
    t.field('loginUser', {
      type: 'String',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (_, args, ctx) => {

        // console.log("cooie from user")
        // console.log(ctx.req.headers.cookie)
        // console.log("cooie from user")

        // Need to get the salt and hash from the database
        const user = await prisma.user.findOne({ where: { email: String(args.email) } })

        // Need to hash the input password, then compare that to the stored hash
        const inputHash = crypto.pbkdf2Sync(args.password, user.salt, 1000, 64, 'sha512').toString('hex');
        const passwordsMatch = user.hash === inputHash;

        if (!passwordsMatch) {
          // passwords do not match
          return;
        }

        // Create the 'session' or content of the JWT token
        const session = {
          id: user.id,
          email: user.email
        }

        // await setLoginSession(context.res, session)
        const createdAt = Date.now()
        const MAX_AGE = 60 * 60 * 8
        const obj = { ...session, createdAt, maxAge: MAX_AGE }
        const token = await Iron.seal(obj, process.env.TOKEN_SECRET, Iron.defaults)

        // Then implement setTokenCookie(ctx.res, token )
        const TOKEN_NAME = 'token'
        const cookie = serialize(TOKEN_NAME, token, {
          maxAge: MAX_AGE,
          expires: new Date(Date.now() + MAX_AGE * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          sameSite: 'lax',
        })
        ctx.res.setHeader('Set-Cookie', cookie)

        // this marks the end of the auth token creation function chain

        // prisma.user.findOne({
        //   where: { email: String(args.email) }
        // })

        return "login user resolver"
      }
    })

    t.field("logoutUser", {
      type: "Boolean",
      resolve: (async (_, _input, ctx) => {
        console.log(ctx.req.headers.cookie)
        return true
      })
    })

    t.field("authGuard", {
      type: "Boolean",
      resolve: (async (_, _input, ctx) => {
        const currentCookieToken = ctx.req.headers.cookie

        if (!currentCookieToken) {
          return false
        }

        try {
          const decrypted_jwt = await Iron.unseal(currentCookieToken, process.env.TOKEN_SECRET, Iron.defaults);
          console.log(decrypted_jwt)
        } catch (err) {
          console.log(err.message);
          return false
        }

        console.log("auth Guard success")
        return true
      })
    })

    // custom resolver for images from frontend
    t.field("uploadImage", {
      type: Image,
      args: {
        input: arg({
          type: ImageInput, required: true
        })
      },
      resolve: (async (_, { input }, ctx) => {

        console.log("AT RESOLVER FOR UPLOAD IMAGE")

        // const res = await uploadImage(input.path);
        console.log(input.path)

        // Configure AWS with your access and secret key.

        // Configure AWS to use promise
        aws.config.setPromisesDependency(require('bluebird'));
        aws.config.update({ accessKeyId: process.env.ID, secretAccessKey: process.env.SECRET, region: process.env.REGION });


        const s3 = new aws.S3();
        const base64Data = Buffer.from(input.path.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = input.path.split(';')[0].split('/')[1];
        const userId = 1;

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: `${userId}.${type}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64', // required
          ContentType: `image/${type}` // required. Notice the back ticks
        }

        // return photon.images.create({
        //   data: {
        //     publicId: res.public_id,
        //     format: res.format,
        //     version: res.version.toString()
        //   }
        // });

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

        console.log("adding image to database...")
        try {
          await prisma.image.create({
            data: {
              url: location
            }
          });
          console.log("added image to database")
        } catch (error) {
          console.log(error)
          console.log("error adding image to database")
        }



        return {
          id: location,
          publicId: "111",
          format: "222",
          version: "333"
        }
      })
    });

    t.field('signupUser', {
      type: 'User',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false }),
      },
      resolve: (_, { email, password }, ctx) => {

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto
          .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
          .toString('hex');

        return prisma.user.create({
          data: {
            email,
            hash,
            salt
          }
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.delete({
          where: { id: Number(postId) },
        })
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: stringArg({ nullable: false }),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [Query, Mutation, Post, User, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql')
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
};

export default new ApolloServer({
  schema,
  context(ctx) {
    return ctx
  },
}).createHandler({
  path: '/api',
});