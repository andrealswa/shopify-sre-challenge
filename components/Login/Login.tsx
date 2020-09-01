import { useState } from 'react';
import Router from 'next/router'

import { gql, useMutation, useApolloClient, useQuery } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Login.module.css';
import { signedInVar } from '../../apollo/client';

const LOGIN = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
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

  const handleLogin = async () => {
    if (typeof window !== 'undefined') {
      // ensure client has rendered view
      console.log(localStorage.getItem('token'));
    }

    const token = await loginUser({
      variables: {
        email: email,
        password: password,
      },
    });

    if (!token) {
      console.log('Error logging in');
      return;
    }
    console.log(token);

    console.log('token object: ' + JSON.stringify(token.data.loginUser.token));
    localStorage.setItem('token', token.data.loginUser.token);
    signedInVar({ signedInField: true, email: email });
    Router.push("/imageupload")
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
