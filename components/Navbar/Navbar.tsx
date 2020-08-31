import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './Navbar.module.css';
import { gql, useQuery } from '@apollo/client';
import { client, signedInVar } from '../../apollo/client';
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import { useState } from 'react'
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import MovieRoundedIcon from '@material-ui/icons/MovieRounded';
import ImageRoundedIcon from '@material-ui/icons/ImageRounded';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

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

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  if (data)
    return (
      <div>
        <div className={styles.desktopAppBar}>
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

        <div className={styles.mobileAppBar}>
          <div>
            <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
              <div>
                <Button onClick={toggleDrawer('left', false)} >
                  <Link href="/">
                    <Typography className={styles.menuItemSpace} variant="h6">
                      <a className={styles.drawerButton}><HomeRoundedIcon /> Home</a>
                    </Typography>
                  </Link>
                </Button>
              </div>

              <div>
                <Button onClick={toggleDrawer('left', false)}>
                  <Link href="/moviesearch">
                    <Typography variant="h6" className={styles.menuItemSpace}>
                      <a className={styles.drawerButton}><MovieRoundedIcon /> Movie Search</a>
                    </Typography>
                  </Link>
                </Button>
              </div>

              <div>
                <Button onClick={toggleDrawer('left', false)}>
                  <Link href="/imagerepository">
                    <Typography variant="h6" className={styles.menuItemSpace}>
                      <a className={styles.drawerButton}><ImageRoundedIcon />Image Repository</a>
                    </Typography>
                  </Link>
                </Button>
              </div>

              {data.signedInObject.signedInField && (
                <div>
                  <Button onClick={toggleDrawer('left', false)}>
                    <Link href="/imageupload">
                      <Typography variant="h6" className={styles.menuItemSpace}>
                        <a className={styles.drawerButton}><AccountBoxIcon />My Images</a>
                      </Typography>
                    </Link>
                  </Button>
                </div>
              )}
            </Drawer>
          </div>

          <AppBar position="static">
            <div className={styles.mobileToolbarContainer}>
              <Toolbar>
                <IconButton onClick={toggleDrawer('left', true)} edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>



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
      </div >
    );
};
