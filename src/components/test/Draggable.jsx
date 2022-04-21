import { useDraggable } from "@dnd-kit/core";
import styles from './Draggable.module.scss';

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 20px)`,
  } : undefined;

  return (
    // <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
    //   {props.children}
    // </button>
    <div
      ref={setNodeRef}
      style={style}
      className={styles.wrap}
      key={props.save.key}
      {...listeners} {...attributes}>
        <div className={styles.head}>
          <h2 className={styles.title}>{props.save.title}</h2>
          <h4 className={styles.url}>{props.save.url}</h4>
        </div>
      <p className={styles.desc}>{props.save.desc}</p>
    </div>
  );
}

export default Draggable;