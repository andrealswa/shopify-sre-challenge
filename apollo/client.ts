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

let uri = "https://shopify-sre-challenge.vercel.app/api";
const onMachine = process.env.ON_LOCAL_MACHINE + ""
if (onMachine.localeCompare('TRUE') === 0) {
  uri = "http://localhost:3000/api"
}

export const client = new ApolloClient({
  uri: uri,
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
