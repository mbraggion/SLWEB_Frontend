import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

export const ModalCOF = ({ open, onClose }) => {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen={true}
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={onClose}
      >
        COF Pilão Professional
      </DialogTitle>

      <DialogContent dividers>
        <iframe
          src='https://drive.google.com/uc?export=view&id=1iG3X7qnH6sNar4J1VAiDT1oiG2l6R1IY'
          frameBorder="0"
          title='COF'
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          Fechar
        </Button>

      </DialogActions>

    </Dialog>
  )
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
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

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