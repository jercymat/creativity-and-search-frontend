import { Handle, Position } from "react-flow-renderer";
import './IdeaNode.scss';

export const TextIdeaNode = ({ data }) => {
  return (
    <div
      className={'im-text-idea-node im-idea-node-wrap'}
      style={{ backgroundColor: data.colorHex }}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
      <div className="im-text-idea__label-wrap noselect">{data.label}</div>
    </div>
  )
};