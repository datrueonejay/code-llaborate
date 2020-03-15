import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import http from "../http";

function TeachingAssistantView(props) {
  const [courses, setCourses] = useState([]);
  const [isSession, setIsSession] = useState(false);

  useEffect(() => {
    http
      .getCourses()
      .then(res => {
        setCourses(res);
      })
      .catch(err => console.log(err));
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
        })}
      </div>
    );
  }
}

export default TeachingAssistantView;
