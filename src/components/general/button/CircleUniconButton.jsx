import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const CircleUniconButton = props => {
  const { className, variant, onClick, unicons, disabled, padding, type, form } = props;

  return (
    <Button
      className={`rounded-circle px-${padding !== undefined ? padding : 0}${className !== undefined ? ' ' + className : ''}`}
      style={{ height: '36px', width: '36px', lineHeight: 1 }}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
      form={form}
    >{unicons}</Button>
  )
}

CircleUniconButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  unicons: PropTypes.element.isRequired,
  disabled: PropTypes.bool,
  padding: PropTypes.number,
  type: PropTypes.string,
  form: PropTypes.string
}

export default CircleUniconButton