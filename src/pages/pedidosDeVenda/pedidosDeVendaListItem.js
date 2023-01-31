import moment from 'moment'
import React, { useState } from 'react'
import clsx from "clsx";
import { api } from '../../services/api'

import { Accordion, ButtonGroup, AccordionDetails, AccordionSummary, Button, Divider, makeStyles, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon, RecordVoiceOver as RecordVoiceOverIcon, NaturePeople as NaturePeopleIcon, Close as CloseIcon, Delete as DeleteIcon, Replay as ReplayIcon, Sync as SyncIcon, PhotoFilter as PhotoFilterIcon } from '@material-ui/icons'
import { BLUE_SECONDARY, ORANGE_PRIMARY, GREY_SECONDARY, RED_PRIMARY, PRIMARY_YELLOW, GREEN_PRIMARY, RED_SECONDARY } from '../../misc/colors'
import { Toast } from '../../components/toasty'

export const PedidosDeVendaListItem = ({ pedido, ExpandedID, handleChangeExpandedAccordion, refresh }) => {
  const classes = useStyles()
  const [wait, setWait] = useState(false)

  const handleCancelRequest = async () => {
    let toastId = null

    toastId = Toast('Cancelando solicitação', 'wait')
    setWait(true)

    try {
      await api.put('/pedidos/venda/cancelar', {
        PedidoID: pedido.PedidoID
      })

      Toast("Solicitação cancelada!", "update", toastId, "success");
      await refresh()
      setWait(false)
    } catch (err) {
      Toast("Falha ao cancelar solicitação!", "update", toastId, "error");
      setWait(false)
    }
  }

  const handleDeprocessRequest = async () => {
    let toastId = null

    toastId = Toast('Desprocessando pedido', 'wait')
    setWait(true)

    try {
      await api.put('/pedidos/venda/desprocessar', {
        PedidoID: pedido.PedidoID
      })

      Toast("Pedido desprocessado!", "update", toastId, "success");
      await refresh()
      setWait(false)
    } catch (err) {
      Toast("Falha ao desprocessar pedido!", "update", toastId, "error");
      setWait(false)
    }
  }

  const handleReprocessRequest = async () => {
    let toastId = null

    toastId = Toast('Reprocessando pedido', 'wait')
    setWait(true)

    try {
      await api.put('/pedidos/venda/reprocessar', {
        PedidoID: pedido.PedidoID
      })

      Toast("Pedido reprocessado!", "update", toastId, "success");
      await refresh()
      setWait(false)
    } catch (err) {
      Toast("Falha ao reprocessar pedido!", "update", toastId, "error");
      setWait(false)
    }
  }

  const handleDiscardSale = async () => {
    let toastId = null

    toastId = Toast('Descartando venda', 'wait')
    setWait(true)

    try {
      await api.put('/pedidos/venda/descartar', {
        PedidoID: pedido.PedidoID
      })

      Toast("Venda descartada!", "update", toastId, "success");
      await refresh()
      setWait(false)
    } catch (err) {
      Toast("Falha ao descartar venda", "update", toastId, "error");
      setWait(false)
    }
  }

  return (
    <Accordion
      expanded={ExpandedID === pedido.PedidoID}
      style={{
        borderLeft: `4px solid ${returnBorderColor(pedido)}`
      }}
      onChange={() => handleChangeExpandedAccordion(ExpandedID === pedido.PedidoID ? null : pedido.PedidoID)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div className={classes.column}>
          <Typography className={classes.heading}>Pedido <strong>{pedido.PedidoID}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Tipo: <strong>{String(pedido.PvTipo).trim() === 'V' ? 'Venda' : String(pedido.PvTipo).trim() === 'R' ? 'Remessa' : String(pedido.PvTipo).trim() === 'B' ? 'Bonificação' : '???'}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Status: <strong>{returnStatusDescription(pedido)}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Filial: <strong>{pedido.Filial}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Franqueado: <strong>{pedido.GrupoVenda}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Solicitado: <strong>{moment(pedido.DataCriacao).format('L')}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Cliente: {pedido.Cliente}</Typography>
          <Typography className={classes.secondaryHeading}>CNPJ: <strong>{pedido.CNPJ}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Código <strong>{pedido.CodigoCliente}[{String(pedido.LojaCliente).trim()}]</strong></Typography>
        </div>
      </AccordionSummary>
      <Divider />
      <AccordionDetails className={classes.details}>
        <div className={clsx(classes.column_1, classes.helper)}>
          {pedido.Itens.map(item => (
            <div
              key={item.PedidoID}
              className={classes.prodLine}
            >
              <div>
                <Typography className={classes.heading}><strong>{String(item.Produto).split('(')[0]}</strong></Typography>
                <Typography variant='caption'>(Cód <strong>{item.CodigoProduto}</strong>)</Typography>
              </div>
              <div>
                <Typography className={classes.heading}>Qtd: <strong>{item.QtdeVendida}</strong></Typography>
                <Typography variant='caption'>(Desc. Un.<strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.VlrDesconto)}</strong>)</Typography>
              </div>
              <div>
                <Typography className={classes.heading}>Total: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.PrecoTotal)}</strong></Typography>
                <Typography variant='caption'>(Vlr. Un. <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.PrecoUnitarioLiquido)}</strong>)</Typography>
              </div>
            </div>
          ))}
        </div>
        <div className={clsx(classes.column_2, classes.helper)}>
          <ButtonGroup
            disableElevation
            color='primary'
            variant='contained'
            size="medium"
            style={{ width: '100%' }}
          >
            <Button
              style={{ width: '100%' }}
              disabled={!pedido.emitenteNoNasajon}
              startIcon={<RecordVoiceOverIcon />}
            >
              Emitente
            </Button>

            <Button
              style={{ width: '100%' }}
              disabled={!pedido.destinatarioNoNasajon}
              startIcon={<NaturePeopleIcon />}
            >
              Destinatário
            </Button>
          </ButtonGroup>
          <Button
            className={classes.button}
            disabled={wait}
            startIcon={<CloseIcon style={{ color: RED_SECONDARY }} />}
            variant='outlined'
            onClick={handleCancelRequest}
          >
            Cancelar solicitação
          </Button>
          <Button
            className={classes.button}
            disabled={true}
            startIcon={<DeleteIcon style={{ color: GREY_SECONDARY }} />}
            variant='outlined'
            onClick={handleDiscardSale}
          >
            Descartar venda
          </Button>
          <Button
            className={classes.button}
            disabled={wait}
            startIcon={<ReplayIcon style={{ color: BLUE_SECONDARY }} />}
            variant='outlined'
            onClick={handleDeprocessRequest}
          >
            Desprocessar pedido
          </Button>
          <Button
            className={classes.button}
            disabled={wait}
            startIcon={<SyncIcon style={{ color: PRIMARY_YELLOW }} />}
            variant='outlined'
            onClick={handleReprocessRequest}
          >
            Reemitir pedido
          </Button>
          <Button
            className={classes.button}
            disabled={true}
            startIcon={<PhotoFilterIcon style={{ color: ORANGE_PRIMARY }} />}
            variant='outlined'
          >
            Converter para devolução
          </Button>
          <Accordion style={{ width: '100%', marginTop: '1rem' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Log de emissão
            </AccordionSummary>
            <AccordionDetails
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <ul style={{ padding: '0 0 0 8px' }}>
                {
                  pedido.logDoPedidoNoNasajon.length > 0
                    ? pedido.logDoPedidoNoNasajon.map(log =>
                      <li style={{ listStyleType: 'disc' }}>
                        {log.mensagem}
                      </li>
                    )
                    : <p>Nenhum log disponível.</p>
                }
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>
      </AccordionDetails>
      <Divider />
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
  partes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  button: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: '8px'
  }
}))

const returnBorderColor = (pedido) => {
  if (pedido.emitenteNoNasajon === false || pedido.destinatarioNoNasajon === false) {
    return GREY_SECONDARY
  }

  if (pedido.pedidoNoNasajon === true) {
    switch (pedido.pedido[0].status) {
      case 0:
        return BLUE_SECONDARY
      case 1:
        return GREEN_PRIMARY
      case 2:
        return RED_PRIMARY
      case 3:
        return ORANGE_PRIMARY
      default:
        return '#FFF'
    }
  } else {
    return PRIMARY_YELLOW
  }
}

const returnStatusDescription = (pedido) => {
  if (pedido.emitenteNoNasajon === false || pedido.destinatarioNoNasajon === false) {
    return 'Entidade(s) desconhecidas'
  }

  if (pedido.pedidoNoNasajon === true) {
    switch (pedido.pedido[0].status) {
      case 0:
        return 'Não processado'
      case 1:
        return 'Emitido com sucesso'
      case 2:
        return 'Erro na emissão'
      case 3:
        return 'Reemissão'
      default:
        return '??'
    }
  } else {
    return 'Não integrado'
  }
}