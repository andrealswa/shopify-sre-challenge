import '../styles/globals.css';
import { Navbar } from '../components/Navbar/Navbar';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';



function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Component {...pageProps} />
    </ApolloProvider >
  );
}

export default MyApp;
