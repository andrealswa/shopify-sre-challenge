import { moviesListSearchedState } from '../../lib/recoil-atoms';
import { useRecoilState } from 'recoil';

import styles from './MovieSearchList.module.css';
import { MovieCardSearchResult } from '../MovieCardSearchResult/MovieCardSearchResult';
import { TextField } from '@material-ui/core';

export const MovieSearchList = () => {
  const [moviesList, setMoviesList] = useRecoilState(moviesListSearchedState);

  return (
    <div>
      <div className={styles.searchBarContainer}>
        <TextField
          id="outlined-basic"
          label="Movie Search"
          variant="outlined"
        />
      </div>
      Movie Search list
      <div className={styles.container}>
        {moviesList.map((movie, key) => {
          return <MovieCardSearchResult movie={movie} key={key} />;
        })}
      </div>
    </div>
  );
};
