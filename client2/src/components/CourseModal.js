import React, { useState, useRef } from 'react';
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

  const formRef = useRef(null);

  function openModal() {
    setOpen(true);
  }
  
  function closeModal() {
    setOpen(false);
  }

  function createCourseCode(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let courseID = formData.get("courseID");

    api.createCourseCode(courseID).then((res) => {
      setCode(res);
    })

    formRef.current.reset();
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
            <form ref={formRef} onSubmit={createCourseCode}>
              <div className={styles["form-input"]}>
                <TextField
                  id="courseID"
                  fullWidth={true}
                  label="Course Id"
                  name="courseID"
                  helperText="The course id, for example, 2"
                  required
                />
                <Button type='submit' color="primary">Get Code</Button>
              </div>
            </form>
            {code === "" ? null : `\nYour Course Code: ${code}`}
            <p>Want to JayJay?</p>
          </div>
        </div>
      </Modal>
    </div>
    
  )
}

export default CourseModal;