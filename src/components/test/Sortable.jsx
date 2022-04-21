import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from './Sortable.module.scss';

function Sortable(props) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? '10' : undefined
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.wrap}
      {...attributes} {...listeners}>
      <div className={styles.head}>
        <h2 className={styles.title}>{props.save.title}</h2>
        <h4 className={styles.url}>{props.save.url}</h4>
      </div>
      <p className={styles.desc}>{props.save.desc}</p>
    </div>
  );
}

export default Sortable;