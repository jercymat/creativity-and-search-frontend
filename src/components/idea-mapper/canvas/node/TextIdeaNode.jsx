import { Handle, Position } from "react-flow-renderer";
import './IdeaNode.scss';

export const TextIdeaNode = ({ data }) => {
  return (
    <div className={`im-text-idea-node im-idea-node-wrap ${data.color}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-text-idea__label-wrap noselect"><span className="font-im-ideas">{data.label}</span></div>
    </div>
  )
};