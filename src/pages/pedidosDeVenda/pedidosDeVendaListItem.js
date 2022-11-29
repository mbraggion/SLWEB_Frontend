import moment from 'moment'
import React from 'react'
import clsx from "clsx";

import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, makeStyles, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon, RecordVoiceOver as RecordVoiceOverIcon, NaturePeople as NaturePeopleIcon } from '@material-ui/icons'
import { BLUE_SECONDARY, PRIMARY_ORANGE, GREY_SECONDARY, RED_PRIMARY, PRIMARY_YELLOW, GREEN_PRIMARY } from '../../misc/colors'

export const PedidosDeVendaListItem = ({ pedido, ExpandedID, handleChangeExpandedAccordion }) => {
  const classes = useStyles()

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
          <Typography className={classes.secondaryHeading}>status: <strong>{returnStatusDescription(pedido)}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Filial: <strong>{pedido.Filial}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Solicitado: <strong>{moment(pedido.DataCriacao).format('L')}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Cliente: {pedido.Cliente}</Typography>
          <Typography className={classes.secondaryHeading}>CNPJ: <strong>{pedido.CNPJi}</strong></Typography>
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
          <div className={classes.partes}>
            <Button
              disabled={!pedido.emitenteNoNasajon}
              startIcon={<RecordVoiceOverIcon color='primary' />}
              variant='outlined'
            >
              Emitente
            </Button>

            <Button
              disabled={!pedido.destinatarioNoNasajon}
              startIcon={<NaturePeopleIcon color='primary' />}
              variant='outlined'
            >

              Destinatário
            </Button>
          </div>
          <Button
            className={classes.button}
            disabled={false}
            startIcon={<NaturePeopleIcon color='primary' />}
            variant='outlined'
          >
            Cancelar solicitação
          </Button>
          <Button
            className={classes.button}
            disabled={false}
            startIcon={<NaturePeopleIcon color='primary' />}
            variant='outlined'
          >
            Cancelar venda
          </Button>
          <Button
            className={classes.button}
            disabled={false}
            startIcon={<NaturePeopleIcon color='primary' />}
            variant='outlined'
          >
            Reprocessar pedido
          </Button>
          <Button
            className={classes.button}
            disabled={false}
            startIcon={<NaturePeopleIcon color='primary' />}
            variant='outlined'
          >
            Reemitir pedido
          </Button>
        </div>
      </AccordionDetails>
      <Divider />
      {/* <AccordionActions>
        <Button
          size="small"
          color='secondary'
          onClick={() => { }}
        >
          SECONDARY
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => { }}
        >
          PRIMARY
        </Button>
      </AccordionActions> */}
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
        return PRIMARY_ORANGE
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