import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function CircleIconButton(props) {
  const { className, variant, onClick, fsIcon, type } = props;

  return (
    <Button
      className={`rounded-circle px-0${className !== undefined ? ' ' + className : ''}`}
      style={{height: '36px', width: '36px'}}
      variant={variant}
      onClick={onClick}
      type={type}><FontAwesomeIcon icon={fsIcon} /></Button>
  )
}

CircleIconButton.propTypes = {
  variant: PropTypes.string.isRequired,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string
}

export default CircleIconButton;