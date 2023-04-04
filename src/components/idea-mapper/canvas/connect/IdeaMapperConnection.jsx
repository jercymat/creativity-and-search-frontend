import { getBezierPath } from "react-flow-renderer";
import { getEdgeParams } from "../../util/canvas";
import './IdeaMapperConnection.scss';

function IdeaMapperConnection({
  targetX, targetY, sourcePosition,
  targetPosition, sourceNode }) {
  if (!sourceNode) {
    return null;
  }

  const targetNode = {
    id: 'connection-target',
    width: 1, height: 1, position: { x: targetX, y: targetY },
  };

  const { sx, sy } = getEdgeParams(sourceNode, targetNode);
  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  return (
    <g className="im-idea-connection-wrap">
      <path fill="none" strokeWidth={1.5} className="animated" d={d} />
      <circle cx={targetX} cy={targetY} r={4} stroke="#222" strokeWidth={1.5} />
    </g>
  );
}

export default IdeaMapperConnection;