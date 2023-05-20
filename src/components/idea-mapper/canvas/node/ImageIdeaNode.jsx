import { Handle, Position } from "react-flow-renderer";
import './IdeaNode.scss';

export const ImageIdeaNode = ({ data }) => {
  return (
    <div
      className={'im-image-idea-node im-idea-node-wrap'}
      style={{ backgroundColor: data.colorHex }}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
      <div className="im-image-idea__image-wrap noselect">
        <img
          src={data.img_url}
          alt='idea'
          draggable='false' />
      </div>
    </div>
  )
};