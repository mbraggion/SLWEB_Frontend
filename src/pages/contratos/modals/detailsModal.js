import React, { useEffect, useRef, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, IconButton, MobileStepper, Typography, useMediaQuery } from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Edit as EditIcon, KeyboardArrowLeft, KeyboardArrowRight, Save as SaveIcon } from '@material-ui/icons';

import { Toast } from '../../../components/toasty';
import { Anexo } from './_anexo';
import { Contrato } from './_contrato';


export const DetailsModal = ({ open, onClose, target, onUpdate }) => {
  const theme = useTheme();
  const childRef = useRef();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [allowEditing, setAllowEditing] = useState(true);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0)
    }
  }, [open])

  const handleChangeEditingState = async () => {
    setAllowEditing(oldState => !oldState)

    if (!allowEditing) {
      let toastId = null
      toastId = Toast('Salvando Alterações...', 'wait')
      setWait(true)

      try {
        if (!await childRef.current.handleSubmit()) {
          throw new Error()
        }

        Toast('Alterações salvas com sucesso', 'update', toastId, 'success')
        setWait(false)
      } catch (err) {
        Toast('Falha ao salvar alterações', 'update', toastId, 'error')
        setWait(false)
        setAllowEditing(false)
      }
    }
  }

  const handleDiscardChanges = () => {
    childRef.current.undoChanges()
    setAllowEditing(true)
  }

  const whichContentShow = (stage) => {
    switch (stage) {
      case 0:
        return (
          <Contrato ref={childRef} contract={target} allowEdit={allowEditing} onUpdate={onUpdate} />
        )
      case 1:
        return (
          <Anexo ref={childRef} contract={target} allowEdit={allowEditing} />
        )
      default:
        return null
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep === 1 ? 0 : prevActiveStep + 1);
    // setActiveStep((prevActiveStep) => prevActiveStep === 2 ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep === 0 ? 1 : prevActiveStep - 1);
    // setActiveStep((prevActiveStep) => prevActiveStep === 0 ? 2 : prevActiveStep - 1);
  };

  const handleClose = () => {
    if (!wait) {
      onClose()
      setAllowEditing(true)
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      maxWidth={false}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >

      <DialogTitle onClose={handleClose} >
        {returnModalTitle(activeStep)}
      </DialogTitle>

      <DialogContent dividers>
        {whichContentShow(activeStep)}
      </DialogContent>

      <DialogActions>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItem: 'center',
            width: '100%',
          }}
        >
          {allowEditing ? (
            <MobileStepper
              steps={2}
              position="static"
              variant="text"
              activeStep={activeStep}
              nextButton={
                <Button size="small" onClick={handleNext} disabled={false}>
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button size="small" onClick={handleBack} disabled={false}>
                  <KeyboardArrowLeft />
                </Button>
              }
            />
          ) : <div />}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItem: 'center',
            }}
          >
            {!allowEditing ?
              <Button
                disabled={wait}
                onClick={handleDiscardChanges}
                color="secondary"
                startIcon={<CloseIcon />}
              >
                Descartar Alterações
              </Button>
              :
              null
            }

            <Button
              disabled={wait || activeStep === 2}
              onClick={handleChangeEditingState}
              color="primary"
              startIcon={allowEditing ? <EditIcon /> : <SaveIcon />}
            >
              {allowEditing ? 'Editar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogActions>

    </Dialog >
  );
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    minWidth: 120,
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const returnModalTitle = (step) => {
  switch (step) {
    case 0:
      return 'Contrato - DADOS'
    case 1:
      return 'Anexo - FATURAMENTO'
    default:
      return 'Contrato'
  }
}