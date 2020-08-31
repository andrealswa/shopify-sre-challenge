import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './Navbar.module.css';
import { gql, useQuery } from '@apollo/client';
import { client, signedInVar } from '../../apollo/client';


const GET_SIGNED_IN = gql`
query SignedIn {
  signedInObject @client
}
`;

export const Navbar = () => {
  const { data, loading, error } = useQuery(GET_SIGNED_IN);

  // if signed in, show only logout.
  // if not signed in, show only login and signup.
  const handleLogout = () => {
    localStorage.setItem('token', '');
    client.resetStore();
    signedInVar({ signedInField: false, email: '' });
    console.log('logged out');
  };

  if (loading) {
    return <div>loading...</div>;
  }

  if (data)
    return (
      <div>
        <AppBar position="static">
          <div className={styles.toolbarContainer}>
            <Toolbar className={styles.toolbar}>
              <Link href="/">
                <Typography className={styles.menuItemSpace} variant="h6">
                  <a>Home</a>
                </Typography>
              </Link>

              <Link href="/moviesearch">
                <Typography variant="h6" className={styles.menuItemSpace}>
                  <a>Movie Search</a>
                </Typography>
              </Link>

              <Link href="/imagerepository">
                <Typography variant="h6" className={styles.menuItemSpace}>
                  <a>Image Repository</a>
                </Typography>
              </Link>

              {data.signedInObject.signedInField && (
                <Link href="/imageupload">
                  <Typography variant="h6" className={styles.menuItemSpace}>
                    <a>My Images</a>
                  </Typography>
                </Link>
              )}

              <div className={styles.loginItem}>
                {!data.signedInObject.signedInField && (
                  <span>
                    <Link href="/login">
                      <a>
                        <Button variant="contained" color="primary">
                          Log in
                        </Button>
                      </a>
                    </Link>
                  </span>
                )}
                {!data.signedInObject.signedInField && (
                  <span className={styles.signup}>
                    <Link href="/signup">
                      <a>
                        <Button color="inherit">Sign up</Button>
                      </a>
                    </Link>
                  </span>
                )}

                {data.signedInObject.signedInField && (
                  <span className={styles.displayEmail}>
                    {data.signedInObject.email}
                  </span>
                )}
                {data.signedInObject.signedInField && (
                  <span>
                    <Link href="/">
                      <a>
                        <Button onClick={handleLogout} variant="contained" color="primary">
                          Log out
                        </Button>
                      </a>
                    </Link>
                  </span>
                )}
              </div>
            </Toolbar>
          </div>
        </AppBar>
      </div>
    );
};
