import React from 'react';
import PropTypes from 'prop-types';
import styles from './SMResult.module.scss';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CircleUniconButton } from '../../general/button';
import * as Unicons from '@iconscout/react-unicons';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const SMResult = props => {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <a href={props.save.url} target='_blank' rel="noreferrer">
          <h2 className={styles.title}>{props.save.title}</h2>
        </a>
        <h4 className={styles.url}>{props.save.url}</h4>
      </div>
      <p className={styles.desc}>{props.save.desc}</p>
      <div className={styles.actions}>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip('Delete Result')}
        >
          <div className={`d-inline-block ${styles.action}`}>
            <CircleUniconButton
              variant='danger'
              unicons={<Unicons.UilTrashAlt />}
              onClick={() => props.onDeleteSave(props.save.id.toString())} />
          </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip('Add to Theme')}
        >
          <div className={`d-inline-block ${styles.action}`}>
            <CircleUniconButton
              variant='primary'
              unicons={<Unicons.UilLayerGroup />}
              onClick={() => props.onAddToGroup(props.save.id)} />
          </div>
        </OverlayTrigger>
      </div>
    </div>
  )
}

SMResult.propTypes = {
  save: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
  onDeleteSave: PropTypes.func.isRequired,
  onAddToGroup: PropTypes.func.isRequired,
}