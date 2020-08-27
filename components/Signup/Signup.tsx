import { useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styles from './Signup.module.css';

const SignUpMutation = gql`
  mutation SignUpMutation($email: String!, $password: String!) {
    signupUser(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [checkPasswordInvalid, setCheckPasswordInvalid] = useState(false);

  // use gql mutation
  const [signUp] = useMutation(SignUpMutation);

  // handle signing up a user
  const handleSubmit = async () => {
    event.preventDefault();

    try {
      await signUp({
        variables: {
          email: email,
          password: password,
        },
      });

      console.log('success!');
    } catch (error) {
      console.log('something is wrong');
    }
  };

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

  const validateCheckPassword = (checkPassword: string) => {
    if (password.localeCompare(checkPassword) !== 0) {
      setCheckPasswordInvalid(true);
    } else {
      setCheckPasswordInvalid(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <Typography color="textSecondary" gutterBottom>
            Sign in to Drop Images
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
              id="standard-basic"
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
              id="standard-basic"
              label="Password"
            />
          </form>
          <form className={styles.input} noValidate autoComplete="off">
            <TextField
              value={checkPassword}
              type="password"
              autoComplete="current-password"
              error={checkPasswordInvalid}
              onChange={(e) => {
                setCheckPassword(e.target.value);
                validateCheckPassword(e.target.value);
              }}
              id="standard-basic"
              label="Verify Password"
            />
          </form>
          <div className={styles.loginButton}>
            <Button
              disabled={
                emailInvalid ||
                passwordInvalid ||
                checkPasswordInvalid ||
                email.length === 0 ||
                password.length === 0 ||
                checkPassword.length === 0
              }
              onClick={handleSubmit}
              variant="contained"
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
