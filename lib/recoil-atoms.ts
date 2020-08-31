import { atom } from 'recoil';

export const moviesListSearchedState = atom({
  key: 'moviesListSearchedState', // a unique id among the other atoms/selectors
  default: [

  ], // the initial value
});

export const moviesListNominatedState = atom({
  key: 'moviesListNominatedState', // a unique id among the other atoms/selectors
  default: [

  ], // the initial value
});
