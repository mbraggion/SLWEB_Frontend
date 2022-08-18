import React, { useState } from 'react';

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, useMediaQuery, IconButton, Typography } from '@material-ui/core/';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, Edit as EditIcon } from '@material-ui/icons';

import { useFiles } from '../../../hooks/useFiles'

export const RenameModal = ({ open, onClose }) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    data: { markedItems, folderPath },
    actions: { onRename }
  } = useFiles()

  const [wait, setWait] = useState(false)
  const [newName, setNewName] = useState('')

  const handleSubmit = async () => {
    setWait(true)

    const res = await onRename(newName)

    if(res ===  true){
      handleClose()
    }else{
      setWait(false)
    }
  }

  const handleClose = () => {
    if (wait) return
    onClose();
    setNewName('')
    setWait(false)
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title" >
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        Renomear {markedItems.length === 1 ? 'arquivo' : markedItems.length > 1 ? 'arquivos' : 'pasta'}
      </DialogTitle>

      <DialogContent dividers>
        <div className='YAlign'>
          <TextField
            className={classes.TextInput}
            label="Nome atual"
            variant="outlined"
            value={markedItems.length > 0 ? markedItems[0].filename : folderPath[folderPath.length - 1]}
            disabled={true}
          />
          <TextField
            className={classes.TextInput}
            style={{ marginTop: '8px' }}
            label="Insira novo nome"
            variant="outlined"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            disabled={false}
          />
          {markedItems.length > 0 ?
            <Typography variant='caption'>
              *Alterar a extensão do arquivo pode torná-lo inutilizável
            </Typography>
            :
            null
          }
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={handleSubmit}
          startIcon={<EditIcon />}
          disabled={wait}
        >
          Renomear
        </Button>
        <Button
          color="secondary"
          onClick={handleClose}
          startIcon={<CloseIcon />}
          disabled={wait}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  TextInput: {
    height: '55px',
    width: '100%',
    '& div': {
      height: '100%',
    },
    '& div>input:nth-child(1)': {
      margin: '0px 8px',
    },
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: 500
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
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
