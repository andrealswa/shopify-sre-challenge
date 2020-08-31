import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const jsonwebtoken = makeVar(5);

export const signedInVar = makeVar({
  signedInField: true,
  email: 'cats@gmail.com',
});

export const client = new ApolloClient({
  uri: 'http://localhost:3000/api',

  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          signedInObject: {
            read() {
              return signedInVar();
            }
          }
        }
      }
    }
  })
});
