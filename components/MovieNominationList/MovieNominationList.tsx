import { moviesListNominatedState } from '../../lib/recoil-atoms';
import { useRecoilState } from 'recoil';
import { MovieCardNominated } from '../MovieCardNominated/MovieCardNominated';

import styles from './MovieNominationList.module.css';

export const MovieNominationList = () => {
  const [moviesList, setMoviesList] = useRecoilState(moviesListNominatedState);

  return (
    <div><h1>
      Movie Nomination List</h1>
      <div className={styles.container}>
        {moviesList.map((movie, key) => {
          return <MovieCardNominated movie={movie} key={key} />;
        })}
      </div>
    </div>
  );
};
