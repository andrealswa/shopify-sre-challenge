import { atom } from 'recoil';

export const moviesListSearchedState = atom({
  key: 'moviesListSearchedState', // a unique id among the other atoms/selectors
  default: [
    { name: 'avengers', year: 2010 },
    { name: 'black mirror', year: 2013 },
  ], // the initial value
});

export const moviesListNominatedState = atom({
  key: 'moviesListNominatedState', // a unique id among the other atoms/selectors
  default: [
    { name: 'the dark knight', year: 2008 },
    { name: 'lord of the rings the fellowship of the ring', year: 2001 },
  ], // the initial value
});
