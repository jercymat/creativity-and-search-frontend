import { EVENT_LOGIN, EVENT_LOGOUT, EVENT_SWITCH_SM_IM } from "../type/event/general";
import { EVENT_IM_ENTER, EVENT_IM_IDEA_ADD_FROM_CUSTOM, EVENT_IM_IDEA_EDIT, EVENT_IM_LEAVE } from "../type/event/idea-mapper";
import { EVENT_SEARCH_RESULT_CLICKED, EVENT_SEARCH_SERP_LEAVE } from "../type/event/search";
import { EVENT_NEW_SEARCH } from "../type/event/search";
import {
  EVENT_SM_DELETE,
  EVENT_SM_SAVE,
  EVENT_SM_THEME_CREATE,
} from "../type/event/search-mapper";

export const checkoutEventsV2 = statOfQueryID => {
  // helper functions
  const getQueryAvgDocViewTimes = ev => {
    const docClicks = ev
      .filter(e => [
        EVENT_SEARCH_SERP_LEAVE,
        EVENT_SEARCH_RESULT_CLICKED,
      ].includes(e.event))
      .filter((e, idx, arr) => e.event === EVENT_SEARCH_SERP_LEAVE
        ? idx > 0 && arr[idx - 1].event === EVENT_SEARCH_RESULT_CLICKED
        : e.event === EVENT_SEARCH_RESULT_CLICKED);

    const searchTime = ev
      .filter(e => e.event === EVENT_NEW_SEARCH)
      .map((s, idx, arr) => idx === 0 ? 0 : s.timestamp - arr[idx - 1].timestamp)
      .map(t => Math.round(t / 10) / 100);

    console.log(searchTime);

    const queryClickTimes = {}
    const queryDocViewTime = {}

    docClicks.forEach((e, idx, arr) => {
      if (idx === arr.length - 1) return;
      if (e.event === EVENT_SEARCH_SERP_LEAVE) return;

      queryClickTimes[e.queryID] = (queryClickTimes[e.queryID] || 0) + 1;
      queryDocViewTime[e.queryID] = (queryDocViewTime[e.queryID] || []).concat(arr[idx + 1].timestamp - e.timestamp);
    });

    // console.log(docClicks);
    // console.log(queryClickTimes, queryDocViewTime);

    return statOfQueryID.map((queryId, idx) => ({
      queryId,
      clickedDocNum: queryClickTimes[queryId] || 0,
      avgTimeViewDocPerQuery: queryClickTimes[queryId]
        ? Math.round(queryDocViewTime[queryId].reduce((acc, v) => acc + v, 0) / queryClickTimes[queryId] / 10) / 100
        : 0,
      timeFromLastQuery: searchTime[idx],  // count time from new search
    }));
  }

  const getIdeaMapperTimeTotal = ev => {
    var rlt = 0;
    var isInIdeaMapper = false;
    var startTime = 0;

    ev
      .filter(e => [EVENT_IM_ENTER, EVENT_IM_LEAVE].includes(e.event))
      .forEach(e => {
        if (e.event === EVENT_IM_ENTER) {
          isInIdeaMapper = true;
          startTime = e.timestamp
          return;
        }

        if (isInIdeaMapper) {
          rlt += e.timestamp - startTime;
        }

        startTime = 0;
        isInIdeaMapper = false;
      });

    console.log(rlt);

    return Math.round(rlt / 10) / 100;
  }

  // const events = window.loggedEvents || [];

  // test: add leave serp and logout event to test
  const events = (window.loggedEvents || []).concat([
    { layout: 'MAIN', component: 'SEARCH_RESULT_LIST', event: 'SERP_LEAVE', timestamp: Date.now() },
    { layout: 'MAIN', component: 'SEARCH_RESULT_LIST', event: 'LOGOUT', timestamp: Date.now() }
  ]);
  // end test

  const loginTime = (events.find(e => e.event === EVENT_LOGIN) || { timestamp: 0 }).timestamp / 1000;
  const logoutTime = (events.find(e => e.event === EVENT_LOGOUT) || { timestamp: 0 }).timestamp / 1000;

  const keywords = events
    .filter(e => e.event === EVENT_NEW_SEARCH && e.keyword)
    .map(e => e.keyword)
    .filter((kw, idx, arr) => arr.indexOf(kw) === idx);

  const logging = {
    users: {
      action: 'update_stat',
      totalTime: Math.round(logoutTime - loginTime),  // total time session (in second),
    },
    graphs: {
      action: 'update_statOfGraph',
      totalTime: getIdeaMapperTimeTotal(events),  // total time spent in IdeaMapper
      switchSerpMapperTime: events
        .filter(e => e.event === EVENT_SWITCH_SM_IM)
        .length,  // number of times switch between sm and im
      generateIdeaNum: events
        .filter(e => e.event === EVENT_IM_IDEA_ADD_FROM_CUSTOM)
        .length,  // number of custom ideas added
      editNum: events
        .filter(e => e.event === EVENT_IM_IDEA_EDIT)
        .length,  // number of time idea editted

        // leave default value for server to handle
      wordCount: -1,
      ideaNum: 0,
      connectLineNum: 0,
      urlNodeNum: 0,
      textNodeNum: 0,
      imageNodeNum: 0,
    },
    searchresults: getQueryAvgDocViewTimes(events)
      .map(query => ({
        ...query,
        action: 'update_queryStat',
      })),
    other: {
      savedSearch: events
        .filter(e => e.event === EVENT_SM_SAVE)
        .length,  // number of saved search
      deletedSavedResult: events
        .filter(e => e.event === EVENT_SM_DELETE)
        .length,  // number of deleted saved results
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
    }
  }

  console.log(JSON.stringify(logging, null, 4));
}