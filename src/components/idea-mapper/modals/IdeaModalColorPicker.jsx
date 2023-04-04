import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import styles from './ColorPicker.module.scss';
import { ideaColorScheme } from '../util/color-picker';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const IdeaModalColorPicker = props => {
  const { defaultColor, onPickedColor } = props;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [focusedHue, setFocusedHue] = useState(9);
  const [pickedColor, setPickedColor] = useState({ hue: 9, bright: 0 });

  useEffect(() => {
    const defaultHue = ideaColorScheme.findIndex(hueColors => hueColors.includes(defaultColor));
    const defaultBright = ideaColorScheme[defaultHue].findIndex(color => color === defaultColor);

    setFocusedHue(defaultHue);
    setPickedColor({ hue: defaultHue, bright: defaultBright });
  }, [defaultColor]);

  useEffect(() => {
    onPickedColor(ideaColorScheme[pickedColor.hue][pickedColor.bright]);
  }, [pickedColor, onPickedColor]);
  

  const renderPicker = () => (
    <div className={`${styles.picker} p-2`}>
      <div className='d-flex'>
        {ideaColorScheme.slice(0, 5).map((h, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${focusedHue === idx ? styles.active : ''}`}
            onClick={() => setFocusedHue(idx)}
            style={{ backgroundColor: h[1] }} />)}
      </div>
      <div className='d-flex mt-2'>
        {ideaColorScheme.slice(5, 10).map((h, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${focusedHue === 5 + idx ? styles.active : ''}`}
            onClick={() => setFocusedHue(5 + idx)}
            style={{ backgroundColor: h[1] }} />)}
      </div>
      <hr />
      <div className='d-flex justify-content-center mt-2'>
        {ideaColorScheme[focusedHue].map((c, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${pickedColor.hue === focusedHue && pickedColor.bright === idx ? styles.active : ''}`}
            onClick={() => setPickedColor({ hue: focusedHue, bright: idx })}
            style={{ backgroundColor: c }} />)}
      </div>
    </div>
  );

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250 }}
        overlay={renderTooltip('Pick Idea Color')}
      >
        <div className='d-inline-block'>
          <Button
            className={`rounded-circle px-0`}
            style={{
              height: '36px',
              width: '36px',
              backgroundColor: ideaColorScheme[pickedColor.hue][pickedColor.bright]
            }}
            variant='light'
            onClick={() => setPickerOpen(prev => !prev)}
          ><FontAwesomeIcon icon={faFillDrip} /></Button>
        </div>
      </OverlayTrigger>
      { pickerOpen && renderPicker() }
    </>
  )
}

IdeaModalColorPicker.propTypes = {
  defaultColor: PropTypes.string.isRequired,
  onPickedColor: PropTypes.func.isRequired,
}