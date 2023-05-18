import axios from "axios";
import { EVENT_SWITCH_SM_IM } from "../type/event/general";
import { EVENT_IM_ENTER, EVENT_IM_IDEA_ADD_FROM_CUSTOM, EVENT_IM_IDEA_EDIT, EVENT_IM_LEAVE } from "../type/event/idea-mapper";
import { EVENT_SEARCH_RESULT_CLICKED, EVENT_SEARCH_SERP_LEAVE } from "../type/event/search";
import { EVENT_NEW_SEARCH } from "../type/event/search";
import {
  EVENT_SM_DELETE,
  EVENT_SM_SAVE,
  EVENT_SM_THEME_CREATE,
} from "../type/event/search-mapper";
import config from "../../config";

export const checkoutEventsV2 = async statOfQueryID => {
  // helper functions
  const getQueryAvgDocViewTimes = ev => {
    const searchTime = ev
      .filter(e => e.event === EVENT_NEW_SEARCH)
      .map((s, idx, arr) => idx === 0 ? 0 : s.timestamp - arr[idx - 1].timestamp)
      .map(t => Math.round(t / 10) / 100);

    const docClicks = ev
      .filter(e => [
        EVENT_SEARCH_SERP_LEAVE,
        EVENT_SEARCH_RESULT_CLICKED,
      ].includes(e.event))
      .filter((e, idx, arr) => e.event === EVENT_SEARCH_SERP_LEAVE
        ? idx > 0 && arr[idx - 1].event === EVENT_SEARCH_RESULT_CLICKED
        : e.event === EVENT_SEARCH_RESULT_CLICKED);

    // const docClickedPositions = ev
    //   .filter(e => e.event === EVENT_SEARCH_RESULT_CLICKED)
    //     .reduce((rv, x) => {
    //       (rv[x['queryID']] = rv[x['queryID']] || []).push(x.position);
    //       return rv;
    //     }, {});  // position of clicked documents

    const queryClickTimes = {}
    const queryDocViewTime = {}

    docClicks.forEach((e, idx, arr) => {
      if (idx === arr.length - 1) return;
      if (e.event === EVENT_SEARCH_SERP_LEAVE) return;

      queryClickTimes[e.queryID] = (queryClickTimes[e.queryID] || 0) + 1;
      queryDocViewTime[e.queryID] = (queryDocViewTime[e.queryID] || []).concat(arr[idx + 1].timestamp - e.timestamp);
    });

    return statOfQueryID.map((queryId, idx) => ({
      queryId,
      clickedDocNum: queryClickTimes[queryId] || 0,
      // clickedDocPos: docClickedPositions[queryId] || [],
      clickedDocPos: 0,  // TODO: apply real doc click position
      avgTimeViewDocPerQuery: queryClickTimes[queryId]
        ? Math.round(queryDocViewTime[queryId].reduce((acc, v) => acc + v, 0) / queryClickTimes[queryId] / 10) / 100
        : 0,
      timeFromLastQuery: searchTime[idx] || 0,  // count time from new search
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

    return Math.round(rlt / 10) / 100;
  }

  const events = window.loggedEvents || [];

  // test: add leave serp and logout event to test
  // const events = (window.loggedEvents || []).concat([
  //   { layout: 'MAIN', component: 'SEARCH_RESULT_LIST', event: 'SERP_LEAVE', timestamp: Date.now() },
  //   { layout: 'MAIN', component: 'SEARCH_RESULT_LIST', event: 'LOGOUT', timestamp: Date.now() }
  // ]);
  // end test

  const keywords = events
    .filter(e => e.event === EVENT_NEW_SEARCH && e.keyword)
    .map(e => e.keyword)
    .filter((kw, idx, arr) => arr.indexOf(kw) === idx);

  const logging = {
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
      wordCount: 0,
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
    }
  }

  console.log(JSON.stringify(logging, null, 4));

  const client = axios.create({ withCredentials: true });

  return await axios.all([
    // client.post(config.api.HOST + '/users', logging.users),
    client.post(config.api.HOST + '/graphs', logging.graphs),
    ...logging.searchresults.map(q =>
      client.post(config.api.HOST + '/searchresults', q),
    ),
  ]);
}