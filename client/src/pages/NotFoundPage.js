import React from 'react';

import useSharedStyles from "../styles/SharedStyles.module";
import { Typography } from '@material-ui/core';

export default function NotFoundPage() {
  const styles = useSharedStyles();

  return (
    <div className={styles.background} style={{height: "100%"}}>
      <Typography color="textPrimary" variant="h1">
        Could not find the page you're looking for? 
        Contact <span style={{color: "blue"}}>{"<jayjayrayc09@gmail.com>"}</span> to see who you deduct marks from!
      </Typography>
    </div>
  );
}