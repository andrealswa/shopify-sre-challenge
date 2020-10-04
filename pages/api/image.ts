import {
  arg,
  extendType,
  inputObjectType,
  objectType,
  stringArg,
} from '@nexus/schema';
import aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from './index';
import { verifyAndDecodeToken } from './utils';

// Image models for frontend to backend api the client can directly call upon.
export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('id');
    t.string('url');
    t.boolean('privateImg');
    t.int('userId');
  },
});

export const getAllUserImages = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('getAllUserImages', {
      type: 'String',
      args: { token: stringArg() },
      resolve: async (parent, args, ctx) => {
        let images = await prisma.image.findMany();

        images = images.filter((image) => !image.privateImg);

        const string_images = JSON.stringify(images);

        return string_images;
      },
    });
  },
});

export const uploadImage = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('uploadImage', {
      type: Image,
      args: {
        path: stringArg({ nullable: false }),
        token: stringArg({ nullable: false }),
      },
      resolve: async (parent, { path, token }, ctx) => {
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
          path.replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
        const type = path.split(';')[0].split('/')[1];
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
  },
});

export const photoVisibility = extendType({
  type: 'Mutation',
  definition: (t) => {
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
  },
});

export const deletePhoto = extendType({
  type: 'Mutation',
  definition: (t) => {
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
