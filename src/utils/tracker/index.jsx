export const checkoutEvents = () => {
  const events = {
    switchSerpMapper: 0,
    avgDocViewTime: 0,
    docsClicked: 0,
    ideaMapperTimeTotal: 0,
    ideaAddedFromSaved: 0,
    ideaAddedFromCustom: 0,
    ideaEdited: 0,
    ideaDeleted: 0,
    ideaLineDeleted: 0,
    ideaMoved: 0,
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

  // TODO: save logging data to server

  // clear event bucket
  window.loggedEvents = [];
}