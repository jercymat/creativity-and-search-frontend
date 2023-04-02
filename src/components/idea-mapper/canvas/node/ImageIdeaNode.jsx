import { Handle, Position } from "react-flow-renderer";

export const ImageIdeaNode = ({ data }) => {
  return (
    <div className={`im-image-idea-node im-idea-node-wrap ${data.color}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-image-idea__image-wrap noselect">
        <img
          src={data.img_url}
          alt='idea'
          draggable='false' />
      </div>
    </div>
  )
};