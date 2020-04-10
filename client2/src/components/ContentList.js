import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import styles from "../scss/InstructorView.module.scss";

function ContentList(props) {
  const [filter, setFilter] = useState("");
  const listRef = useRef(null);



  function filterList(input, listRef) {
    return function (e) {
      // this should be called when user types into the input
      input = input.toUpperCase(); // what the user typed in
      console.log('input', input);
      let list = listRef.current.querySelectorAll("span:nth-child(1)");

      for (let i = 0; i < list.length; i++) {
        console.log('length', list.length)
        let li, text;
        li = list[i];
        text = li.textContent || li.innerText; // text of the list
        //console.log('text', text);
        text = text.toUpperCase();
        if (text.indexOf(input) > -1) {
          //console.log('Found it!, going to remove HIDE now');
          li.parentNode.parentNode.classList.remove("hide");
        } else {
          //console.log("could not find it, going to hide", li.parentNode);
          li.parentNode.parentNode.classList.add("hide");
        }
      }
    };
  }

  function handleChange(e) {
    setFilter(e.target.value);
  }

  return (
    <div>
      <div id="filter-user">
        <TextField
          className={styles.input}
          type="text"
          onChange={handleChange}
          onKeyUp={filterList(filter, listRef)}
          helperText={props.helperText}
          value={filter}
        />
      </div>

      <ul className={styles["list-wrapper"]} ref={listRef}>
        {props.list.map((item) => {
          return (
            <ListItem 
              button
              divider
              onClick={props.setValue(props.value, item.ID)}
              key={item.ID}
              id={item.ID}
            >
              <ListItemText
                className={styles.center}
                primary={props.type === "users" ? `${item.Name} (${item.Role})` : `${item.CourseCode}`}
                secondary={`Id: ${item.ID}`}
              />
            </ListItem>
          );
        })}
      </ul>
    </div>
  );
}

export default ContentList;