import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { List } from "@material-ui/core";
import { FixedSizeList as List } from "react-window";
import AceEditor from "react-ace";
import "brace/theme/monokai";

// Import Extra tools
import "brace/ext/language_tools";
import { ListItemIcon, ListItem, ListItemText } from "@material-ui/core";

import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import useSharedStyles from "../styles/SharedStyles.module";
import useStyles from "../styles/SuggestionsStyles.module";

//https://addyosmani.com/blog/react-window/

function Suggestions(props) {
  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  let Item = ({ index, style }) => {
    let { lineNum, suggestion } = props.suggestions[index];
    return (
      <div style={style}>
        <CopyToClipboard text={suggestion}>
          <ListItem button>
            <ListItemIcon>
              <FileCopyRoundedIcon />
            </ListItemIcon>
            <ListItemText
              className={styles.suggestionText}
              primary={suggestion}
              secondary={`Suggestion for line ${lineNum}`}
            />
          </ListItem>
        </CopyToClipboard>
      </div>
    );
  };
  return (
    <div className={sharedStyles.flexGrow}>
      <div className={sharedStyles.subTitle}>Student Suggestions</div>

      <List
        height={props.height || 600}
        itemSize={75}
        itemCount={props.suggestions.length}
        width="100%"
      >
        {Item}
      </List>
    </div>
  );
}

export default Suggestions;
