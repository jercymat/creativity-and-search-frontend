import propTypes from "prop-types";
import { createContext, useState } from "react";

export const GlobalContext = createContext({
  savedAreaWidth: 400,
  updateSavedAreaWidth: (newWidth) => {console.log(newWidth)},
});

export function GlobalContextProvider(props) {
  const [saw, setSaw] = useState(300);
  const context = {
    savedAreaWidth: saw,
    updateSavedAreaWidth: setSavedAreaWidth
  };

  function setSavedAreaWidth(newWidth) {
    setSaw((prev) => newWidth);
  }

  return (<GlobalContext.Provider value={context}>
    {props.children}
  </GlobalContext.Provider>)
}

GlobalContextProvider.propTypes = {
  children: propTypes.node
}