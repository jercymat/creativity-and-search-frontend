import PropTypes from 'prop-types';
import SavedResult from './SavedResult';

function SavedResultGrouped(props) {
  return (
    <div>Grouped
      {props.saves.map(save => (
        <SavedResult save={save} />
      ))}
    </div>
  )
}

SavedResultGrouped.propTypes = {

};

export default SavedResultGrouped;