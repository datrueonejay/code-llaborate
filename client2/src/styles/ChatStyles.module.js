import { makeStyles } from "@material-ui/core/styles";

let styles = makeStyles({
  listMessage: {
    height: '200px', 
    width: '90%',
    overflow: 'scroll',
    overflowY: 'scroll',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    hyphens: 'auto'
  },

  messageField: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  chatText: {
    width: '100%'
  }
})

export default styles;