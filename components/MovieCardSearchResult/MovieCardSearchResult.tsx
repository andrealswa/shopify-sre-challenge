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

    // add current movie to nominations
    setMoviesListNominate([...moviesListNominate, props.movie]);
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
            Year: {props.movie.year}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
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
