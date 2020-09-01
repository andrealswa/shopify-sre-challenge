import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { Token } from 'graphql';
import jwt from 'jsonwebtoken';

let signedInField = false
let email = ""
if (typeof window !== 'undefined') {
  const token = localStorage.getItem("token")
  if (token) {
    const decodedToken: any = jwt.decode(token)
    console.log(decodedToken)
    signedInField = true
    email = decodedToken.email
  }
}


export const signedInVar = makeVar({
  signedInField: signedInField,
  email: email,
});


export const client = new ApolloClient({
  uri: "https://shopify-sre-challenge.vercel.app", //"http://localhost:3000/api",
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
