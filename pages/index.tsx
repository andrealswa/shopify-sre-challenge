import welcome from '../public/images/welcome_cats.svg';
import styles from './index.module.css';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroContainer}>
        <img className={styles.heroImage} src={welcome} />
      </div>

      <div className={styles.challengeContainer}>
        <h1>Shopify Intern Challenge 2021</h1>
      </div>

      <div className={styles.cardContainer}>
        <Card className={styles.card}>
          <div className={styles.featuresContainer}>
            <CardContent>
              <h1 className={styles.titleText}>Features</h1>
              <Typography color="textSecondary" gutterBottom>
                Search For Movies
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Nominate 5 Favourite Movies
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Sign Up / Log In To Upload Your Own Images
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Users Can Add Or Delete Images In Their Personal Repository
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Users Can Make Images Private Or Public
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                View Public Images in the Image Repository Uploaded by Users
              </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
          </div>
        </Card>

        <Card className={styles.card}>
          <div className={styles.featuresContainer}>
            <CardContent>
              <h1 className={styles.titleText}>Instructions</h1>
              <Typography color="textSecondary" gutterBottom>
                This app is a hybrid of Shopify's Backend & Infrastructure / SRE Challenge and UX & Web Development Challenge.
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                For Movie Search, click on the Movie Search button in the nav bar and search for your favourite films to nominate! You can make up to 5 nominations.
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                For Image Repository,
                to view all images simply click on the Image Repository button in the nav bar. To upload your own images click the Sign Up button to create an account or use Login if you already have an account. You will be redirected to your personal image repository where you can choose to add images for either private or public visibility in the image repository.
              </Typography>




            </CardContent>
            <CardActions>
            </CardActions>
          </div>
        </Card>


        <Card className={styles.card}>
          <div className={styles.featuresContainer}>
            <CardContent>
              <h1 className={styles.titleText}>Technology Used</h1>
              <Typography color="textSecondary" gutterBottom>
                Nextjs with React
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Apollo Client & Server
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Recoil
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Prisma
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Nexus
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                JSON Web Token Auth
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Google Cloud SQL
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                AWS S3 Bucket Image Hosting
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Axios
              </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
          </div>
        </Card>
      </div>
    </div>
  );
}
