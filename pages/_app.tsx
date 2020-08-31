import '../styles/globals.css';
import { Navbar } from '../components/Navbar/Navbar';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo/client';
import { RecoilRoot } from 'recoil';



function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <RecoilRoot>
        <Navbar />
        <Component {...pageProps} />
      </RecoilRoot>
    </ApolloProvider >
  );
}

export default MyApp;
