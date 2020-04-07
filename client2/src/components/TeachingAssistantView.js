import React, { useState, useEffect } from "react";
import Editor from "../containers/Editor.js";
import http from "../http";
import Logout from "../components_final/Logout.js";

function TeachingAssistantView(props) {
  const [courses, setCourses] = useState([]);
  const [isSession, setIsSession] = useState(false);

  useEffect(() => {
    http
      .getCourses()
      .then((res) => {
        setCourses(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // if (isSession) {
  return (
    <div>
      <Logout />

      <Editor />
    </div>
  );
  // } else {
  //   return (
  //     <div>
  //       {courses.map((course, index) => {
  //           return (
  //             <div key={index}>
  //               <li>{course}</li>
  //               <button
  //                 onClick={() =>
  //                   http
  //                     .startSession(course)
  //                     .then(res => {
  //                       console.log(res);
  //                       setIsSession(true);
  //                     })
  //                     .catch(err => console.log(err))
  //                 }
  //               >
  //                 Create Session
  //               </button>
  //             </div>
  //           );
  //       })}
  //     </div>
  //   );
  // }
}

export default TeachingAssistantView;
