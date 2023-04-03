import { Handle, Position } from "react-flow-renderer";

export const TextIdeaNode = ({ data }) => {
  return (
    <div
      className={'im-text-idea-node im-idea-node-wrap'}
      style={{ backgroundColor: data.colorHex }}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-text-idea__label-wrap noselect">{data.label}</div>
    </div>
  )
};