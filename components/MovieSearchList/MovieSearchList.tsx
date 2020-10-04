import { moviesListSearchedState } from '../../lib/recoil-atoms';
import { useRecoilState } from 'recoil';
import axios from 'axios';

import styles from './MovieSearchList.module.css';
import { MovieCardSearchResult } from '../MovieCardSearchResult/MovieCardSearchResult';
import { TextField } from '@material-ui/core';

export const MovieSearchList = () => {
  const [moviesList, setMoviesList] = useRecoilState(moviesListSearchedState);
  const url = new URL('https://www.omdbapi.com/?apikey=75b50ccc');
  // const CancelToken = axios.CancelToken;
  // let cancel

  const handleMovieSearch = async (event) => {
    let results;
    url.searchParams.set('s', event.target.value.replace(' ', '_'));
    try {
      results = await axios.get(url.href);
    } catch (error) {
      console.log('Request cancelled');
    }
    if (results.data.Search) {
      interface SearchItem {
        Poster: String;
        Title: String;
        Type: String;
        Year: String;
        imdbID: String;
      }
      setMoviesList(
        results.data.Search.filter((item: SearchItem) => {
          return item.Type === 'movie';
        })
      );
    }
  };

  return (
    <div>
      <div className={styles.searchBarContainer}>
        <TextField
          onChange={(event) => handleMovieSearch(event)}
          id="outlined-basic"
          label="Movie Search"
          variant="outlined"
        />
      </div>

      {moviesList.length > 0 && <h1>Movie Search list</h1>}
      <div className={styles.container}>
        {moviesList.map((movie, key) => {
          return <MovieCardSearchResult movie={movie} key={key} />;
        })}
      </div>
    </div>
  );
};
