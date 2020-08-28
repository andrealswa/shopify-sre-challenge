import { useState } from 'react';

import { gql, useMutation, useApolloClient, useQuery } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Login.module.css';
import { jsonwebtoken } from '../../apollo/client';

const LOGIN = gql`
  mutation LoginQuery($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

const GET_JSON_WEB_TOKEN = gql`
  query GetJsonWebToken {
    jsonwebtoken @client
  }
`;

const Login = () => {
  const client = useApolloClient();

  const [webTokenStore, setWebTokenStore] = useState('')

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const [loginUser] = useMutation(LOGIN);

  const { data } = useQuery(GET_JSON_WEB_TOKEN);


  const getCachedData = async () => {
    console.log(data)
  }

  async function handleLogin() {
    try {
      const results = await loginUser({
        variables: {
          email: email,
          password: password,
        },
      });
      console.log('A Login successful');
      console.log(results)
      console.log('Z Login successful');
      setWebTokenStore(JSON.stringify(results))
    } catch (error) {
      console.log(error);
      console.log('Error logging in');
    }
  }

  const validateEmail = (email: string) => {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regularExpression)) {
      setEmailInvalid(false);
    } else {
      setEmailInvalid(true);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length <= 5) {
      setPasswordInvalid(true);
    } else {
      setPasswordInvalid(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <Typography color="textSecondary" gutterBottom>
            Log in to Drop Images
          </Typography>
          <form className={styles.input} noValidate autoComplete="off">
            <TextField
              value={email}
              type="email"
              autoComplete="current-email"
              error={emailInvalid}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              label="Email"
            />
          </form>
          <form className={styles.input} noValidate autoComplete="off">
            <TextField
              value={password}
              type="password"
              autoComplete="current-password"
              error={passwordInvalid}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              label="Password"
            />
          </form>
          <div className={styles.loginButton}>
            <Button
              onClick={handleLogin}
              disabled={
                emailInvalid ||
                passwordInvalid ||
                email.length === 0 ||
                password.length === 0
              }
              variant="contained"
            >
              Log in
            </Button>
            {webTokenStore && <div>{webTokenStore}</div>}
            <Button onClick={getCachedData}>Get Cached Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
