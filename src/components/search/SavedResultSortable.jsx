import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import styles from './SavedResult.module.scss';

function SavedResultSortable(props) {
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
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? '10' : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.wrap}
      key={props.save.id}
      {...attributes} {...listeners}>
      <div className={styles.head}>
        <h2 className={styles.title}>{props.save.title}</h2>
        <h4 className={styles.url}>{props.save.url}</h4>
      </div>
      <p className={styles.desc}>{props.save.desc}</p>
    </div>
  )
}

SavedResultSortable.propTypes = {
  save: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    imgUrl: PropTypes.string
  }).isRequired
};

export default SavedResultSortable;