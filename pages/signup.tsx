import React from 'react';
import Signup from '../components/Signup/Signup';

import styles from './signup.module.css';

const signup = () => {
  return (
    <div className={styles.background}>
      <Signup />
    </div>
  );
};

export default signup;
