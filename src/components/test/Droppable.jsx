import { useDroppable } from "@dnd-kit/core";

function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    color: isOver ? 'green' : undefined,
    boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 2px 3px rgba(0, 0, 0, 0.1)',
    height: '300px'
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}

export default Droppable;