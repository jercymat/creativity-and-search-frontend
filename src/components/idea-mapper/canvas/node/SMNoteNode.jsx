import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'

export const SMNoteNode = ({ data }) => {
  return (
    <div className={`im-sm-note-node im-idea-node-wrap ${data.color}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div className="im-sm-note__note-wrap noselect">
        <div className="im-sm-note__icon">
          <span className="font-im-ideas">
            <FontAwesomeIcon icon={faNoteSticky} />
          </span>
        </div>
        <div className="im-link-idea__note">
          <span className="font-im-ideas">{data.label}</span>
        </div>
      </div>
    </div>
  )
}
