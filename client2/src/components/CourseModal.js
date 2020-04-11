import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal,
  TextField,
  Button
} from '@material-ui/core';
//import styles from "../scss/Modal.module.scss";
import {useStyles} from "../styles/Modal.module.js";
const api = require("../http/apiController.js");
const nodemailer = require('nodemailer');

function CourseModal(props) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  const formRef = useRef(null);
  const styles = useStyles();


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

  async function sendEmail(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let to = formData.get("to");
    console.log(to);

    api.sendEmail();
  }

  return(
    <div>
      <Button color="primary" onClick={openModal} onClose={closeModal}>Create Course Code</Button>
      <Modal
        open={open}
        onClose={closeModal}
      >
        <div className={`${styles.modalClass}`}>
          <div className={styles.centerClass}>
            <p>Create Course Code</p>
            <form ref={formRef} onSubmit={createCourseCode}>
              <div>
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
            <p>Send email</p>
            <form onSubmit={sendEmail}>
              <div>
                <TextField
                  id="to"
                  fullWidth={true}
                  label="Recepicient of email"
                  name="to"
                  helperText="Email address"
                  required
                />
                <Button type='submit' color="primary">Send Email</Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
    
  )
}

export default CourseModal;