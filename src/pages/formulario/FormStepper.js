import React from 'react';

import { Step, StepLabel, Stepper, useMediaQuery, useTheme } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles'

import {
  Edit as EditIcon
} from "@material-ui/icons";

export const FormStepper = () => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return(
    <div
        className="YAlign"
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          height: "100%",
          maxHeight: "500px",
          width: fullScreen ? "100%" : "unset",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            borderRadius: "4px",
            marginTop: "16px",
            background: "rgba(255, 255, 255, 0.2)",
            width: fullScreen ? "100%" : "unset",
          }}
        >
          <Stepper
            activeStep={1}
            orientation="vertical"
            style={{
              background: "transparent",
            }}
          >
            <Step>
              <StepLabel icon={1} className={classes.StepLabelNumber}>
                Dados
                <EditIcon
                  fontSize="small"
                  style={{
                    marginLeft: "8px",
                  }}
                />
              </StepLabel>
            </Step>
          </Stepper>
        </div>
      </div>
  )
}

const useStyles = makeStyles((theme) => ({
  StepLabelNumber: {
    "& > span.MuiStepLabel-iconContainer > svg > circle": {
      color: "#0056C7",
      backgroundColor: "#0056C7",
    },
    "& > span.MuiStepLabel-iconContainer > svg > path": {
      color: "#65e305",
      backgroundColor: "#65e305",
    },
  },
}));
