import PropTypes from 'prop-types';
import config from '../../../config';
import StandardButton from '../button/StandardButton';
import { Container, Navbar } from 'react-bootstrap';
import AccountBadge from '../../account/AccountBadge';
import LogoNavbar from '../logo/LogoNavbar';
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar(props) {
  const location = useLocation();
  const { id } = props;

  return (
    <Navbar id={ id } style={{padding: '1.5rem 0 1.5rem 0', zIndex: '999'}}>
      <Container style={{height: '48px'}} fluid>
        <div className='d-flex'>
          <LogoNavbar densed={location.pathname === '/search'} />
        </div>
        <div className='d-flex align-items-center h-100'>
          <LinkContainer to='/test' className={config.ENABLE_TEST_PAGE ? null : 'd-none'}>
            <StandardButton
              variant='light'
              btnText='Test' />
          </LinkContainer>
          <LinkContainer to='/login'>
            <StandardButton
              variant='primary'
              btnText='Login' />
          </LinkContainer>
          <AccountBadge
            userName='C. F. Frost'
            userImage='https://via.placeholder.com/150.jpg' />
        </div>
      </Container>
    </Navbar>
  );
}

NavigationBar.propTypes = {
  id: PropTypes.string
}

export default NavigationBar