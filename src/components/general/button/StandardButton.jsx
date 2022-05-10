import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';


function StandardButton(props) {
  const { className, variant, btnText, onClick, disabled, padding, type, form } = props;

  return (
    <Button
      className={`px-${padding !== undefined ? padding : 3}${className !== undefined ? ' ' + className : ''}`}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      form={form}
    >{btnText}</Button>
  )
}

StandardButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  padding: PropTypes.number,
  type: PropTypes.string,
  form: PropTypes.string
}

export default StandardButton;