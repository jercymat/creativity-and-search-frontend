import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMResult.IM.module.scss'

export const SMResultIM = props => {
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h2 className={styles.title}>{props.save.title}</h2>
        <h4 className={styles.url}>{props.save.url}</h4>
      </div>
      <p className={styles.desc}>{props.save.desc}</p>
    </div>
  )
}

SMResultIM.propTypes = {
  save: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
}