import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function IconButton(props) {
  const { className, variant, onClick, fsIcon, padding, type } = props;

  return (
    <Button
      className={`px-${padding !== undefined ? padding : 3}${className !== undefined ? ' ' + className : ''}`}
      variant={variant}
      onClick={onClick}
      type={type}><FontAwesomeIcon icon={fsIcon} /></Button>
  )
}

IconButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  padding: PropTypes.number,
  type: PropTypes.string
}

export default IconButton;