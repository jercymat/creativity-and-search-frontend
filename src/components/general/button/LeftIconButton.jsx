import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types';


function LeftIconButton(props) {
  const { className, variant, btnText, onClick, fsIcon, disabled, padding, type, form } = props;

  return (
    <Button
      className={`px-${padding !== undefined ? padding : 3}${className !== undefined ? ' ' + className : ''}`}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      form={form}
    >
      <FontAwesomeIcon icon={fsIcon} />
      <span className='ms-2'>{btnText}</span>
    </Button>
  )
}

LeftIconButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fsIcon: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
  padding: PropTypes.number,
  type: PropTypes.string,
  form: PropTypes.string
}

export default LeftIconButton;