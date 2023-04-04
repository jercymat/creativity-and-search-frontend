import { useCallback } from "react";
import { getBezierPath, useStore } from "react-flow-renderer";
import { getEdgeParams } from "../../util/canvas";
import './IdeaMapperEdge.scss';

function IdeaMapperEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useStore(useCallback((store) => 
    store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) =>
    store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g className='react-flow__edge'>
      <path 
        id={id}
        className='react-flow__edge-path'
        d={d}
        markerEnd={markerEnd}
        stroke='black'
        strokeWidth='4'
        style={style} />
    </g>
  )
}


export default IdeaMapperEdge;