import axios from "axios";
import config from "../../config";

export const checkoutEvents = async () => {
  const events = {
    switchSerpMapper: 0,
    avgDocViewTime: 0,
    docsClicked: 0,
    ideaMapperTimeTotal: 0,
    ideaAddedFromSaved: 0,  // unused
    ideaAddedFromCustom: 0,
    ideaEdited: 0,
    ideaDeleted: 0,  // unused
    ideaLineDeleted: 0,  // unused
    ideaMoved: 0,  // unused
  }

  const docViewTime = [];
  var docViewStartPoint = 0;
  var mapperVisitStartPoint = 0;

  window.loggedEvents.forEach((ev, i, evs) => {
    // if the previous event is viewing doc, calculate doc viewing time
    if (docViewStartPoint !== 0) {
      docViewTime.push(ev.timestamp - docViewStartPoint);
      docViewStartPoint = 0;
    }

    switch (ev.event) {
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
        events.docsClicked += 1;
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
  })

  // calculate average doc view time
  events.avgDocViewTime = docViewTime
    .reduce((acc, v, i, a) => (acc + v / a.length), 0) / 1000;

  console.log(events);

  // clear event bucket
  window.loggedEvents = [];

  const client = axios.create({ withCredentials: true });

  return await axios.all([
    client.post(config.api.HOST + '/users', {
      action: 'update_stat',
      totalTime: 0,
    }),
    client.post(config.api.HOST + '/searchresults', {
      action: 'update_queryStat',
      queryId: 0,
      avgTimeViewDocPerQuery: events.avgDocViewTime,
      timeFromLastQuery: 0,
      clickedDocNum: events.docsClicked,
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
    })
  ]);
}