import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'

export const SMNoteNode = ({ data }) => {
  return (
    <div className={`im-sm-note-node im-sm-node-wrap ${data.color}`}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Left} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Right} />
      <div className="im-sm-note__note-wrap noselect">
        <div className="im-sm-note__icon">
          <span className="font-im-ideas">
            <FontAwesomeIcon icon={faNoteSticky} />
          </span>
        </div>
        <div className="im-link-idea__note">
          <span className="font-im-bold">{data.label}</span>
        </div>
      </div>
    </div>
  )
}
