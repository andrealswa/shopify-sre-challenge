import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import styles from './Navbar.module.css';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';
import { client } from '../../apollo/client';


const AUTH_GUARD = gql`
  mutation {
    authGuard
  }
`;

export const Navbar = () => {

  const [showProfile, setShowProfile] = useState(false)
  const [authGuard] = useMutation(AUTH_GUARD)

  useEffect(() => {
    console.log("loaded navbar")
    handleAuthGuard()
  }, [])

  const handleLogout = () => {
    client.resetStore()
    console.log("logged out")
  }

  async function handleAuthGuard() {
    try {
      const authResult = await authGuard();
      console.log('Route access successful');
      if (authResult) {
        setShowProfile(true);
      }
    } catch (error) {
      console.log(error);
      console.log('Error accessing route');
      setShowProfile(false);
    }
  }


  return (
    <div>
      <AppBar position="static">
        <div className={styles.toolbarContainer}>
          <Toolbar className={styles.toolbar}>
            <Typography className={styles.menuItemSpace} variant="h6">
              <Link href="/">
                <a>Home</a>
              </Link>
            </Typography>
            <Typography variant="h6" className={styles.menuItemSpace}>
              <Link href="/imagerepository">
                <a>Image Repository</a>
              </Link>
            </Typography>

            {showProfile &&
              <Typography variant="h6" className={styles.menuItemSpace}>
                <Link href="/imageupload">
                  <a>My Images</a>
                </Link>
              </Typography>
            }

            <div className={styles.loginItem}>
              <span>
                <Link href="/login">
                  <a>
                    <Button variant="contained" color="primary">
                      Log in
                    </Button>
                  </a>
                </Link>
              </span>
              <span className={styles.signup}>
                <Link href="/signup">
                  <a>
                    <Button color="inherit">Sign up</Button>
                  </a>
                </Link>
              </span>
              <span>
                <Link href="/">
                  <a>
                    <Button onClick={handleLogout} variant="contained" color="primary">
                      Log out
                    </Button>
                  </a>
                </Link>
              </span>
            </div>
          </Toolbar>
        </div>
      </AppBar>
    </div>
  );
};
