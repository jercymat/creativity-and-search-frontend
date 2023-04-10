import React from 'react'
import PropTypes from 'prop-types'
import styles from './SMTheme.SERP.module.scss'
import { SMResultGroupedSERP } from './SMResultGroupedSERP'

const MESSAGES = {
  LAST_RESULT: 'This is the last saved result in this theme, removing this result from the theme will also delete this theme and its notes.'
};

export function SMThemeSERP(props) {
  const { theme, onRenameTheme, onEditIdea, onRemoveFromTheme, onMoveToTheme, onDeleteSaved } = props;

  const handleDeleteSaved = resultID => {
    const isLastResult = theme.searchResultList.length === 1
    const isConfirmed = isLastResult
      ? window.confirm(MESSAGES.LAST_RESULT)
      : true;

    if (isConfirmed) {
      onDeleteSaved(resultID, isLastResult ? theme.id : -1);
    }
  };

  return (
    <div className={styles.wrap}>
      <button type='button' className={styles['theme-title']} onClick={onRenameTheme}>{theme.name}</button>
      <div className={styles.results}>
        {
          theme.searchResultList.map(s => (
            <SMResultGroupedSERP
              key={s.id}
              save={s}
              onDeleteSaved={handleDeleteSaved}
              onRemoveFromTheme={onRemoveFromTheme}
              onMoveToTheme={resultID => onMoveToTheme({ resultID, fromThemeID: theme.id })} />
          ))
        }
      </div>
      <hr />
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

SMThemeSERP.propTypes = {
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
  onRemoveFromTheme: PropTypes.func.isRequired,
  onMoveToTheme: PropTypes.func.isRequired,
  onDeleteSaved: PropTypes.func.isRequired,
}
