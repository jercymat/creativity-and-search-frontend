import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMResult.module.scss'
import { CircleIconButton } from '../../general/button'

export function SMResultGrouped(props) {
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
        <CircleIconButton
          variant='danger'
          fsIcon={['fas', 'trash-can']} />
        <CircleIconButton
          variant='primary'
          fsIcon={['fas', 'share-from-square']} />
      </div>
    </div>
  )
}

SMResultGrouped.propTypes = {
  save: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
}
