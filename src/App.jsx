import { Route, Routes } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faChevronRight,
  faChevronLeft,
  faMagnifyingGlass,
  faTrashCan,
  faFont,
  faLink,
  faPlus,
  faImage,
  faBars,
  faShareFromSquare,
}  from '@fortawesome/free-solid-svg-icons'
import { Container } from 'react-bootstrap';
import { GlobalContextProvider } from './context';
import { ReactSession } from 'react-client-session';
import axios from 'axios';
import './App.scss';
import config from './config';
import { AccountLayout, DefaultLayout, TestLayout } from './layouts';

// import fontawesome icons for global use
library.add(
  faChevronLeft, faChevronRight, faMagnifyingGlass, faTrashCan,
  faFont, faLink, faPlus, faImage, faBars, faShareFromSquare
);

// initial website title
document.title = config.PRODUCT_NAME;

// set axios default to bring session cookie
axios.defaults.withCredentials = true;

function App(props) {
  // set react-client-session storage type
  ReactSession.setStoreType('localStorage');

  return (
    <GlobalContextProvider>
      <Container id='im-root-wrap' fluid>
        <Routes>
          <Route path='/test' element={<TestLayout />} />
          <Route path='/login' element={<AccountLayout />}/>
          <Route path='/*' element={<DefaultLayout />}/>
        </Routes>
      </Container>
    </GlobalContextProvider>
  );
}

export default App;
