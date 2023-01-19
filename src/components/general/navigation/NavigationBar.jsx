import PropTypes from 'prop-types';
import config from '../../../config';
import { StandardButton } from '../button';
import { Container, Navbar } from 'react-bootstrap';
import AccountBadge from '../../account/AccountBadge';
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { LogoNavbar } from '../logo';
import { connect } from 'react-redux';

function NavigationBar(props) {
  const location = useLocation();
  const { id, userName, isLoggedin } = props;

  return (
    <Navbar id={ id } style={{padding: '1.5rem 0 1.5rem 0', zIndex: '5'}}>
      <Container style={{height: '48px'}} fluid>
        <div className='d-flex'>
          {location.pathname !== '/' && <LogoNavbar densed={location.pathname === '/search'} /> }
        </div>
        <div className='d-flex align-items-center h-100'>
          <LinkContainer to='/test' className={config.ENABLE_TEST_PAGE ? null : 'd-none'}>
            <StandardButton
              variant='light'
              btnText='Test' />
          </LinkContainer>
          { isLoggedin
            ? <AccountBadge
              userName={userName}
              userImage={`${process.env.PUBLIC_URL}/image/person_placeholder.png`} />
            : <LinkContainer to='/login'>
              <StandardButton
                variant='primary'
                btnText='Login' />
            </LinkContainer> }
        </div>
      </Container>
    </Navbar>
  );
}

NavigationBar.propTypes = {
  id: PropTypes.string,
  userName: PropTypes.string.isRequired,
  isLoggedin: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  userName: state.global.userName,
  isLoggedin: state.global.isLoggedin,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);