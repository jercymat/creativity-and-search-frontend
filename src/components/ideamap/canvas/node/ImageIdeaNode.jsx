import { Handle, Position } from "react-flow-renderer";
import './IdeaNode.scss';

function ImageIdeaNode({ data }) {
  return (
    <div className='im-image-idea-node'>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-image-idea__image-wrap">
        <img
          src={data.img_url}
          alt='idea'
          draggable='false' />
      </div>
    </div>
  )
}

export default ImageIdeaNode;