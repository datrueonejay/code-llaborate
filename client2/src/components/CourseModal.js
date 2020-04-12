import React, { useState } from "react";
import { Modal, TextField, Button, Typography } from "@material-ui/core";
import { useStyles } from "../styles/Modal.module.js";
const api = require("../http/apiController.js");

function CourseModal(props) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [formNotification, setFormNotification] = useState("");

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

    api
      .createCourseCode(courseID)
      .then((res) => {
        setCode(res);
      })
      .catch((err) => {
        setFormNotification("Bad input");
      });

    e.target.reset();
  }

  async function sendEmail(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let to = formData.get("to");
    let message = formData.get("message");

    api
      .sendEmail(to, message)
      .then((res) => {
        setFormNotification("successfully sent email!");
      })
      .catch((err) => {
        console.error(err);
        setFormNotification("An error occured while sending the email");
      });

    e.target.reset();
  }

  return (
    <div>
      <Button color="primary" onClick={openModal} onClose={closeModal}>
        Create Course Code
      </Button>
      <Modal open={open} onClose={closeModal}>
        <div className={`${styles.modalClass} ${styles.root}`}>
          <div className={styles.centerClass}>
            <div>{formNotification}</div>
            <Typography color="textPrimary" variant="h6">
              Create course code
            </Typography>
            <form onSubmit={createCourseCode}>
              <div>
                <TextField
                  id="courseID"
                  fullWidth={true}
                  InputProps={{ className: styles.input }}
                  label="Course Id"
                  name="courseID"
                  helperText="The course id, for example, 2"
                  required
                />
                <Button type="submit" color="primary">
                  Get Code
                </Button>
              </div>
            </form>
            {code === "" ? null : `\n Your Course Code: ${code} \n`}
            <Typography color="textPrimary" variant="h6">
              Send email
            </Typography>
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
                <TextField
                  id="message"
                  fullWidth={true}
                  label="Body message of email"
                  name="message"
                  helperText="e.g Hey, Join my course using my code J8HV3"
                  required
                />
                <Button type="submit" color="primary">
                  Send Email (Wait at least 5 seconds)
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CourseModal;
