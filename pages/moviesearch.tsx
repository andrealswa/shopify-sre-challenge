import { MovieNominationList } from '../components/MovieNominationList/MovieNominationList';
import { MovieSearchList } from '../components/MovieSearchList/MovieSearchList';
import styles from './moviesearch.module.css';

const movieSearch = () => {
  return (
    <div className={styles.container}>
      <h1>Search for and Nominate Movies</h1>
      <div>
        <div>
          <MovieSearchList />
        </div>
        <div className={styles.movieNominationListContainer}>
          <MovieNominationList />
        </div>
      </div>
    </div>
  );
};

export default movieSearch;
