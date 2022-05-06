// import logo from './logo.svg';
import './App.scss';
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
  faImage
}  from '@fortawesome/free-solid-svg-icons'
import { Container } from 'react-bootstrap';
import DefaultLayout from './layouts/Default';
import LoginLayout from './layouts/Login';
import TestLayout from './layouts/Test';
import { GlobalContextProvider } from './store';
import config from './config';
import { ReactSession } from 'react-client-session';

// import fontawesome icons for global use
library.add(faChevronLeft, faChevronRight, faMagnifyingGlass, faTrashCan, faFont, faLink, faPlus, faImage);

// initial website title
document.title = config.PRODUCT_NAME;

function App(props) {
  // set react-client-session storage type
  ReactSession.setStoreType('localStorage');

  return (
    <GlobalContextProvider>
      <Container id='im-root-wrap' fluid>
        <Routes>
          <Route path='/test' element={<TestLayout />} />
          <Route path='/login' element={<LoginLayout />}/>
          <Route path='/*' element={<DefaultLayout />}/>
        </Routes>
      </Container>
    </GlobalContextProvider>
  );
}

export default App;
