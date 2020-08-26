import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <div>
      <AppBar position="static">
        <div className={styles.toolbarContainer}>
          <Toolbar className={styles.toolbar}>
            {/* <IconButton
              edge="start"
              className={styles.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton> */}
            <Typography className={styles.menuItemSpace} variant="h6">
              <Link href="/">
                <a>Home</a>
              </Link>
            </Typography>
            <Typography variant="h6" className={styles.menuItemSpace}>
              <Link href="/imageupload">
                <a>Image Repository</a>
              </Link>
            </Typography>
            <Typography variant="h6" className={styles.menuItemSpace}>
              <Link href="/imageupload">
                <a>Add / Delete Images</a>
              </Link>
            </Typography>

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
            </div>
          </Toolbar>
        </div>
      </AppBar>
    </div>
  );
};
