import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api'

import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  useMediaQuery,
  IconButton,
  Typography,
} from '@material-ui/core/';

import {
  useTheme,
  withStyles,
} from '@material-ui/core/styles';

import {
  Close as CloseIcon,
} from '@material-ui/icons';

import Loading from '../../../components/loading_screen'

export const InstrucoesPrivateLabel = ({ open, onClose, title }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [wait, setWait] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    LoadData()
  }, [])

  async function LoadData() {
    setWait(true)

    try {
      const response = await api.get('/equip/payment/information/privatelabel')

      setContent(response.data.Instrucoes)
      setWait(false)
    } catch (err) {
      setWait(false)
    }

    
  }

  const handleClose = () => {
    onClose();
  }

  return wait ?
    <Loading />
    :
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle
        id="customized-dialog-title"
        onClose={handleClose}>
        {title}
      </DialogTitle>

      <DialogContent dividers>
        <div
          style={{
            padding: '8px 10px 0px 30px',
            fontSize: '14px'
          }}
          dangerouslySetInnerHTML={{
            __html: content
          }}
        >

        </div>
      </DialogContent>
    </Dialog>
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: '0px',
  },
}))(MuiDialogContent);
