import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMResult.module.scss'
import { CircleUniconButton } from '../../general/button'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Unicons from '@iconscout/react-unicons';

const renderTooltip = text => props => (
  <Tooltip {...props}>{text}</Tooltip>
);

export const SMResultGrouped = props => {
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
              unicons={<Unicons.UilTrashAlt />} />
          </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip('Remove from Theme')}
        >
          <div className={`d-inline-block ${styles.action}`}>
            <CircleUniconButton
              variant='warning'
              unicons={<Unicons.UilLayerGroupSlash />}
              onClick={() => props.onRemoveFromTheme(props.save.id)} />
          </div>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250 }}
          overlay={renderTooltip('Move to Other Theme')}
        >
          <div className={`d-inline-block ${styles.action}`}>
            <CircleUniconButton
              variant='primary'
              unicons={<Unicons.UilArrowUpRight />} />
          </div>
        </OverlayTrigger>
      </div>
    </div>
  )
}

SMResultGrouped.propTypes = {
  save: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
  onRemoveFromTheme: PropTypes.func.isRequired,
}
