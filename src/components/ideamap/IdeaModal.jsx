import { Form, Modal } from 'react-bootstrap';
import IconButton from '../general/button/IconButton';
import StandardButton from '../general/button/StandardButton';
import PropTypes from 'prop-types';
import styles from './IdeaModal.module.scss';

function IdeaModal(props) {
  const { show, type, onCloseModal, onSubmitIdea, onDeleteIdea } = props
  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{type.charAt(0).toUpperCase() + type.slice(1)} Idea</Modal.Title>
        <div className='d-flex align-items-center'>
          <div className={`${styles.picker} ${styles.white}`}></div>
          <div className={`${styles.picker} ${styles.purple}`}></div>
          <div className={`${styles.picker} ${styles.green}`}></div>
          <div className={`${styles.picker} ${styles.blue}`}></div>
          <div className={`${styles.picker} ${styles.red}`}></div>
        </div>
      </Modal.Header>
      <Modal.Body>
        {
          {
            text: <TextIdeaModal />,
            link: <LinkIdeaModal />,
            image: <ImageIdeaModal />,
          }[type]
        }
      </Modal.Body>
      <Modal.Footer style={{borderTop: 'none'}}>
        <IconButton
          variant='danger'
          className='me-auto'
          fsIcon={['fas', 'trash-can']}
          onClick={onDeleteIdea}/>
        <StandardButton variant='secondary' btnText='Cancel' onClick={onCloseModal} />
        <StandardButton variant='primary' btnText='Save' onClick={onSubmitIdea} />
      </Modal.Footer>
    </Modal>
  )
}

IdeaModal.defaultProp = {
  show: false,
};

IdeaModal.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.oneOf(['text', 'link', 'image']).isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onSubmitIdea: PropTypes.func.isRequired,
  onDeleteIdea: PropTypes.func.isRequired,
};

function TextIdeaModal() {
  return (
    <Form>
      <Form.Group controlId='text-idea-text'>
        <Form.Control as='textarea' rows={3} placeholder='Enter some text...' required></Form.Control>
      </Form.Group>
    </Form>
  )
}

function LinkIdeaModal() {
  return (
    <Form>
      <Form.Group controlId='link-idea-link'>
        <Form.Control type='url' placeholder='https://' required></Form.Control>
      </Form.Group>
    </Form>
  )
}

function ImageIdeaModal() {
  return (
    <Form>
      <Form.Group controlId='image-idea-file'>
        <Form.Control type='file' accept='image/*' required></Form.Control>
      </Form.Group>
      <div className="text-center my-2 font-footnote font-weight-bold">or</div>
      <Form.Group controlId='iomage-idea-url'>
        <Form.Control type='url' placeholder='Paste URL of the image' required></Form.Control>
      </Form.Group>
    </Form>
  )
}

export default IdeaModal;