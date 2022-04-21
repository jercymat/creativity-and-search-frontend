import propTypes from "prop-types";
import { createContext, useState } from "react";

const AppContext = createContext({
  savedAreaWidth: 400,
  updateSavedAreaWidth: (newWidth) => {console.log(newWidth)},
  savedResults: [],
  updateSavedResults: (newResults) => {console.log(newResults)},
});

export function AppContextProvider(props) {
  const [saw, setSaw] = useState(300);
  const [sr, setSr] = useState(Array.from({ length: 10 }, (_, k) => ({
    id: `${k + 1}`,
    title: `Test Title ${k + 1}`,
    url: 'https://test.com',
    desc: 'Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description, Test description test description. Test description test description.'
  })));
  const context = {
    savedAreaWidth: saw,
    updateSavedAreaWidth: setSavedAreaWidth,
    savedResults: sr,
    updateSavedResults: setSavedResults
  };

  function setSavedAreaWidth(newWidth) {
    setSaw((prev) => newWidth);
  }

  function setSavedResults(newResults) {
    setSr((prev) => newResults);
  }

  return (<AppContext.Provider value={context}>
    {props.children}
  </AppContext.Provider>)
}

AppContextProvider.propTypes = {
  children: propTypes.node
}

export default AppContext;