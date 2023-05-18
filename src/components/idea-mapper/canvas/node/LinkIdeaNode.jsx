import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Handle, Position } from "react-flow-renderer";

export const LinkIdeaNode = ({ data }) => {
  return (
    <div
      className={'im-link-idea-node im-idea-node-wrap'}
      style={{ backgroundColor: data.colorHex }}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
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