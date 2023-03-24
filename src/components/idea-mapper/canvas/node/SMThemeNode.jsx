import React from 'react';

export const SMThemeNode = ({ data }) => {
  return (
    <div className="im-sm-theme-node im-idea-node-wrap">
      <div className="im-sm-theme__theme-wrap noselect">
        <h2 className="im-sm-theme__title">{data.title}</h2>
        <p className="im-sm-theme__subtitle">
          {data.total_sr} Saved Result{data.total_sr > 1 && 's'}, {data.shown_sr} Shown
          <br/>
          Theme Idea is {data.note_shown ? 'Shown' : 'Hidden'}
        </p>
      </div>
    </div>
  )
}
