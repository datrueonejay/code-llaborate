import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({


    //.modal
        modalClass: {
                margin: "30% auto",
                width: "50vw",
                maxHeight: "50vh",
                backgroundColor: "white",
                border: "black 1px solid"
        },
    //.center
        centerClass: {
                margin: "auto",
                textAlign: "center"
        }

}));