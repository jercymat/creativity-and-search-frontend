import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import './IdeaNode.scss';

export const SMThemeNode = ({ data }) => {
  return (
    <div
      className="im-sm-theme-node im-sm-node-wrap"
      style={{ backgroundColor: data.colorHex }}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
      <div className="im-sm-theme__theme-wrap noselect">
        <h2 className="im-sm-theme__title">{data.title}</h2>
        <p className="im-sm-theme__subtitle">
          {data.total_sr} Saved Result{data.total_sr > 1 && 's'}, {data.shown_sr} Shown
          <br/>
          IdeaNote is {data.note_shown ? 'Shown' : 'Hidden'}
        </p>
      </div>
    </div>
  )
}
