import React, { useState, useEffect } from "react";
import Editor from "./Editor.js";
import http from "../http";

function SelectCourse(props) {
  const [courses, setCourses] = useState([]);
  const [isSession, setIsSession] = useState(false);

  useEffect(() => {
    if (props.isStudent) {
      http
        .getSessions()
        .then(res => {
          setCourses(res);
        })
        .catch(err => console.log(err));
    } else {
      http
        .getCourses()
        .then(res => {
          setCourses(res);
        })
        .catch(err => console.log(err));
    }
  }, []);

  if (isSession) {
    return (
      <div>
        <Editor isStudent={props.isStudent} />
      </div>
    );
  } else {
    return (
      <div>
        {courses.map((course, index) => {
          if (props.isStudent) {
            return (
              <div>
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
                >
                  Join Session
                </button>
              </div>
            );
          } else {
            return (
              <div>
                <li key={index}>{course}</li>
                <button
                  onClick={() =>
                    http
                      .startSession(course)
                      .then(res => {
                        console.log(res);
                        setIsSession(true);
                      })
                      .catch(err => console.log(err))
                  }
                >
                  Create Session
                </button>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default SelectCourse;
