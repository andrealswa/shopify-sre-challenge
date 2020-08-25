import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Navbar } from '../components/Navbar/Navbar';
import welcome from '../public/images/welcome_cats.svg';

export default function Home() {
  return (
    <div>
      <img src={welcome} />
    </div>
  );
}
