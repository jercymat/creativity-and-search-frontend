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
  faImage
}  from '@fortawesome/free-solid-svg-icons'
import { Container } from 'react-bootstrap';
import DefaultLayout from './layouts/Default';
import LoginLayout from './layouts/Login';
import { AppContextProvider } from './store/AppContext';
import TestLayout from './layouts/Test';

// import fontawesome icons for global use
library.add(faChevronLeft, faChevronRight, faMagnifyingGlass, faTrashCan, faFont, faLink, faImage);

function App(props) {
  return (
    <AppContextProvider>
      <Container id='im-root-wrap' fluid>
        <Routes>
          <Route path='/test' element={<TestLayout />} />
          <Route path='/login' element={<LoginLayout />}/>
          <Route path='/*' element={<DefaultLayout />}/>
        </Routes>
      </Container>
    </AppContextProvider>
  );
}

export default App;
