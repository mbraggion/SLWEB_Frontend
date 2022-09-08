import React from 'react';

import { Typography } from "@material-ui/core";
import { useMediaQuery, useTheme } from "@material-ui/styles";

import {
  CheckCircle as CheckCircleIcon
} from "@material-ui/icons";

export const FormHelper = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return(
    <div
        className="YAlign"
        style={{
          alignItems: fullScreen ? "center" : "flex-end",
          justifyContent: fullScreen ? "center" : "flex-start",
          height: fullScreen ? "unset" : "100%",
          width: fullScreen ? "100%" : "unset",
          maxHeight: fullScreen ? "unset" : "500px",
          padding: fullScreen ? "16px 0px 16px 0px" : "16px 32px 0px 0px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: fullScreen ? "row" : "column",
            alignItems: fullScreen ? "center" : "flex-start",
            justifyContent: fullScreen ? "space-between" : "flex-start",
            padding: "8px 40px",
            borderRadius: "4px",
            background: "rgba(255, 255, 255, 0.2)",
            width: fullScreen ? "100%" : "unset",
          }}
        >
          <>
            <Typography variant="h6">CONCLUÍDO!</Typography>
            <CheckCircleIcon fontSize="large" color="primary" />
          </>
        </div>
      </div>
  )
}