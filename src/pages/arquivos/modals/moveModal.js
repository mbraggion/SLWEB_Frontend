import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api'

import { Button, List, ListItemSecondaryAction, ListItemText, ListItem, Avatar, ListItemAvatar, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, useMediaQuery, IconButton, Typography } from '@material-ui/core/';
import { useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon, KeyboardReturn as KeyboardReturnIcon, FolderOpen as FolderOpenIcon, Folder as FolderIcon, MoveToInbox as MoveToInboxIcon, ArrowForwardIos as ArrowForwardIosIcon } from '@material-ui/icons';

import { useFiles } from '../../../hooks/useFiles'

export const MoveModal = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    data: { markedItems, formatedFolderPath, folderPath },
    actions: { onMove }
  } = useFiles();

  const [wait, setWait] = useState(false)
  const [tgFolder, setTgFolder] = useState([])
  const [thisPath, setThisPath] = useState([])

  const loadFolders = async (folder = 'root') => {
    try {
      const response = await api.get(`/files/lookup/${encodeURI(folder)}`)

      setTgFolder(response.data.pastas)
      setThisPath(response.data.pathSegments)
    } catch (err) {
      setTgFolder([])
    }
  }

  useEffect(() => {
    if (open === true) loadFolders()
  }, [open])

  const handleSubmit = async () => {
    setWait(true)

    const res = await onMove(formatedFolderPath, String(thisPath).toString().replace(/,/g, '\\'))

    if (res === true) {
      handleClose()
    } else {
      setWait(false)
    }
  }

  const handleClose = () => {
    if (wait) return
    onClose();

    setTgFolder([])
    setThisPath([])
    setWait(false)
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title" >
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        Mover {markedItems.length === 1 ? 'arquivo' : markedItems.length > 1 ? 'arquivos' : 'pasta'}
      </DialogTitle>

      <DialogContent dividers style={{ display: 'flex', flexDirection: 'column' }}>
        {tgFolder.length > 0 ?
          <List dense={true} style={{ overflowY: 'auto' }}>
            {tgFolder.map(f => (
              <ListItem
                button
                onClick={() => loadFolders(f.path)}
                disabled={markedItems.length === 0 && String(f.path).includes(formatedFolderPath)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={f.folder}
                  secondary={markedItems.length === 0 && String(f.path).includes(formatedFolderPath) ? 'Não é possivel mover aqui' : null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ArrowForwardIosIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          :
          <div className="YAlign" style={{ alignItems: 'center', margin: '0px 0px 8px 0px' }} >
            <FolderOpenIcon fontSize='large' />
            <Typography variant='caption'>
              Não há subpastas aqui.
            </Typography>
          </div>
        }
        <div className='YAlign'>
          <Typography variant='caption'>
            <strong>De:</strong> \{formatedFolderPath}\
          </Typography>

          {markedItems.length > 0 ?
            markedItems.map((mi, i) => (
              <Typography variant='caption' style={{ margin: '0px 0px 0px 8px' }}>
                <strong>{i + 1}° item:</strong> {mi.filename}
              </Typography>
            ))
            :
            null
          }

          <Typography variant='caption'>
            <strong>Para:</strong> \{String(thisPath).toString().replace(/,/g, '\\')}\
          </Typography>
        </div>
      </DialogContent>

      <DialogActions>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Button
              color="primary"
              onClick={() => loadFolders(thisPath.slice(0, thisPath.length - 1).toString().replace(/,/g, '\\'))}
              startIcon={<KeyboardReturnIcon />}
              disabled={wait || thisPath.length <= 1}
              variant='outlined'
            >
              Voltar
            </Button>
            <Button
              style={{ margin: '0px 0px 0px 8px' }}
              color="primary"
              onClick={handleSubmit}
              startIcon={<MoveToInboxIcon />}
              disabled={
                wait ||
                (markedItems.length === 0 && String(folderPath).toString() === String([...thisPath, folderPath.length > 1 ? folderPath[folderPath.length - 1] : null].filter(item => item !== null)).toString()) ||
                (String(folderPath).toString() === String(thisPath).toString())
              }
              variant='contained'
            >
              Mover aqui
            </Button>
          </div>
          <Button
            color="secondary"
            onClick={handleClose}
            startIcon={<CloseIcon />}
            disabled={wait}
          >
            Fechar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

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
