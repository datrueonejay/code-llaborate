import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import http from "../http";
import Logout from "./Logout.js";

function StudentView(props) {
  const [courses, setCourses] = useState([]);
  const [isSession, setIsSession] = useState(false);

  useEffect(() => {
    http
    .getSessions()
    .then(res => {
        setCourses(res);
    })
    .catch(err => console.log(err));
  }, []);

  if (isSession) {
    return (
      <div>
        <Logout />
        <Editor isStudent={props.isStudent} />
      </div>
    );
  } else {
    return (
      <div>
        <Logout />
        {courses.map((course, index) => {
          return (<div>
            <li key={index}>{course}</li>
            <button
              onClick={() =>
              http
              .joinSession(course)
              .then(res => {
              console.log(res);
              setIsSession(true);
              })
              .catch(err => console.log(err))
              }
            > Join Session
            </button>
          </div>);
        })}
      </div>
    )}
}

export default StudentView;
