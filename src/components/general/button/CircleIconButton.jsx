import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function CircleIconButton(props) {
  const { className, variant, onClick, fsIcon, disabled, padding, type, form } = props;

  return (
    <Button
      className={`rounded-circle px-${padding !== undefined ? padding : 0}${className !== undefined ? ' ' + className : ''}`}
      style={{height: '36px', width: '36px'}}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      form={form}
      ><FontAwesomeIcon icon={fsIcon} /></Button>
  )
}

CircleIconButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
  padding: PropTypes.number,
  type: PropTypes.string,
  form: PropTypes.string
}

export default CircleIconButton;