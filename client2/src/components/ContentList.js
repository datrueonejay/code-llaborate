import React, { useState, useRef } from "react";
import {
  TextField,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import useStyles from "../styles/InstructorView.module";

function ContentList(props) {
  const [filter, setFilter] = useState("");
  const listRef = useRef(null);
  const styles = useStyles();


  function filterList(input, listRef) {
    return function (e) {
      // this should be called when user types into the input
      input = input.toUpperCase(); // what the user typed in
      console.log('input', input);
      let list = listRef.current.querySelectorAll("span:nth-child(1)");

      for (let i = 0; i < list.length; i++) {
        //console.log('length', list.length)
        let li, text;
        li = list[i];
        text = li.textContent || li.innerText; // text of the list
        //console.log('text', text);
        text = text.toUpperCase();
        if (text.indexOf(input) > -1) {
          //console.log('Found it!, going to remove HIDE now');
          li.parentNode.parentNode.classList.remove(styles.hide);
        } else {
          //console.log("could not find it, going to hide", li.parentNode);
          li.parentNode.parentNode.classList.add(styles.hide);
        }
      }
    };
  }

  function handleChange(e) {
    setFilter(e.target.value);
  }

  function nextPage(e) {
    props.nextPage();
  }

  function prevPage(e) {
    props.prevPage();
  }

  return (
    <div>
      <div>
        <div>
          <div onClick={prevPage} className={`${styles.inlineBlock} ${styles.colorWhiteClass} ${styles.arrow}`}>&#8592;</div>
          <div className={`${styles.inlineBlock} ${styles.colorWhiteClass} ${styles.formInputClass}`}>
            <TextField
              className={styles.inputClass}
              type="text"
              label="Filter"
              onChange={handleChange}
              onKeyUp={filterList(filter, listRef)}
              helperText={props.helperText}
              value={filter}
            />
          </div>
          <div onClick={nextPage} className={`${styles.inlineBlock} ${styles.colorWhiteClass} ${styles.arrow}`}>&#8594;</div>
        </div>

        <ul className={styles.listWrapperClass} ref={listRef}>
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
                  classes={{primary: styles.colorWhiteClass}}
                  className={`${styles.centerClass} ${styles.colorWhiteClass}`}
                  primary={props.type === "users" ? `${item.Name} (${item.Role})` : `${item.CourseCode}`}
                  secondary={`Id: ${item.ID}`}
                />
              </ListItem>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ContentList;