import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({


        //.modal
        modalClass: {
                margin: "30% auto",
                padding: "10px",
                width: "50vw",
                maxHeight: "50vh",
                border: "black 1px solid",
                color: "black",
                borderRadius: "10px"
        },
        //.center
        centerClass: {
                margin: "auto",
                textAlign: "center"
        },

        root: {
                background: "#2B2D2F"
        },
        input: {
                color: "white"
        }



}));