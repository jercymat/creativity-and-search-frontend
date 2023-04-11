import { EVENT_LOGIN, EVENT_SWITCH_SM_IM } from "../type/event/general";
import { EVENT_IM_IDEA_EDIT } from "../type/event/idea-mapper";
import { EVENT_SEARCH_RESULT_CLICKED } from "../type/event/search";
import { EVENT_NEW_SEARCH } from "../type/event/search";
import {
  EVENT_SM_DELETE,
  EVENT_SM_SAVE,
  EVENT_SM_THEME_CREATE,
} from "../type/event/search-mapper";

export const checkoutEventsV2 = () => {
  const now = Date.now();
  const events = window.loggedEvents || [];

  const keywords = events
    .filter(e => e.event === EVENT_NEW_SEARCH && e.keyword)
    .map(e => e.keyword)
    .filter((kw, idx, arr) => arr.indexOf(kw) === idx);

  const logging = {
    savedSearch: events
      .filter(e => e.event === EVENT_SM_SAVE)
      .length,  // number of saved search
    deletedSavedResult: events
      .filter(e => e.event === EVENT_SM_DELETE)
      .length,  // number of deleted saved results
    switchSerpMapperTime: events
      .filter(e => e.event === EVENT_SWITCH_SM_IM)
      .length,  // number of times switch between sm and im
    themeCreated: events
      .filter(e => e.event === EVENT_SM_THEME_CREATE)
      .length,  // number of sm themes created
    keywords: keywords,  // list of keywords
    countQueries: events
      .filter(e => e.event === EVENT_NEW_SEARCH)
      .length,  // number of queries (included duplicate keywords)
    countKeywords: keywords.length,  // number of keywords (remove duplicate keywords)
    countDocClicked: events
      .filter(e => e.event === EVENT_SEARCH_RESULT_CLICKED)
      .length,  // number of document clicked
    docClickedPositions: events
      .filter(e => e.event === EVENT_SEARCH_RESULT_CLICKED)
      .map(e => e.position),  // position of clicked documents
    editNum: events
      .filter(e => e.event === EVENT_IM_IDEA_EDIT)
      .length,  // number of time idea editted
    totalTime: Math.floor(
      (now - (events.find(e => e.event === EVENT_LOGIN) || { timestamp: 0 }).timestamp) / 1000
    ),  // total time session (in second)
  };

  alert(JSON.stringify(logging, null, 4));
}