import { makeSchema, objectType, stringArg, asNexusMethod } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'; // for unique images
import crypto from 'crypto'; // for signupUser mutation
import path from 'path'
import aws from 'aws-sdk'

import dotenv from 'dotenv'
dotenv.config()

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

const prisma = new PrismaClient()

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
    t.string('imgUrl')
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

    t.field('loginUser', {
      type: 'User',
      args: {
        email: stringArg({ nullable: false }),
        password: stringArg({ nullable: false })
      },
      resolve: async (_, args) => {

        // Need to get the salt and hash from the database
        const user = await prisma.user.findOne({ where: { email: String(args.email) } })

        // Need to hash the input password, then compare that to the stored hash
        const inputHash = crypto.pbkdf2Sync(args.password, user.salt, 1000, 64, 'sha512').toString('hex');
        const passwordsMatch = user.hash === inputHash;

        if (!passwordsMatch) {
          // passwords do not match
          return;
        }

        return prisma.user.findOne({
          where: { email: String(args.email) }
        })
      }
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
    // custom resolver for images from frontend
    t.field('imageUpload', {
      type: File,
      args: {
        imgFile: "String"
      },
      resolve: (_, { imgFile }, ctx) => {
        const s3 = new aws.S3({
          accessKeyId: process.env.ID,
          secretAccessKey: process.env.SECRET
        });

        // convert from data_url to something aws s3 body can take.

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Region: 'ca-central-1',
          Key: `${uuidv4()}`, // File name you want to save as in S3
          Body: imgFile
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
          if (err) {
            throw err;
          }
          console.log(`File uploaded successfully. ${data.Location}`);
        });



        console.log("Image Uploaded To Database")
        return null
      }
    })

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

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
});