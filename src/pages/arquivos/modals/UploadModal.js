import React, { useState } from 'react';
import { api } from '../../../services/api'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle, useMediaQuery, IconButton, Typography, } from '@material-ui/core/';
import { useTheme, withStyles, } from '@material-ui/core/styles';
import { Close as CloseIcon, Backup as BackupIcon } from '@material-ui/icons';
import { Icon } from "react-materialize";
import NewFileInput from '../../../components/FileInput'

import { Toast } from '../../../components/toasty'

import { useFiles } from '../../../hooks/useFiles'

export const UploadModal = ({ open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    data: { formatedFolderPath },
    actions: { onNavigate }
  } = useFiles()

  const [wait, setWait] = useState(false)
  const [fileNames, setFileNames] = useState([])

  const handleSubmit = async () => {
    setWait(true)

    const arquivos = getFiles()
    const formData = makeFormData(arquivos)

    let qtdArquivos = formData.getAll('formData').length

    //verificar se o cara escolheu algum arquivo
    if (qtdArquivos < 1) {
      Toast('Anexe pelo menos um arquivo de imagem ou PDF', 'warn')
      setWait(false)
      return
    }

    let toastId = null

    formData.append('multiple', qtdArquivos > 1 ? "S" : "N")
    formData.append('targetFolder', formatedFolderPath)

    try {
      toastId = Toast('Enviando...', 'wait')

      //enviar primeiro os arquivos
      await api.post(`/files/upload/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })

      Toast('Upload concluído com sucesso', 'update', toastId, 'success')
      await onNavigate(encodeURI(formatedFolderPath))
      handleClose()
    } catch (err) {
      Toast('Falha no upload', 'update', toastId, 'error')
      setWait(false)
    }
  }

  const getFiles = () => {
    //Pega todos inputs do tipo arquivos
    const arquivos = document.getElementsByClassName("files");

    return arquivos
  }

  const makeFormData = (htmlFileCollection) => {
    //cria um objeto do tipo formulario
    const formData = new FormData();

    //poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
    for (let j = 0; j < htmlFileCollection.length; j++) {
      for (let i = 0; i < htmlFileCollection[j].files.length; i++) {
        formData.append(`formData`, htmlFileCollection[j].files[i]);
      }
    }

    return formData
  }

  const getFileNames = (FormData) => {
    let aux = []
    for (let i = 0; i < FormData.getAll('formData').length; i++) {
      aux.push(FormData.getAll('formData')[i].name)
    }
    setFileNames(aux)
  }

  const handleClose = () => {
    if (wait) return
    onClose();
    setWait(false)
    setFileNames([])
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title" >
      <DialogTitle id="customized-dialog-title" onClose={handleClose} >
        Upload de arquivos
      </DialogTitle>

      <DialogContent dividers>
        <div className='YAlign'>
          <Typography
            variant='body1'
            gutterBottom
          >
            Selecione um ou mais arquivos para serem transferidos para a pasta compartilhada da Pilão Professional.
          </Typography>
          <div
            className='XAlign'
            style={{
              alignItems: 'flex-start',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px dashed #CCC',
              justifyContent: 'space-evenly'
            }}
          >
            <div
              className='YAlign'
              style={{
                width: '100%',
                flex: 'unset',
                maxWidth: '250px'
              }}
            >
              <Typography variant='body1'>
                <strong>Selecione o(s) arquivo(s)</strong>
              </Typography>
              <NewFileInput
                ContainerStyle={{
                  display: 'flex',
                  flexDirection: "column",
                  height: '100%',
                  width: '80%',
                }}
                onChange={() => getFileNames(makeFormData(getFiles()))}
                multiple={true}
                name="upload"
                // accept="application/pdf, application/cdr, application/coreldraw, application/x-cdr, application/x-coreldraw, application/vnd.corel-draw, image/cdr, image/CDR, image/x-cdr, image/x-coreldraw, zz-application/zz-winassoc-cdr, image/png, image/jpeg, video/mp4, font/ttf"
                accept='*'
                label={
                  <div className="XAlign">
                    <Icon>attach_file</Icon>
                    ANEXAR
                  </div>
                }
              />

            </div>
            <div
              className='XAlign'
              style={{
                maxWidth: '250px'
              }}
            >
              <Typography variant='body1'>
                <strong>Arquivo(s) selecionado(s)</strong>
              </Typography>
              <ul style={{ listStyleType: 'disclosure-closed', paddingLeft: '16px' }}>
                {fileNames.map(filename => (
                  <li style={{ listStyleType: 'disclosure-closed' }}>
                    <Typography variant='subtitle1'>
                      {filename}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Typography variant='subtitle1' style={{ marginTop: '8px' }}>
            Upload para: <strong>\{formatedFolderPath}\</strong>
          </Typography>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          color="primary"
          onClick={handleSubmit}
          startIcon={<BackupIcon />}
          disabled={wait}
        >
          Upload
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
