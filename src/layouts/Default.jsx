import { Navigate, Route, Routes } from "react-router-dom";
import { NavigationBar } from '../components/general/navigation';
import { IdeaMapperPage, LandingPage, SERPPage } from "../pages";
import { connect } from 'react-redux';
import { useTracking } from "react-tracking";
import PropTypes from 'prop-types';

function DefaultLayout(props) {
  const { isLoggedin } = props;
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
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/search' element={ isLoggedin ? <SERPPage /> : <Navigate replace to='/login' />} />
          <Route path='/map' element={ isLoggedin ? <IdeaMapperPage /> : <Navigate replace to='/login' />} />
        </Routes>
      </div>
    </Track>
  )
}

DefaultLayout.propTypes = {
  isLoggedin: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  isLoggedin: state.global.isLoggedin
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);