import React, { useState, useEffect } from 'react';

import { Button, Dialog, MobileStepper, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, useMediaQuery, IconButton, Typography } from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Save as SaveIcon, Edit as EditIcon, KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';

import { Dados } from './_dados'

export const DetailsModal = ({ open, onClose, FranquiaStatus, GrpVen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //   const childRef = useRef();

  const [activeStep, setActiveStep] = useState(0);
  const [allowEditing, setAllowEditing] = useState(true);
  // const [wait, setWait] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveStep(0)
    }
  }, [open])

  const handleChangeEditingState = async () => {
    setAllowEditing(oldState => !oldState)

    // if (!allowEditing) {
    //   let toastId = null
    //   toastId = Toast('Salvando Alterações...', 'wait')
    //   setWait(true)

    //   try {
    //     if(!await childRef.current.handleSubmit()){
    //       throw new Error()
    //     }

    //     Toast('Alterações salvas com sucesso', 'update', toastId, 'success')
    //     setWait(false)
    //   } catch (err) {
    //     Toast('Falha ao salvar alterações', 'update', toastId, 'error')
    //     setWait(false)
    //     setAllowEditing(false)
    //   }
    // }
  }

  // const handleInativar = async ({ Status }) => {
  //   let toastId = null

  //   toastId = Toast(Status === 'A' ? 'Inativando...' : 'Ativando...', 'wait')
  //   setWait(true)

  //   try {
  //     //fazer put aqui

  //     Toast(Status === 'A' ? 'Ponto de venda inativado' : 'Ponto de venda ativado', 'update', toastId, 'success')
  //     setWait(false)
  //   } catch (err) {
  //     Toast(Status === 'A' ? 'Falha ao inativar ponto de venda' : 'Falha ao ativar ponto de venda', 'update', toastId, 'error')
  //     setWait(false)
  //   }
  // }

  const handleDiscardChanges = () => {
    // childRef.current.undoChanges()
    setAllowEditing(true)
  }

  const whichContentShow = (stage) => {
    switch (stage) {
      case 0:
        return (
          <Dados grpven={GrpVen} />
        )
      case 1:
        return (
          <h6>Detalhes</h6>
        )
      case 2:
        return (
          <h6>Ações</h6>
        )
      default:
        return null
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep === 2 ? 0 : prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep === 0 ? 2 : prevActiveStep - 1);
  };

  const handleClose = () => {
    // if (!wait) {
      onClose()
      setAllowEditing(true)
    // }
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
              steps={3}
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
                disabled={false}
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
              disabled={false}
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
      return 'Franquia - DADOS'
    case 1:
      return 'Franquia - DETALHES'
    case 2:
      return 'Franquia - AÇÕES'
    default:
      return 'Franquia'
  }
}