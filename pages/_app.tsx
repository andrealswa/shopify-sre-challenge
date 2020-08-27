import '../styles/globals.css';
import { Navbar } from '../components/Navbar/Navbar';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';



function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <div>
      <Navbar />
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </div>
  );
}

export default MyApp;
