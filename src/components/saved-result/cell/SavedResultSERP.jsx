import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircleIconButton } from '../../general/button';
import styles from './SavedResult.module.scss';

function SavedResultSERP(props) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.save.id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : undefined,
    zIndex: isDragging ? '10' : undefined
  };

  const handleDelete = () => props.onDeleteSave(props.save.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.wrap} noselect`}
      key={props.save.id} >
      <div className={styles.head}>
        <a href={props.save.url} target='_blank' rel="noreferrer">
          <h2 className={styles.title}>{props.save.title}</h2>
        </a>
        <h4 className={styles.url}>{props.save.url}</h4>
      </div>
      <p className={styles.desc}>{props.save.desc}</p>
      <div className={styles.actions} style={{ 'visibility': isDragging ? 'visible' : null }}>
        <CircleIconButton
          onClick={handleDelete}
          variant='danger'
          fsIcon={['fas', 'trash-can']} />
        <div
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          className={`${styles.handle}${isDragging ? ` ${styles.dragging}` : ''}`}
          {...attributes} {...listeners}>
          <FontAwesomeIcon icon={['fas', 'bars']} />
        </div>
      </div>
    </div>
  )
}

SavedResultSERP.propTypes = {
  save: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired,
  onDeleteSave: PropTypes.func.isRequired
};

export default SavedResultSERP;