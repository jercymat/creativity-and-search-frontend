import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function RightIconButton(props) {
  const { className, variant, onClick, btnText, fsIcon } = props;

  return (
    <Button
      className={`px-3${ className !== undefined ? ' ' + className : ''}`}
      variant={variant}
      onClick={onClick}
    >
      <span className='me-2'>{btnText}</span>
      <FontAwesomeIcon icon={ fsIcon } />
    </Button>
  )
}

RightIconButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func
}

export default RightIconButton;