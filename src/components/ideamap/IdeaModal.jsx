import { Form, Modal } from 'react-bootstrap';
import IconButton from '../general/button/IconButton';
import StandardButton from '../general/button/StandardButton';
import PropTypes from 'prop-types';
import styles from './IdeaModal.module.scss';
import { Fragment, useState } from 'react';

function IdeaModal(props) {
  const { show, mode, type, onCloseModal, onAddIdea, onUpdateIdea, onDeleteIdea, node } = props
  const [validated, setValidated] = useState(false);

  // helper function
  const firstLetterUpper = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const handleSubmitTest = (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === true) {
      if (mode === 'add') {
        if (type === 'text') {
          onAddIdea(type, { label: event.target.text.value }, 'w');
        } else if (type === 'link') {
          onAddIdea(type, { link: event.target.link_url.value }, 'w');
        } else if (type === 'image') {
          onAddIdea(type, { img_url: event.target.image_url.value }, 'w');
        }
      } else if (mode === 'edit') {
        if (type === 'text') {
          onUpdateIdea({ label: event.target.text.value }, 'w');
        } else if (type === 'link') {
          onUpdateIdea({ link: event.target.link_url.value }, 'w');
        } else if (type === 'image') {
          onUpdateIdea({ img_url: event.target.image_url.value }, 'w');
        }
      }
      setValidated(false);
    }
  }

  return (
    <Modal show={show} centered>
      <Modal.Header style={{ borderBottom: 'none' }}>
        <Modal.Title>{firstLetterUpper(mode)} {firstLetterUpper(type)} Idea</Modal.Title>
        <div className='d-flex align-items-center'>
          <div className={`${styles.picker} ${styles.white}`}></div>
          <div className={`${styles.picker} ${styles.purple}`}></div>
          <div className={`${styles.picker} ${styles.green}`}></div>
          <div className={`${styles.picker} ${styles.blue}`}></div>
          <div className={`${styles.picker} ${styles.red}`}></div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form id='add-idea' noValidate validated={validated} onSubmit={handleSubmitTest}>
          {
            {
              text: <TextIdeaModal data={mode === 'edit' ? node.data : null}/>,
              link: <LinkIdeaModal data={mode === 'edit' ? node.data : null}/>,
              image: <ImageIdeaModal data={mode === 'edit' ? node.data : null}/>,
            }[type]
          }
        </Form>
      </Modal.Body>
      <Modal.Footer style={{borderTop: 'none'}}>
        { mode === 'edit' ? (
          <IconButton
            variant='danger'
            className='me-auto'
            fsIcon={['fas', 'trash-can']}
            onClick={onDeleteIdea} />
        ) : null}
        <StandardButton variant='secondary' btnText='Cancel' onClick={onCloseModal} />
        <StandardButton variant='primary' btnText='Save' type='submit' form='add-idea' />
      </Modal.Footer>
    </Modal>
  )
}

IdeaModal.defaultProp = {
  show: false,
};

IdeaModal.propTypes = {
  show: PropTypes.bool,
  mode: PropTypes.oneOf(['add', 'edit']).isRequired,
  type: PropTypes.oneOf(['text', 'link', 'image']).isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onAddIdea: PropTypes.func.isRequired,
  onUpdateIdea: PropTypes.func.isRequired,
  onDeleteIdea: PropTypes.func.isRequired,
  node: PropTypes.object
};

function TextIdeaModal(props) {
  const { data } = props;

  return (
    <Form.Group controlId='text-idea-text'>
      <Form.Control
        as='textarea'
        name='text'
        rows={3}
        placeholder='Enter some text...'
        defaultValue={data !== null ? data.label : ''}
        required></Form.Control>
    </Form.Group>
  )
}

TextIdeaModal.propTypes = {
  data: PropTypes.object
}

function LinkIdeaModal(props) {
  const { data } = props;

  return (
    <Form.Group controlId='link-idea-link'>
      <Form.Control
        type='url'
        name='link_url'
        placeholder='https://'
        defaultValue={data !== null ? data.link : ''}
        required></Form.Control>
    </Form.Group>
  )
}

LinkIdeaModal.propTypes = {
  data: PropTypes.object
}

function ImageIdeaModal(props) {
  const { data } = props;

  return (
    <Fragment>
      {/* <Form.Group controlId='image-idea-file'>
        <Form.Control type='file' accept='image/*'></Form.Control>
      </Form.Group>
      <div className="text-center my-2 font-footnote font-weight-bold">or</div> */}
      <Form.Group controlId='iomage-idea-url'>
        <Form.Control
          type='url'
          name='image_url'
          placeholder='Paste URL of the image'
          defaultValue={data !== null ? data.img_url : ''}
          required></Form.Control>
      </Form.Group>
    </Fragment>
  )
}

ImageIdeaModal.propTypes = {
  data: PropTypes.object
}

export default IdeaModal;