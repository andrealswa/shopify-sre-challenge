import { useRecoilState } from 'recoil';
import { moviesListNominatedState } from '../../lib/recoil-atoms';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './MovieCardNominated.module.css';

export const MovieCardNominated = (props) => {
  const [moviesList, setMoviesList] = useRecoilState(moviesListNominatedState);

  const handleRemoveNomination = () => {
    setMoviesList(
      moviesList.filter((movie) => {
        // .localeCompare of 0 means the movies are identica
        return movie.name.localeCompare(props.movie.name) !== 0;
      })
    );
  };

  return (
    <Card className={styles.rootCard}>
      <CardActionArea>
        <CardMedia
          className={styles.mediaCard}
          image="/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.movie.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="h2">
            {props.movie.year}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={handleRemoveNomination} size="small" color="primary">
          Remove From Nominations
        </Button>
      </CardActions>
    </Card>
  );
};
