import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { NavigationBar } from '../components/general/navigation';
import { IdeaMapPage, LandingPage, SERPPage } from "../pages";
import { GlobalContext, SearchResultContextProvider } from "../context";
import { useTracking } from "react-tracking";

function DefaultLayout(props) {
  const globalCtx = useContext(GlobalContext);
  const { Track } = useTracking(
    { layout: 'main' },
    {
      dispatch: data => {
        console.log(data);
        (window.loggedEvents = window.loggedEvents || []).push(data);
      }
    }
  );

  return (
    <Track>
      <NavigationBar id='im-header' />
      <div
        id='im-body'
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 96px)',
        }}>
        <SearchResultContextProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/search' element={ globalCtx.isLoggedin ? <SERPPage /> : <Navigate replace to='/login' />} />
            <Route path='/map' element={globalCtx.isLoggedin ? <IdeaMapPage /> : <Navigate replace to='/login' />} />
          </Routes>
        </SearchResultContextProvider>
      </div>
    </Track>
  )
}

export default DefaultLayout;