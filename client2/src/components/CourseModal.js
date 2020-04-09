import React, { useState } from 'react';
import { 
  Modal,
  TextField,
  Button
} from '@material-ui/core';
import styles from "../scss/Modal.module.scss";
const api = require("../http/apiController.js");

function CourseModal(props) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  function openModal() {
    setOpen(true);
  }
  
  function closeModal() {
    setOpen(false);
  }

  function createCourseCode() {
    api.createCourseCode().then((res) => {
      setCode(res);
    })
  }
  return(
    <div>
      <Button color="primary" onClick={openModal} onClose={closeModal}>Create Course Code</Button>
      <Modal
        open={open}
        onClose={closeModal}
      >
        <div className={`${styles.modal}`}>
          <div className={styles.center}>
            <Button color="primary" onClick={createCourseCode}>Get Code</Button>
            {code == "" ? null : `\nYour Code: ${code}`}
            <p>Want to JayJay?</p>
          </div>
        </div>
      </Modal>
    </div>
    
  )
}

export default CourseModal;