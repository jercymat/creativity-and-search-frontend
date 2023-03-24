import React from 'react';

export const SMResultNode = ({ data }) => {
  return (
    <div className={`im-sm-result-node im-idea-node-wrap ${data.color}`}>
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
