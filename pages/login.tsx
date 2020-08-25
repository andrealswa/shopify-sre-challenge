import Login from '../components/Login/Login';

import styles from './login.module.css';

const login = () => {
  return (
    <div className={styles.background}>
      <Login />
    </div>
  );
};

export default login;
