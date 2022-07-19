import axios from "axios";
import config from "../../config";

export const checkoutEvents = async (statOfQueryId) => {
  const events = {
    switchSerpMapper: 0,
    statOfQueryId,
    avgDocViewTimePerQuery: [],
    docClickedPerQuery: [],
    ideaMapperTimeTotal: 0,
    ideaAddedFromSaved: 0,  // unused
    ideaAddedFromCustom: 0,
    ideaEdited: 0,
    ideaDeleted: 0,  // unused
    ideaLineDeleted: 0,  // unused
    ideaMoved: 0,  // unused
  }

  const docViewTimePerQuery = [];
  var firstSearch = true;
  var docsClicked = 0;
  var docViewTime = [];

  var docViewStartPoint = 0;
  var mapperVisitStartPoint = 0;

  window.loggedEvents.forEach((ev, i, evs) => {
    // if the previous event is viewing doc, calculate doc viewing time
    if (docViewStartPoint !== 0) {
      docViewTime.push(ev.timestamp - docViewStartPoint);
      docViewStartPoint = 0;
    }

    switch (ev.event) {
      case 'newSearch':  // open a new search session
        if (!firstSearch) {
          console.log('here');
          docViewTimePerQuery.push(docViewTime);
          events.docClickedPerQuery.push(docsClicked);
        }
        firstSearch = false;
        docViewTime = [];
        docsClicked = 0;
        break;
      case 'switchSerpMapper':
        events.switchSerpMapper += 1;
        break;
      case 'enterIdeaMap':
        // start idea map timer
        mapperVisitStartPoint = ev.timestamp;
        break;
      case 'leaveIdeaMap':
        // stop idea map timer
        events.ideaMapperTimeTotal += (ev.timestamp - mapperVisitStartPoint) / 1000;
        mapperVisitStartPoint = 0;
        break;
      case 'docClicked':
        docsClicked += 1;
        docViewStartPoint = ev.timestamp;
        break;
      case 'ideaAddedFromSaved':
        events.ideaAddedFromSaved += 1;
        break;
      case 'ideaAddedFromCustom':
        events.ideaAddedFromCustom += 1;
        break;
      case 'ideaEdited':
        events.ideaEdited += 1;
        break;
      case 'ideaDeleted':
        events.ideaDeleted += 1;
        break;
      case 'ideaLineDeleted':
        events.ideaLineDeleted += 1;
        break;
      case 'ideaMoved':
        events.ideaMoved += 1;
        break;

      default:
        break;
    }
  });

  // close the search session
  docViewTimePerQuery.push(docViewTime);
  events.docClickedPerQuery.push(docsClicked);

  // calculate average doc view time
  events.avgDocViewTimePerQuery = docViewTimePerQuery
    .map(vt => 
      vt.reduce((acc, v, i, a) => (acc + v / a.length), 0) / 1000
      );

  console.log(events);

  // clear event bucket
  window.loggedEvents = [];

  const client = axios.create({ withCredentials: true });

  return await axios.all([
    client.post(config.api.HOST + '/users', {
      action: 'update_stat',
      totalTime: 0,
    }),
    client.post(config.api.HOST + '/graphs', {
      action: 'update_statOfGraph',
      wordCount: -1,
      totalTime: events.ideaMapperTimeTotal,
      switchSerpMapperTime: events.switchSerpMapper,
      ideaNum: 0,
      generateIdeaNum: events.ideaAddedFromCustom,
      connectLineNum: 0,
      urlNodeNum: 0,
      textNodeNum: 0,
      imageNodeNum: 0,
      editNum: events.ideaEdited,
    }),
    ...events.statOfQueryId.map((qid, idx) =>
      client.post(config.api.HOST + '/searchresults', {
        action: 'update_queryStat',
        queryId: qid,
        avgTimeViewDocPerQuery: events.avgDocViewTimePerQuery[idx],
        timeFromLastQuery: 0,
        clickedDocNum: events.docClickedPerQuery[idx],
      })
      )
  ]);
};