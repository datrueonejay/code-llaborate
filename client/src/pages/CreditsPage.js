import React from "react";
import useSharedStyles from "../styles/SharedStyles.module";

import { Typography, List, ListSubheader, ListItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import useStyles from "../styles/HomePageStyles.module";

export default function Credits(props) {
  const sharedStyles = useSharedStyles();
  const homePageStyles = useStyles();

  const sources = [
    "https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js",
    "https://material-ui.com/components/drawers/",
    "http://securingsincity.github.io/react-ace/",
    "https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js",
    "https://tylermcginnis.com/react-router-cannot-get-url-refresh/",
    "https://stackoverflow.com/questions/40589302/how-to-enable-file-upload-on-reacts-material-ui-simple-input",
    "https://stackoverflow.com/questions/55830414/how-to-read-text-file-in-react",
    "https://serverless-stack.com/chapters/create-a-login-page.html",
    "https://reactjs.org/docs/create-a-new-react-app.html",
    "https://stackoverflow.com/questions/16316330/how-to-write-file-if-parent-folder-doesnt-exist",
    "https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript",
    "https://ourcodeworld.com/articles/read/286/how-to-execute-a-python-script-and-retrieve-output-data-and-errors-in-node-js",
  ];
  return (
    <div className={sharedStyles.background}>
      <Typography align="center" color="textPrimary" variant="h3">
        Credits
      </Typography>
      <List>
        <ListSubheader>Code Snippets</ListSubheader>
        {sources.map((link, index) => {
          return (
            <ListItem
              key={index}
              component="a"
              href={link}
              style={{ color: "white" }}
              target="_blank"
            >
              {link}
            </ListItem>
          );
        })}

        <ListSubheader>Images</ListSubheader>
        <ListItem
          key={"background"}
          component="a"
          href={"https://unsplash.com/photos/nf183J3S2Lw"}
          style={{ color: "white" }}
          target="_blank"
        >
          https://unsplash.com/photos/nf183J3S2Lw
        </ListItem>
        <ListSubheader>Icons</ListSubheader>
        <ListItem
          key={"materialui"}
          component="a"
          href={"https://material-ui.com/components/material-icons/"}
          style={{ color: "white" }}
          target="_blank"
        >
          https://material-ui.com/components/material-icons/
        </ListItem>
        <ListItem key={"codeicon"} component="div" style={{ color: "white" }}>
          <div>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/kiranshastry"
              title="Kiranshastry"
            >
              Kiranshastry
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </ListItem>
      </List>
      <Link to="/" className={homePageStyles.signUpElement}>
        Back to login
      </Link>
    </div>
  );
}
