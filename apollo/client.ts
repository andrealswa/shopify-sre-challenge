import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const jsonwebtoken = makeVar(5);

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        jsonwebtoken: {
          read() {
            return jsonwebtoken();
          }
        }
      }
    }
  }
});

export const client = new ApolloClient({
  uri: 'http://localhost:3000/api',
  cache: cache
});
