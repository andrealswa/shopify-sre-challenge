import '../styles/globals.css';
import { Navbar } from '../components/Navbar/Navbar';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';



function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
