import { MovieNominationList } from '../components/MovieNominationList/MovieNominationList';
import { MovieSearchList } from '../components/MovieSearchList/MovieSearchList';
import styles from './moviesearch.module.css';
import { moviesListNominatedState } from '../lib/recoil-atoms';
import { useRecoilState } from 'recoil';
import Alert from '@material-ui/lab/Alert';

const movieSearch = () => {


  const [moviesNominated, setMoviesNominated] = useRecoilState(
    moviesListNominatedState
  );

  return (
    <div className={styles.container}>
      {moviesNominated.length >= 5 && <Alert severity="success">You have nominated 5 movies</Alert>
      }
      <h1>Search for and Nominate Movies</h1>
      <div>
        <div>
          <MovieSearchList />
        </div>
        <div className={styles.movieNominationListContainer}>
          <MovieNominationList />
        </div>
      </div>
    </div >
  );
};

export default movieSearch;
