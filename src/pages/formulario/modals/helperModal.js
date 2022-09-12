import React, { 
  // useState 
} from 'react';
import { api } from '../../../services/api'
import { saveAs } from 'file-saver'

import {
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  useMediaQuery,
  IconButton,
  Typography,
  Button as ButtonMaterial,
  // TextField,
  makeStyles
} from '@material-ui/core/';

import {
  CloudDownload as CloudDownloadIcon
} from '@material-ui/icons'

import {
  useTheme,
  withStyles,
} from '@material-ui/core/styles';

import {
  Close as CloseIcon,
} from '@material-ui/icons';

import { Toast } from '../../../components/toasty'

export const HelperModal = ({ open, onClose, title }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles({
    fullScreen
  })

  const handleClose = () => {
    onClose();
  }

  const handleRetriveWORD = async () => {
    let toastId = null

    toastId = Toast('Buscando formulário...', 'wait')

    try {
      const response = await api.get("/form/original", {
        responseType: "arraybuffer",
      });

      Toast('Formulário encontrado!', 'update', toastId, 'success')

      const blob = new Blob([response.data], { type: "application/msword" });

      saveAs(blob, `Questionário de Perfil.doc`);
    } catch (err) {
      Toast('Falha ao recuperar formulário do servidor', 'update', toastId, 'error')
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      classes={{
        paper: classes.dialog
      }}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <div className='YAlign' style={{ padding: '8px' }}>
          <Typography
            variant='body1'
            gutterBottom
            align='center'
            style={{
              width: '100%'
            }}
          >
            Caso tenha problemas em preencher o formulário online, baixe a versão Word e nos encaminhe por email.
          </Typography>
          <ButtonMaterial
            className={classes.formDownloadButton}
            variant="outlined"
            color="primary"
            onClick={handleRetriveWORD}
            startIcon={<CloudDownloadIcon />}
          >
            DOWNLOAD DE FORMULÁRIO WORD
          </ButtonMaterial>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const useStyles = makeStyles({
  dialog: (props) => ({
    position: 'absolute',
    right: props.fullScreen ? 0 : -30,
    bottom: props.fullScreen ? 0 : -30,
    maxWidth: props.fullScreen ? 'unset' : '500px'
  }),
  messageTextArea: {
    width: '100%',
    margin: '8px 0px 8px 0px'
  },
  formDownloadButton: {
    width: '100%',
  },
  sendMessageButton: {
    width: '100%',
    margin: '0px 0px 32px 0px',
    background: '#34AF23'
  }
});

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
