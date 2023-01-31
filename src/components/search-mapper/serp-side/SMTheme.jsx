import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMTheme.module.scss'
import { SMResultGrouped } from './SMResultGrouped'

export function SMTheme(props) {
  const { theme, onRenameTheme, onEditIdea } = props;

  return (
    <div className={styles.wrap}>
      <button type='button' className={styles['theme-title']} onClick={onRenameTheme}>{theme.name}</button>
      <div className={styles.results}>
        {
          theme.searchResultList.map(s => (
            <SMResultGrouped key={s.id} save={s} />
          ))
        }
      </div>
      <button type='button' className={styles.note} onClick={onEditIdea}>
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
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    searchResultList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired,
      imgUrl: PropTypes.string
    }).isRequired).isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
  onRenameTheme: PropTypes.func.isRequired,
  onEditIdea: PropTypes.func.isRequired,
}
