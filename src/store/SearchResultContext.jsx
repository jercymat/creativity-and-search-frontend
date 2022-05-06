import propTypes from "prop-types";
import { createContext, useState } from "react";

export const SearchResultContext = createContext({
  bufferedSearch: {
    results: [],
    q: '',
    page: 1,
    totalCount: 0
  },
  updateBufferedSearch: newSearch => console.log(newSearch),
  savedResults: [],
  updateSavedResults: newResults => console.log(newResults)
});

export function SearchResultContextProvider(props) {
  const [search, setSearch] = useState({
    results: [],
    q: '',
    page: 1,
    totalCount: 0
  });
  const [sr, setSr] = useState([]);
  
  const setBufferedSearch = newResult => setSearch(newResult);
  const setSavedResults = newResults => setSr(newResults);

  const context = {
    bufferedSearch: search,
    updateBufferedSearch: setBufferedSearch,
    savedResults: sr,
    updateSavedResults: setSavedResults
  }

  return (<SearchResultContext.Provider value={context}>
    {props.children}
  </SearchResultContext.Provider>)
}

SearchResultContextProvider.propTypes = {
  children: propTypes.node
}