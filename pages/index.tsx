import welcome from '../public/images/welcome_cats.svg';
import styles from './index.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroContainer}>
        <img className={styles.heroImage} src={welcome} />
      </div>

      <div className={styles.challengeContainer}>
        <h1>Shopify SRE Challenge 2021</h1>
        <h2>By Andrea Swartz</h2>
      </div>

      <div className={styles.featuresContainer}>
        <h1>Features</h1>
        <h2>Search For Movies</h2>
        <h2>Search For Images in the Image Repository Uploaded by Users</h2>
        <h2>Sign up and upload your own images</h2>
      </div>

      <div className={styles.featuresContainer}>
        <h1>Technology Used</h1>
        <h2>Nextjs with React</h2>
        <h2>Apollo Client</h2>
        <h2>Apollo Server</h2>
        <h2>Prisma</h2>
        <h2>Nexus</h2>
        <h2>JSON Web Token Auth</h2>
        <h2>Google Cloud SQL</h2>
        <h2>AWS S3 Bucket Image Hosting</h2>
        <h2>Amazon Rekognition</h2>
        <h2>Axios</h2>
        <h2>Jest Unit and Integration Testing</h2>
      </div>
    </div>
  );
}
