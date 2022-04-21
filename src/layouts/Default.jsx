import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import NavigationBar from '../components/general/navigation/NavigationBar';
import LandingPage from '../pages/Landing';
import SERPPage from '../pages/SERP';
import IdeaMapPage from '../pages/IdeaMap';

function DefaultLayout(props) {
  return (
    <Fragment>
      <NavigationBar id='im-header' />
      <div
        id='im-body'
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 96px)',
        }}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/search' element={<SERPPage />} />
          <Route path='/map' element={<IdeaMapPage />} />
        </Routes>
      </div>
    </Fragment>
  )
}

export default DefaultLayout;