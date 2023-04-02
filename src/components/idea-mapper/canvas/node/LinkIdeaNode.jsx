import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Handle, Position } from "react-flow-renderer";

export const LinkIdeaNode = ({ data }) => {
  return (
    <div className={`im-link-idea-node im-idea-node-wrap ${data.color}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-link-idea__link-wrap noselect">
        <div className="im-link-idea__url">
          {data.title !== '' ? data.title : data.link}
        </div>
        <div className="im-link-idea__icon">
          <span className="font-im-bold">
            <a href={data.link} target='_blank' rel='noreferrer'>
              <FontAwesomeIcon icon={faLink} />
            </a>
          </span>
        </div>
      </div>
    </div>
  )
};