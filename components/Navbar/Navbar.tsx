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
              <Link href="/">Home</Link>
            </Typography>
            <Typography variant="h6" className={styles.menuItemSpace}>
              <Link href="/imageupload">Image Repository</Link>
            </Typography>
            <Typography variant="h6" className={styles.menuItemSpace}>
              <Link href="/imageupload">Add / Delete Images</Link>
            </Typography>

            <div className={styles.loginItem}>
              <span>
                <Link href="/login">
                  <Button variant="contained" color="primary">
                    Log in
                  </Button>
                </Link>
              </span>
              <span className={styles.signup}>
                <Link href="/signup">
                  <Button color="inherit">Sign up</Button>
                </Link>
              </span>
            </div>
          </Toolbar>
        </div>
      </AppBar>
    </div>
  );
};
