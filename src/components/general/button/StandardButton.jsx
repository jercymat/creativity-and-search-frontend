import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';


function StandardButton(props) {
  const { className, variant, onClick, btnText, padding, type } = props;

  return (
    <Button
      className={`px-${padding !== undefined ? padding : 3}${className !== undefined ? ' ' + className : ''}`}
      variant={variant}
      onClick={onClick}
      type={type}
    >{btnText}</Button>
  )
}

StandardButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  padding: PropTypes.number,
  onClick: PropTypes.func,
  type: PropTypes.string
}

export default StandardButton;