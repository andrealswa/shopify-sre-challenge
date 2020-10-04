import { extendType, objectType, stringArg } from '@nexus/schema';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { prisma } from './index';
import { Image } from './image';
import { verifyAndDecodeToken } from './utils';

export const User = objectType({
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

const Token = objectType({
  name: 'Token',
  definition(t) {
    t.string('token');
  },
});

export const getUser = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getUser', {
      type: User,
      args: { token: stringArg() },
      resolve: async (parent, { token }, ctx) => {
        const tokenData = verifyAndDecodeToken(token);

        const user = await prisma.user.findOne({
          where: { email: tokenData.email },
        });
        return user;
      },
    });
  },
});

export const loginUser = extendType({
  type: 'Mutation',
  definition: (t) => {
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
  },
});

export const signupUser = extendType({
  type: 'Mutation',
  definition: (t) => {
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
  },
});
