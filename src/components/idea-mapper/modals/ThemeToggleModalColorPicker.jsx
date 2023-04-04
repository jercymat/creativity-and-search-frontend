import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import styles from './ColorPicker.module.scss';
import { themeColorScheme } from '../util/color-picker';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const ThemeToggleModalColorPicker = props => {
  const { defaultColor, onPickedColor } = props;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedColor2, setPickedColor2] = useState('#F0F0F0');

  useEffect(() => {
    setPickedColor2(defaultColor);
  }, [defaultColor]);

  useEffect(() => {
    onPickedColor(pickedColor2);
  }, [pickedColor2, onPickedColor]);


  const renderPicker = () => (
    <div className={`${styles.picker} p-2`}>
      <div className='d-flex'>
        {Object.keys(themeColorScheme).slice(0, 5).map((c, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${pickedColor2 === c ? styles.active : ''}`}
            onClick={() => setPickedColor2(c)}
            style={{ backgroundColor: c }} />)}
      </div>
      <div className='d-flex mt-2'>
        {Object.keys(themeColorScheme).slice(5, 10).map((c, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${pickedColor2 === c ? styles.active : ''}`}
            onClick={() => setPickedColor2(c)}
            style={{ backgroundColor: c }} />)}
      </div>
    </div>
  );

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250 }}
        overlay={renderTooltip('Pick Theme Color Scheme')}
      >
        <div className='d-inline-block'>
          <Button
            className={`rounded-circle px-0`}
            style={{
              height: '36px',
              width: '36px',
              backgroundColor: pickedColor2
            }}
            variant='light'
            onClick={() => setPickerOpen(prev => !prev)}
          ><FontAwesomeIcon icon={faFillDrip} /></Button>
        </div>
      </OverlayTrigger>
      {pickerOpen && renderPicker()}
    </>
  )
}

ThemeToggleModalColorPicker.propTypes = {
  defaultColor: PropTypes.string.isRequired,
  onPickedColor: PropTypes.func.isRequired,
}