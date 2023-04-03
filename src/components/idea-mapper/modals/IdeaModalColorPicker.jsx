import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFillDrip } from '@fortawesome/free-solid-svg-icons';
import styles from './IdeaModalColorPicker.module.scss';

const colors = [
  ['#FCEEEF', '#F5CCCE', '#EEAAAD'],
  ['#FFF4EB', '#FFDEC2', '#FFC999'],
  ['#FFF9EB', '#FFECC2', '#FFDF99'],
  ['#F2FBEF', '#D8F2CE', '#BEEAAE'],
  ['#EFF8FA', '#D0EAF1', '#B0DCE8'],
  ['#EEF3FC', '#CCD8F5', '#AAC3EE'],
  ['#F6EEFB', '#E5CDF4', '#D4A8ED'],
  ['#FCEEF5', '#F5CCE0', '#EEAACB'],
  ['#F2EFE2', '#E7DFC5', '#D8CFA9'],
  ['#FFFFFF', '#E0E0E0', '#CCCCCC'],
]

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const IdeaModalColorPicker = props => {
  const { defaultColor, onPickedColor } = props;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [focusedHue, setFocusedHue] = useState(9);
  const [pickedColor, setPickedColor] = useState({ hue: 9, bright: 0 });

  useEffect(() => {
    const defaultHue = colors.findIndex(hueColors => hueColors.includes(defaultColor));
    const defaultBright = colors[defaultHue].findIndex(color => color === defaultColor);

    setFocusedHue(defaultHue);
    setPickedColor({ hue: defaultHue, bright: defaultBright });
  }, [defaultColor]);

  useEffect(() => {
    onPickedColor(colors[pickedColor.hue][pickedColor.bright]);
  }, [pickedColor, onPickedColor]);
  

  const renderPicker = () => (
    <div className={`${styles.picker} p-2`}>
      <div className='d-flex'>
        {colors.slice(0, 5).map((h, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${focusedHue === idx ? styles.active : ''}`}
            onClick={() => setFocusedHue(idx)}
            style={{ backgroundColor: h[1] }} />)}
      </div>
      <div className='d-flex mt-2'>
        {colors.slice(5, 10).map((h, idx) =>
          <div
            key={idx}
            className={`${styles.hue} rounded-circle ${focusedHue === 5 + idx ? styles.active : ''}`}
            onClick={() => setFocusedHue(5 + idx)}
            style={{ backgroundColor: h[1] }} />)}
      </div>
      <hr />
      <div className='d-flex justify-content-center mt-2'>
        {colors[focusedHue].map((c, idx) =>
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
              backgroundColor: colors[pickedColor.hue][pickedColor.bright]
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