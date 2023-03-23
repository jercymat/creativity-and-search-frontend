import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Handle, Position } from "react-flow-renderer";
import './IdeaNode.scss';

export const LinkIdeaNode = ({ data }) => {
  return (
    <div className={`im-link-idea-node im-idea-node-wrap ${data.color}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-link-idea__link-wrap noselect">
        <div className="im-link-idea__url">
          <span className="font-im-ideas">{data.title !== '' ? data.title : data.link}</span>
        </div>
        <div className="im-link-idea__icon">
          <span className="font-im-ideas">
            <a href={data.link} target='_blank' rel='noreferrer'>
              <FontAwesomeIcon icon={faLink} />
            </a>
          </span>
        </div>
      </div>
    </div>
  )
};