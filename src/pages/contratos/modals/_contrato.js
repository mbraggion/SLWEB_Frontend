import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { api } from '../../../services/api';

import { Divider, makeStyles, TextField, Typography } from '@material-ui/core';
import { Icon } from "react-materialize";
import { saveAs } from 'file-saver'

import FileInput from '../../../components/FileInput';
import Datepicker from '../../../components/materialComponents/datePicker';
import { Toast } from '../../../components/toasty';
import { InputTel } from '../components/inputTel';

export const Contrato = forwardRef(({ contract, allowEdit }, ref) => {
  const classes = useStyles()

  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [infoContrato, setInfoContrato] = useState(null)

  const LoadData = async () => {
    try {
      const response = await api.get(`/contracts/info/contrato/${contract.CNPJ}/${contract.ConId}`)

      setInfoContrato(response.data.Contract)
      setLoaded(true)
    } catch (err) {
    }
  }

  useEffect(() => {
    LoadData()
    // eslint-disable-next-line
  }, [])

  useImperativeHandle(ref, () => ({
    async handleSubmit() {
      try {
        await api.put(`/contracts/info/contrato/${contract.CNPJ}/${contract.ConId}`, {
          payload: infoContrato
        })

        return true
      } catch (err) {
        return false
      }
    },

    async undoChanges() {
      setLoaded(false)
      setInfoContrato(null)
      await LoadData()
    }
  }))

  const handleSelectFile = async () => {
    setFetching(true)

    const arquivos = getFiles()
    const formData = makeFormData(arquivos)

    let qtdArquivos = formData.getAll('formData').length

    if (qtdArquivos < 1) {
      alert('nenhum arquivo selecionado')
      setFetching(false)
      return
    }

    let fn = []

    for (let i = 0; i < formData.getAll('formData').length; i++) {
      fn.push(formData.getAll('formData')[i].name)
    }

    formData.append('multiple', qtdArquivos > 1 ? "S" : "N")
    formData.append('fn', JSON.stringify(fn))
    formData.append('CNPJ', contract.CNPJ)
    formData.append('ConId', contract.ConId)

    let toastId = null

    try {
      toastId = Toast('Enviando...', 'wait')

      await api.post(`/contracts/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })

      Toast('Documento salvo', 'update', toastId, 'success')

      document.getElementsByClassName("files")[0].value = ''
      setFetching(false)
      LoadData()
    } catch (err) {
      Toast('Falha ao salvar documento', 'update', toastId, 'error')

      document.getElementsByClassName("files")[0].value = ''
      setFetching(false)
    }
  }

  const handleDownloadFile = async (filename) => {
    let toastId = null;
    toastId = Toast("Baixando...", "wait");

    try {
      const response = await api.get(`/contracts/documents/${contract.CNPJ}/${contract.ConId}/${encodeURI(filename)}`, {
        responseType: "arraybuffer",
      })

      Toast("Download concluído", "update", toastId, "success");

      //Converto o PDF para BLOB
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      //Salvo em PDF junto com a data atual, só pra não sobreescrever nada
      saveAs(blob, filename);
    } catch (err) {
      Toast("Falha no download", "update", toastId, "error");
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

  return !loaded
    ? (
      <Typography>Aguarde...</Typography>
    )
    : (
      <div className={classes.container}>

        <div className={classes.linha}>
          <TextField
            value={infoContrato.ConId}
            onChange={() => { }}
            disabled={true}
            label='Contrato'
            className={classes.conId}
          />
          <TextField
            value={infoContrato.Nome_Fantasia}
            onChange={() => { }}
            disabled={true}
            label='Cliente'
            className={classes.cliente}
          />
        </div>
        <div className={classes.linha}>
          <TextField
            value={infoContrato.CNPJss}
            onChange={() => { }}
            disabled={true}
            label='CNPJ'
            className={classes.CNPJ}
          />
        </div>
        <div className={classes.linha}>
          <Datepicker
            min={false}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Dt_Inicio: e._d
            })}
            disabled={allowEdit}
            label={'Início'}
            defaultValue={infoContrato.Dt_Inicio}
            style={{ marginRight: '4px' }}
          />
          <Datepicker
            min={false}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Dt_Fim: e._d
            })}
            disabled={allowEdit}
            label={'Encerramento'}
            defaultValue={infoContrato.Dt_Fim}
            style={{ marginLeft: '4px' }}
          />
        </div>

        <Divider style={{ width: '100%', margin: '8px 0px' }} />
        <li
          style={{
            listStyleType: 'none',
            marginBottom: '8px'
          }}
        >
          <Typography
            color="primary"
            display="block"
            variant="body1"

          >
            Contato 1
          </Typography>
        </li>

        <div className={classes.linha}>
          <TextField
            value={infoContrato.Contato_Empresa}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Contato_Empresa: e.target.value
            })}
            disabled={allowEdit}
            label='Nome'
          />
          <InputTel
            value={infoContrato.Contato2}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Contato2: e.target.value
            })}
            disabled={allowEdit}
            className={classes.telInput}
            label={'Telefone'}
          />
        </div>
        <div className={classes.linha}>
          <TextField
            value={infoContrato.Email}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Email: e.target.value
            })}
            disabled={allowEdit}
            label='Email'
            className={classes.email}
          />
        </div>

        <Divider style={{ width: '100%', margin: '8px 0px' }} />
        <li
          style={{
            listStyleType: 'none',
            marginBottom: '8px'
          }}
        >
          <Typography
            color="primary"
            display="block"
            variant="body1"
          >
            Contato 2
          </Typography>
        </li>

        <div className={classes.linha}>
          <TextField
            value={infoContrato.Contato_Empresa_2}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Contato_Empresa_2: e.target.value
            })}
            disabled={allowEdit}
            label='Nome'
          />
          <InputTel
            value={infoContrato.Fone_2}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Fone_2: e.target.value
            })}
            disabled={allowEdit}
            className={classes.telInput}
            label={'Telefone'}
          />
        </div>
        <div className={classes.linha}>
          <TextField
            value={infoContrato.Email_2}
            onChange={(e) => setInfoContrato({
              ...infoContrato,
              Email_2: e.target.value
            })}
            disabled={allowEdit}
            label='Email'
            className={classes.email}
          />
        </div>

        <Divider style={{ width: '100%', margin: '8px 0px' }} />
        <li
          style={{
            listStyleType: 'none',
            marginBottom: '8px'
          }}
        >
          <Typography
            color="primary"
            display="block"
            variant="body1"
          >
            Documentos
          </Typography>
        </li>

        <ul
          style={{
            listStyleType: 'disclosure-closed',
            paddingLeft: '16px',
            maxWidth: '400px'
          }}
        >
          {infoContrato.documents.map(filename => (
            <li
              style={{
                listStyleType: 'disclosure-closed',
              }}
            >
              <Typography
                variant='body1'
                className={classes.documentsLink}
                onClick={() => handleDownloadFile(filename)}
              >
                {filename}
              </Typography>
            </li>
          ))}
        </ul>

        <FileInput
          label={
            <div className="XAlign">
              <Icon>attach_file</Icon>
              ENVIAR DOCUMENTO
            </div>
          }
          ContainerStyle={{
            display: 'flex',
            flexDirection: "column",
            height: '100%',
            width: '100%',
          }}
          ButtonStyle={{
            width: '100%'
          }}
          onChange={handleSelectFile}
          name='upload'
          accept='application/pdf,image/png, image/jpeg'
          multiple={true}
          disabled={fetching}
        />

      </div>
    )
})

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  conId: {
    maxWidth: '50px'
  },
  cliente: {
    width: '100%',
    marginLeft: '8px'
  },
  linha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  CNPJ: {
    width: '100%',
    marginTop: '8px'
  },
  telInput: {

  },
  email: {
    width: '100%'
  },
  dividerInset: {
    margin: `5px 0 0 ${theme.spacing(9)}px`,
  },
  documentsLink: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '16px',
    padding: '4px 0px',
    
    '&:hover': {
      textDecoration: 'underline',
      color: 'blue',
      cursor: 'pointer'
    }
  }
}))