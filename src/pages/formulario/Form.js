import React, { useEffect, useState } from "react";

import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";


import { FormHelper } from './FormHelper'
import { FormQuestion } from './FormQuestion'
import { FormStepper } from './FormStepper'
import { ModalCOF } from "./modals/modalCOF";

export const Form = ({ Form, onChangeForm, COD, lastFormSection }) => {
  const [section, setSection] = useState(0)
  const [modalCOFOpen, setModalCOFOpen] = useState(false);

  useEffect(() => {
    setSection(lastFormSection);
  }, [lastFormSection]);

  return (
    <>
      <ModalCOF open={modalCOFOpen} onClose={() => setModalCOFOpen(false)} />
    </>
  );
};
