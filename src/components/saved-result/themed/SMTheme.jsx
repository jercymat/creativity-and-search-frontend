import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMTheme.module.scss'
import { SMResultGrouped } from './SMResultGrouped'
import { Button } from 'react-bootstrap';

export function SMTheme(props) {
  const { theme } = props;

  return (
    <div className={styles.wrap}>
      <button type='button' className={styles['theme-title']}>{theme.title}</button>
      <div className={styles.results}>
        {
          theme.saves.map(s => (
            <SMResultGrouped key={s.id} save={s} />
          ))
        }
      </div>
      <button type='button' className={styles.note}>
        {
          theme.note !== ''
            ? <span>{theme.note}</span>
            : <span className={styles.placeholder}>Any ideas from these results?</span>
        }
      </button>
    </div>
  )
}

SMTheme.propTypes = {
  theme: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    saves: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      imgUrl: PropTypes.string
    }).isRequired).isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired
}
