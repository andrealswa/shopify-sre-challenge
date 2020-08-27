import { makeSchema, objectType, stringArg, asNexusMethod, scalarType, inputObjectType, arg } from '@nexus/schema'
import { GraphQLDate } from 'graphql-iso-date'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'; // for unique images
import crypto from 'crypto'; // for signupUser mutation
import path from 'path'
import aws from 'aws-sdk'
import * as FileType from "file-type";


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
    t.field("uploadImage", {
      type: Image,
      args: {
        input: arg({
          type: ImageInput, required: true
        })
      },
      resolve: ((_, { input }, ctx) => {

        // const res = await uploadImage(input.path);
        console.log(input.path)


        // return photon.images.create({
        //   data: {
        //     publicId: res.public_id,
        //     format: res.format,
        //     version: res.version.toString()
        //   }
        // });

        return {
          id: "123",
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

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
});