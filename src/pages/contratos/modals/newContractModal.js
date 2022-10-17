import React, { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, IconButton, Typography, useMediaQuery } from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Save as SaveIcon } from '@material-ui/icons';

export const NewContractModal = ({ open, onClose, onRefresh }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [wait, setWait] = useState(false);

  const handleSubmit = async () => {
    alert('save!')
    onRefresh()
  }

  const handleClose = () => {
    if (!wait) {
      onClose()
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
        Novo Contrato
      </DialogTitle>

      <DialogContent dividers>

      </DialogContent>

      <DialogActions>
        <Button
          disabled={wait}
          onClick={handleSubmit}
          color="primary"
          startIcon={<SaveIcon />}
        >
          Salvar
        </Button>
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
