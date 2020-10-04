import {
  makeSchema,
  objectType,
  stringArg,
  inputObjectType,
  arg,
} from '@nexus/schema';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';

import crypto from 'crypto';
import path from 'path';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUser, loginUser, signupUser, User } from './user';
import {
  deletePhoto,
  getAllUserImages,
  photoVisibility,
  uploadImage,
  Image,
} from './image';

// Allow use of root .env values.
dotenv.config();

// ORM api for backend to database.
export const prisma = new PrismaClient();

// Queries for Frontend to Backend.
const Query = objectType({
  name: 'Query',
  definition() {},
});

// Mutations for Frontend to Backend.
const Mutation = objectType({
  name: 'Mutation',
  definition() {
    // custom resolver for images from frontend.
  },
});

// Combine all Queries, Mutations, and Models to generate the nexus-typegen and schema.
const userSchema = [User, getUser, loginUser, signupUser];
const imageSchema = [
  Image,
  getAllUserImages,
  uploadImage,
  photoVisibility,
  deletePhoto,
];
export const schema = makeSchema({
  types: [Query, Mutation, ...userSchema, ...imageSchema],
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
