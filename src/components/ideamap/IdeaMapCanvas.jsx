// import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import IdeaAddingBar from './IdeaAddingBar';
import IdeaModal from './IdeaModal';

function IdeaMapCanvas(props) {
  const [show, setShow] = useState(false);
  const [modalType, setModalType] = useState('text');

  function handleOpenModal(type) {
    return function() {
      setModalType(type);
      setShow(true);
    }
  }

  function handleCloseModal() {
    setShow(false);
  }

  function handleAddCustomIdea() {
    console.log(`custom ${modalType} idea added`);
    setShow(false);
  }

  function handleDeleteIdea() {
    console.log(`${modalType} idea deleted`);
    setShow(false);
  }

  return (
    <Fragment>
      <IdeaModal
        type={modalType}
        onCloseModal={handleCloseModal}
        onSubmitIdea={handleAddCustomIdea}
        onDeleteIdea={handleDeleteIdea}
        show={show}/>
      <IdeaAddingBar
        onTextIdea={handleOpenModal('text')}
        onLinkIdea={handleOpenModal('link')}
        onImageIdea={handleOpenModal('image')} />
    </Fragment>
  )
}

// IdeaMapCanvas.propTypes = {

// }

export default IdeaMapCanvas;