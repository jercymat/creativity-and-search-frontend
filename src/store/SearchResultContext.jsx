import propTypes from "prop-types";
import { createContext, useState } from "react";

export const SearchResultContext = createContext({
  searchResults: [],
  updateSearchResult: newResult => console.log(newResult),
  q: '',
  updateQ: newQ => console.log(newQ),
  page: 1,
  updatePage: newPage => console.log(newPage),
  savedResults: [],
  updateSavedResults: newResults => console.log(newResults)
});

export function SearchResultContextProvider(props) {
  const [ser, setSer] = useState([]); 
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [sr, setSr] = useState(Array.from({ length: 10 }, (_, k) => ({
    id: `${k + 1}`,
    title: `Test Title ${k + 1}`,
    url: 'https://test.com',
    desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description.'
  })));

  const setSearchResult = newSer => setSer(newSer);
  const setQuery = newQ => setQ(newQ);
  const setNowPage = newPage => setPage(newPage);
  const setSavedResults = newResults => setSr(newResults);

  const context = {
    searchResults: ser,
    updateSearchResult: setSearchResult,
    q: q,
    updateQ: setQuery,
    page: page,
    updatePage: setNowPage,
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