import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMTheme.IM.module.scss'
import SMResultIM from './SMResultIM';

export const SMThemeIM = props => {
  const { theme } = props;

  return (
    <div className={styles.wrap}>
      <div className={styles['theme-title']}>{theme.name}</div>
      <div className={styles.results}>
        {
          theme.searchResultList.map(s => (
            <SMResultIM
              key={s.id}
              save={s} />
          ))
        }
      </div>
      <hr />
      <div className={`${styles.note}${theme.note === '' ? ` ${styles.emptyNote} noselect` : ''}`}>
        {
          theme.note !== ''
            ? `${theme.note}`
            : 'There is no idea in this theme'
        }
      </div>
    </div>
  )
}

SMThemeIM.propTypes = {}