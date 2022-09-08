import React, { useEffect, useState } from "react";

import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";



import { ModalCOF } from "./modals/modalCOF";

export const Form = ({ Form, onChangeForm, COD, lastFormSection }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [section, setSection] = useState(0)
  const [modalCOFOpen, setModalCOFOpen] = useState(false);

  console.log(Form)

  useEffect(() => {
    setSection(lastFormSection);
  }, [lastFormSection]);

  return (
    <>
      <ModalCOF open={modalCOFOpen} onClose={() => setModalCOFOpen(false)} />
      

      

      
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  TextInput: {
    width: "100%",
    margin: "8px",
    paddingRight: "8px",
    "&:nth-child(1) > div > input": {
      marginLeft: "8px",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
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
