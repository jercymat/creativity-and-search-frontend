import PropTypes from 'prop-types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './IdeaAddingBar.module.scss';

export function IdeaAddingBar(props) {
  return (
    <div className={`noselect ${styles.bar_wrap}`}>
      <p className="font-weight-bold">Add Custom Ideas</p>
      <IdeaAddingType type='text' onClick={props.onTextIdea}/>
      <IdeaAddingType type='link' onClick={props.onLinkIdea}/>
      <IdeaAddingType type='image' onClick={props.onImageIdea}/>
    </div>
  )
}

function IdeaAddingType(props) {
  const iconList = {
    text: ['fas', 'font'],
    link: ['fas', 'link'],
    image: ['fas', 'image'],
  }

  return (
    <button
      type="button"
      className={styles.type_wrap}
      onClick={props.onClick}>
      <h2><FontAwesomeIcon icon={iconList[props.type]} /></h2>
      <h3>{props.type.charAt(0).toUpperCase() + props.type.slice(1)}</h3>
    </button>
  )
}

IdeaAddingBar.propTypes = {
  onTextIdea: PropTypes.func.isRequired,
  onLinkIdea: PropTypes.func.isRequired,
  onImageIdea: PropTypes.func.isRequired,
};

IdeaAddingType.propTypes = {
  type: PropTypes.oneOf(['text', 'link', 'image']).isRequired,
  onClick: PropTypes.func.isRequired
};