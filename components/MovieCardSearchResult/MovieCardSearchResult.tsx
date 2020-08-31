import { useRecoilState } from 'recoil';
import {
  moviesListNominatedState,
  moviesListSearchedState,
} from '../../lib/recoil-atoms';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styles from './MovieCardSearchResult.module.css';

export const MovieCardSearchResult = (props) => {
  const [moviesListNominate, setMoviesListNominate] = useRecoilState(
    moviesListNominatedState
  );

  const handleNomination = () => {
    // Cannot nominate film if 5 are already nominated.
    if (moviesListNominate.length >= 5) return;

    // To check if already nominated
    const filterResults = moviesListNominate.filter(movie => {
      return movie.Title === props.movie.Title
    })

    if (filterResults.length !== 0) return

    // add current movie to nominations
    setMoviesListNominate([...moviesListNominate, props.movie]);
  };

  return (
    <Card className={styles.rootCard}>
      <CardActionArea>
        <CardMedia
          className={styles.mediaCard}
          image={props.movie.Poster}
          title={props.movie.Title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.movie.Title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {props.movie.Year}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button onClick={handleNomination} size="small" color="primary">
          Nominate
        </Button>
      </CardActions>
    </Card>
  );
};

// Poster: "https://m.media-amazon.com/images/M/MV5BMjIyZGU4YzUtNDkzYi00ZDRhLTljYzctYTMxMDQ4M2E0Y2YxXkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg"
// Title: "Harry Potter and the Deathly Hallows: Part 2"
// Type: "movie"
// Year: "2011"
// imdbID: "tt1201607"