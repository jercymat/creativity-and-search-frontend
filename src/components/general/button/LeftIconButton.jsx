import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function LeftIconButton(props) {
  const { variant, onClick, btnText, fsIcon } = props;

  return (
    <Button
      className='px-3'
      variant={variant}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={fsIcon} />
      <span className='ms-2'>{btnText}</span>
    </Button>
  )
}

LeftIconButton.propTypes = {
  variant: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func
}

export default LeftIconButton;