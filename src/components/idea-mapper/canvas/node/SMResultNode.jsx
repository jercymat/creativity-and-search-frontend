import React from 'react';
import { Handle, Position } from 'react-flow-renderer';

export const SMResultNode = ({ data }) => {
  return (
    <div className={`im-sm-result-node im-sm-node-wrap ${data.color}`}>
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Top} />
      <Handle className='disabled' isConnectable={false} type="target" position={Position.Left} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Bottom} />
      <Handle className='disabled' isConnectable={false} type="source" position={Position.Right} />
      <div className="im-sm-result__content-wrap noselect">
        <div className="im-sm-result__head">
          <h2 className="im-sm-result__head__title">{data.title}</h2>
          <h4 className="im-sm-result__head__url">{data.url}</h4>
        </div>
        <p className="im-sm-result__desc">{data.desc}</p>
      </div>
    </div>
  )
}
