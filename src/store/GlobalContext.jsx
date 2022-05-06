import propTypes from "prop-types";
import { createContext, useState } from "react";
import { ReactSession } from 'react-client-session';

export const GlobalContext = createContext({
  isLoggedin: false,
  updateLoggedIn: (loggedIn, name) => console.log(loggedIn),
  userName: '',
  savedAreaWidth: 400,
  updateSavedAreaWidth: (newWidth) => {console.log(newWidth)},
});

export function GlobalContextProvider(props) {
  const [saw, setSaw] = useState(300);
  const [l, setL] = useState(ReactSession.get('username') !== undefined);
  const [n, setN] = useState(
    ReactSession.get('username') !== undefined
      ? ReactSession.get('username')
      : ''
  );
  const context = {
    isLoggedin: l,
    updateLoggedIn: setLoggedIn,
    userName: n,
    savedAreaWidth: saw,
    updateSavedAreaWidth: setSavedAreaWidth
  };

  function setLoggedIn(loggedIn, name) {
    if (loggedIn) {
      ReactSession.set('username', name);
      setN(name);
    } else {
      ReactSession.remove('username');
    }
    
    setL(loggedIn);
  }

  function setSavedAreaWidth(newWidth) {
    setSaw(newWidth);
  }

  return (<GlobalContext.Provider value={context}>
    {props.children}
  </GlobalContext.Provider>)
}

GlobalContextProvider.propTypes = {
  children: propTypes.node
}