import { Position } from "react-flow-renderer";

/*
  returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need
  to create an edge
*/
export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

/*
  this helper function returns the intersection point
  of the line between the center of the intersectionNode and the target node
*/
export function getNodeIntersection(intersectionNode, targetNode) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    position: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.position;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

/*
  returns the position (x, y) of a newly spawned node
*/
export function getNodeSpawnPosition(nodes) {
  if (nodes.length === 0) {
    return {
      x: -100,
      y: -30
    }
  } else if (nodes.length === 1) {
    return {
      x: nodes[0].position.x,
      y: nodes[0].position.y + nodes[0].height + 40
    }
  }

  const positions = nodes.map(node => node.position);
  const x1 = Math.min(...positions.map(pos => pos.x));
  const y1 = Math.min(...positions.map(pos => pos.y));
  const x2 = Math.max(...positions.map(pos => pos.x));
  const y2 = Math.max(...positions.map(pos => pos.y));
  return {
    x: Math.random() * (x2 - x1) + x1,
    y: Math.random() * (y2 - y1) + y1
  }
}

/*
  returns the position (top,right,bottom or right) passed node compared to the
  intersection point
*/
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.position, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}