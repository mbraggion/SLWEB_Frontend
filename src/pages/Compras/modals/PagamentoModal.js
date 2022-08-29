import React, { useState } from 'react';
import Draggable from "react-draggable";
import { api } from '../../../services/api'

import { Close, Receipt, Check } from "@material-ui/icons";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grow,
  Paper,
  Typography,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@material-ui/core/";
import { Icon } from "react-materialize";

import NewFileInput from '../../../components/FileInput'
import { Toast } from '../../../components/toasty'
import { navigateTo } from '../../../misc/commom_functions'

function ContasModal({ open, onClose, duplicatas, confiavel, naoCompensavel }) {
  const [confirmDuplicatas, setConfirmDuplicatas] = useState(null)
  const [fileNames, setFileNames] = useState([])
  const [fetching, setFetching] = useState(false)

  const handleSubmit = async () => {
    setFetching(true)
    const arquivos = getFiles()
    const formData = makeFormData(arquivos)

    //verificar se o cara marcou alguma duplicata
    if (confirmDuplicatas === null) {
      Toast('Selecione uma duplicata a ser compensada', 'warn')
      setFetching(false)
      return
    }

    let qtdArquivos = formData.getAll('formData').length

    //verificar se o cara escolheu algum arquivo
    if (qtdArquivos < 1) {
      Toast('Anexe pelo menos um arquivo de imagem ou PDF que comprove o pagamento da duplicata', 'warn')
      setFetching(false)
      return
    }

    let toastId = null

    formData.append('serie', confirmDuplicatas.E1_PREFIXO[0])
    formData.append('parcela', confirmDuplicatas.E1_PARCELA.trim())
    formData.append('nf', confirmDuplicatas.E1_NUM)
    formData.append('valor', confirmDuplicatas.E1_SALDO)
    formData.append('multiple', qtdArquivos > 1 ? "S" : "N")
    formData.append('folderName', confirmDuplicatas.E1_NUM.trim())

    try {
      toastId = Toast('Enviando...', 'wait')

      //enviar primeiro os arquivos
      await api.post(`/compras/duplicatas/report/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })

      Toast('Duplicata compensada', 'update', toastId, 'success')
      setTimeout(() => {
        navigateTo('reload')
      }, 3000)
    } catch (err) {
      Toast('Falha ao compensar duplicata', 'update', toastId, 'error')
      setFetching(false)
    }
  }

  const handleClickDuplicata = (checked, index) => {
    if (checked) {
      setConfirmDuplicatas(duplicatas[index])
    } else {
      setConfirmDuplicatas(null)
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
    onClose()
    setFileNames([])
    setConfirmDuplicatas([])
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      TransitionComponent={Transition}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <div className='XAlign' style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <Receipt />
          Agilizar pagamento(s)
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='YAlign'>
          <Typography
            variant='body1'
            gutterBottom
          >
            Caso o pagamento de alguma duplicata esteja levando muito tempo para ser confirmado pelo sistema, nos envie o comprovante de pagamento.
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
                <strong>Selecione o comprovante</strong>
              </Typography>
              <NewFileInput
                ContainerStyle={{
                  display: 'flex',
                  flexDirection: "column",
                  height: '100%',
                  width: '80%',
                }}
                onChange={() => getFileNames(makeFormData(getFiles()))}
                multiple={false}
                name="upload"
                accept="application/pdf,image/png, image/jpeg"
                label={
                  <div className="XAlign">
                    <Icon>attach_file</Icon>
                    ANEXAR
                  </div>
                }
              />
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
            <div
              className='XAlign'
              style={{
                maxWidth: '250px'
              }}
            >
              <FormControl component="fieldset">
                <FormLabel
                  component="legend"
                  style={{
                    paddingTop: '4px'
                  }}
                >
                  <strong style={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                    Selecione a duplicata paga
                  </strong>
                </FormLabel>
                <FormGroup>
                  {duplicatas.map((duplicata, index) => (
                    <FormControlLabel
                      key={duplicata.E1_NUM}
                      control={
                        <Checkbox
                          style={{
                            transform: 'scale(0.3)'
                          }}
                          checked={
                            confirmDuplicatas !== null &&
                            confirmDuplicatas.E1_NUM === duplicata.E1_NUM &&
                            confirmDuplicatas.E1_PREFIXO[0] === duplicata.E1_PREFIXO[0] &&
                            confirmDuplicatas.E1_PARCELA === duplicata.E1_PARCELA
                          }
                          onChange={e => handleClickDuplicata(e.target.checked, index)}
                          name={duplicata.E1_NUM}
                          value={duplicata}
                        // disabled={naoCompensavel.filter(nc => nc.E1_PREFIXO.trim() === duplicata.E1_PREFIXO[0].trim() && nc.E1_NUM.trim() === duplicata.E1_NUM.trim() && nc.E1_PARCELA.trim() === duplicata.E1_PARCELA.trim()).length > 0}
                        />
                      }
                      label={
                        <>
                          <strong>
                            {duplicata.E1_NUM}
                            {duplicata.E1_PARCELA.trim() !== '' ?
                              ` | ${duplicata.E1_PARCELA.trim()}`
                              :
                              null
                            }
                          </strong>
                          {naoCompensavel.filter(nc => nc.E1_PREFIXO.trim() === duplicata.E1_PREFIXO[0].trim() && nc.E1_NUM.trim() === duplicata.E1_NUM.trim() && nc.E1_PARCELA.trim() === duplicata.E1_PARCELA.trim()).length > 0 ? ` (em análise)` : ` (R$ ${duplicata.E1_SALDO})`}
                        </>
                      }
                    />
                  ))}
                </FormGroup>
                {/* <FormHelperText>*Seleciona apenas as quais o comprovante se refere</FormHelperText> */}
              </FormControl>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px' }}>
        <Button
          color="primary"
          onClick={() => handleSubmit()}
          startIcon={<Check />}
          disabled={fetching}
        >
          Enviar
        </Button>
        <Button
          color="secondary"
          onClick={handleClose}
          startIcon={<Close />}
          disabled={fetching}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ContasModal;

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper
        {...props}
        style={{
          width: "100%",
        }}
      />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow {...props} />;
});
