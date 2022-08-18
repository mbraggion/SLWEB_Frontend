import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'
import moment from 'moment';
import clsx from 'clsx';
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from "@material-ui/pickers";

import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import {
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import PesoInput from './components/pesoInput'
import CaixaInput from './components/caixaInput'
// import DatePicker from '../../components/materialComponents/datePicker'
import { Toast } from '../../components/toasty'

export const PedidoItem = ({ Pedido, ExpandedID, handleChangeExpandedAccordion, onUpdatePedido, Transportadoras }) => {
  const classes = useStyles();

  const [wait, setWait] = useState(false)
  const [peso, setPeso] = useState(0)
  const [qtd, setQtd] = useState(0)
  const [emissao, setEmissao] = useState('00')
  const [msgNF, setMsgNF] = useState('')
  const [tipoVolume, setTipoVolume] = useState(null)
  const [transp, setTransp] = useState(null)
  const [dtFaturamento, setDtFaturamento] = useState(null)

  useEffect(() => {
    if (Pedido.MsgNotaFiscal !== null) {
      setMsgNF(Pedido.MsgNotaFiscal)
    }

    if (Pedido.QtdVolumes !== null) {
      setQtd(Pedido.QtdVolumes)
    }

    if (Pedido.TipoVolume !== null) {
      setTipoVolume(Pedido.TipoVolume.trim())
    }

    if (Pedido.Peso !== null) {
      setPeso(Pedido.Peso)
    }

    if (Pedido.EMISS !== null) {
      setEmissao(Pedido.EMISS)
    }

    if (Pedido.DataEntrega !== null) {
      setDtFaturamento(Pedido.DataEntrega)
    }

    if (Pedido.Transportadora !== null) {
      setTransp(Pedido.Transportadora.trim())
    }

  }, [Pedido])

  const handleSubmit = async () => {
    const payload = {
      ID: Pedido.PedidoID,
      Tipo: tipoVolume,
      Qtd: qtd,
      Peso: peso,
      MsgNFe: msgNF,
      Emissao: emissao,
      Transportadora: transp,
      Faturamento: dtFaturamento
    }

    let toastId = null
    toastId = Toast('Atualizando pedido...', 'wait')
    setWait(true)

    try {
      await api.put('/pedidos/compra/', {
        payload
      })

      Toast('Pedido atualizado', 'update', toastId, 'success')
      onUpdatePedido(oldPedidosArray => {
        let aux = [...oldPedidosArray]

        oldPedidosArray.forEach((ped, i) => {
          if (ped.PedidoID === Pedido.PedidoID) {
            aux[i] = {
              ...aux[i],
              MsgNotaFiscal: msgNF,
              QtdVolumes: qtd,
              TipoVolume: tipoVolume,
              Peso: peso,
              EMISS: emissao,
              DataEntrega: dtFaturamento,
              Transportadora: transp
            }
          }
        })

        return aux
      })
      setWait(false)
    } catch (err) {
      Toast('Falha ao atualizar pedido', 'update', toastId, 'error')
      setWait(false)
    }
  }

  const handleDiscard = () => {
    if (Pedido.MsgNotaFiscal !== null) {
      setMsgNF(Pedido.MsgNotaFiscal)
    } else {
      setMsgNF('')
    }

    if (Pedido.QtdVolumes !== null) {
      setQtd(Pedido.QtdVolumes)
    } else {
      setQtd(0)
    }

    if (Pedido.TipoVolume !== null) {
      setTipoVolume(Pedido.TipoVolume.trim())
    } else {
      setTipoVolume(null)
    }

    if (Pedido.Peso !== null) {
      setPeso(Pedido.Peso)
    } else {
      setPeso(0)
    }

    if (Pedido.EMISS !== null) {
      setEmissao(Pedido.EMISS)
    } else {
      setEmissao('00')
    }

    if (Pedido.DataEntrega !== null) {
      setDtFaturamento(Pedido.DataEntrega)
    } else {
      setDtFaturamento(null)
    }

    if (Pedido.Transportadora !== null) {
      setTransp(Pedido.Transportadora)
    } else {
      setTransp(null)
    }
  }

  return (
    <Accordion
      expanded={ExpandedID === Pedido.PedidoID}
      style={{
        borderLeft: `4px solid ${Pedido.Status === 'Aguardando' ? '#4f9eff' : '#29ff8d'}`
      }}
      onChange={() => handleChangeExpandedAccordion(ExpandedID === Pedido.PedidoID ? null : Pedido.PedidoID)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div className={classes.column}>
          <Typography className={classes.heading}>Pedido de compra <strong>{Pedido.PedidoID}</strong></Typography>
          <Typography className={classes.secondaryHeading}><strong>{moment(Pedido.DataCriacao).format('L')}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Valor do Pedido: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Pedido.SomaDePrecoTotal)}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Items: <strong>{Pedido.ContarDePedidoItemID}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>{Pedido.Razão_Social}</Typography>
          <Typography className={classes.secondaryHeading}>Código <strong>{Pedido.CodigoCliente}</strong></Typography>
        </div>
      </AccordionSummary>
      <Divider />
      <AccordionDetails className={classes.details}>
        <div className={clsx(classes.column_1, classes.helper)}>
          {Pedido.Detalhes.map(item => (
            <div
              key={item.PedidoItemID}
              className={classes.prodLine}
            >
              <div>
                <Typography className={classes.heading}><strong>{String(item.Produto).split('(')[0]}</strong></Typography>
                <Typography variant='caption'>(Cód <strong>{item.CodigoProduto}</strong>)</Typography>
              </div>
              <div>
                <Typography className={classes.heading}>Qtd: <strong>{item.QtdeVendida}</strong></Typography>
              </div>
              <div>
                <Typography className={classes.heading}>Total: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.PrecoTotal)}</strong></Typography>
                <Typography variant='caption'>(Un. <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.PrecoUnitarioLiquido)}</strong>)</Typography>
              </div>
            </div>
          ))}
        </div>
        <div className={clsx(classes.column_2, classes.helper)}>
          <div className={classes.align} style={{ alignItems: 'flex-end' }}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-outlined-label">Embalagem</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                value={String(tipoVolume).trim()}
                onChange={(e) => setTipoVolume(e.target.value)}
                label="Embalagem"
                disabled={wait}
              >
                <MenuItem value={null} disabled>Selecione...</MenuItem>
                <MenuItem value='CX'>Caixa</MenuItem>
              </Select>
            </FormControl>
            <CaixaInput
              Qtd={qtd}
              onChangeQtd={value => setQtd(value)}
              disabled={wait}
            />
          </div>
          <FormControl
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel id="demo-simple-select-outlined-label-1">Emissão</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-1"
              value={emissao}
              onChange={e => setEmissao(e.target.value)}
              label="Emissão"
              disabled={wait}
            >
              <MenuItem value='01'>Não transmite nota, gera boleto</MenuItem>
              <MenuItem value='11'>Transmite nota, gera boleto</MenuItem>
              <MenuItem value='10'>Transmite nota, não gera boleto</MenuItem>
              <MenuItem value='00'>Não transmite nota, não gera boleto</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel id="demo-simple-select-outlined-label-2">Transportadora</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label-2"
              value={transp}
              onChange={(e) => setTransp(e.target.value)}
              label="Transportadora"
              disabled={wait}
            >
              <MenuItem value={null} disabled>Selecione...</MenuItem>
              {Transportadoras.map(tr => (
                <MenuItem key={tr.A4_COD} value={tr.A4_COD}>{tr.A4_NREDUZ}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={classes.align} style={{ alignItems: 'baseline' }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                style={{ width: "170px", marginTop: '0px' }}
                disabled={wait}
                disableToolbar
                disablePast={true}
                autoOk
                invalidDateMessage="Data inválida"
                minDateMessage={"Data anteior ao dia de hoje"}
                minDate={moment().startOf('day').toDate()}
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                id="date-picker-inline"
                label='Faturamento'
                value={dtFaturamento}
                onChange={value => {
                  if (value!== null && !value.startOf('day').isBefore(moment().startOf('day').toDate()) && value.startOf('day').isValid()) {
                    setDtFaturamento(value.startOf('day')._d)
                  }else{
                    setDtFaturamento(null)
                  }
                }}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
            <PesoInput
              Peso={peso}
              onChangePeso={setPeso}
              disablde={wait}
            />
          </div>
          <TextField
            label="Mensagem Franqueado"
            style={{
              width: '100%',
              marginBottom: '8px'
            }}
            multiline
            maxRows={4}
            value={Pedido.MsgBO}
            variant="outlined"
            disabled={true}
          />
          <TextField
            label="Mensagem NFe"
            style={{ width: '100%' }}
            multiline
            maxRows={4}
            value={msgNF}
            onChange={e => setMsgNF(e.target.value)}
            variant="outlined"
            disabled={wait}
          />
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          size="small"
          color='secondary'
          onClick={handleDiscard}
        >
          Discartar
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={handleSubmit}
        >
          Gravar
        </Button>
      </AccordionActions>
    </Accordion>
  )
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  formControl: {
    width: '100%',
    margin: '0px 8px 8px 0px'
  },
  details: {
    alignItems: 'flex-start',
    overflow: 'auto'
  },
  prodLine: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '8px',

    '& div:nth-child(1) > p:nth-child(1)': {
      width: '350px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    '& div:nth-child(2) > p:nth-child(1)': {
      width: '100px',
    },
    '& div:nth-child(3) > p:nth-child(1)': {
      width: '110px',
    },
  },
  column: {
    flexBasis: '33%',
  },
  column_1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexBasis: '66.66%',
  },
  column_2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flexBasis: '33.33%',
  },
  align: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));