import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
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
} from '@fortawesome/free-solid-svg-icons';
import { AccountLayout, DefaultLayout, TestLayout } from './layouts';
import './theme/bootstrap-theme.scss';
import './index.scss';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import config from './config';
import store from './store';

const root = ReactDOMClient.createRoot(document.getElementById('root'));

// import fontawesome icons for global use
library.add(
  faChevronLeft, faChevronRight, faMagnifyingGlass, faTrashCan,
  faFont, faLink, faPlus, faImage, faBars, faShareFromSquare
);

// initial website title
document.title = config.PRODUCT_NAME;

// set axios default to bring session cookie
axios.defaults.withCredentials = true;

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Container id='im-root-wrap' fluid>
        <Routes>
          <Route path='/test' element={<TestLayout />} />
          <Route path='/login' element={<AccountLayout />} />
          <Route path='/*' element={<DefaultLayout />} />
        </Routes>
      </Container>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
