import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({

    //.logoutLink
        logoutLinkClass: {
                borderRadius: "15px",
                textAlign: "center",
                textDecoration: "none",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: "22px",
                color: "rgb(255, 255, 255)",
                margin: "0px",
                border: "1px solid white",
                padding: "10px"
        },
    //.logout
        logoutClass: {
                display: "flex",
                justifyContent: "flex-end",
                padding: "10px"
        },
    //.logoutLink:hover
        logoutLinkHoverClass: {
                backgroundColor: "1px solid #C691C2"
        }
    }));