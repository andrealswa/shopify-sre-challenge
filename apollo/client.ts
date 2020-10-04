import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { Token } from 'graphql';
import jwt from 'jsonwebtoken';

let signedInField = false;
let email = '';
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken: any = jwt.decode(token);
    console.log(decodedToken);
    signedInField = true;
    email = decodedToken.email;
  }
}

export const signedInVar = makeVar({
  signedInField: signedInField,
  email: email,
});

const prod = process.env.NODE_ENV === 'production';

export const client = new ApolloClient({
  uri: 'http://localhost:3000/api', //"https://shopify-sre-challenge.vercel.app/api",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          signedInObject: {
            read() {
              return signedInVar();
            },
          },
        },
      },
    },
  }),
});
