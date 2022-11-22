import moment from 'moment'
import React from 'react'

import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, makeStyles, Typography } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

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
          <Typography className={classes.heading}>Pedido de venda <strong>{pedido.PedidoID}</strong></Typography>
          <Typography className={classes.secondaryHeading}><strong>{moment(pedido.DataCriacao).format('L')}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>Valor do Pedido: <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.ValorTotal)}</strong></Typography>
          <Typography className={classes.secondaryHeading}>Items: <strong>{pedido.ItensNoPedido}</strong></Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.heading}>{pedido.Cliente}</Typography>
          <Typography className={classes.secondaryHeading}>Código <strong>{pedido.CodigoCliente}[{String(pedido.LojaCliente).trim()}]</strong></Typography>
        </div>
      </AccordionSummary>
      <Divider />
      <AccordionDetails className={classes.details}>
        {/* <div className={clsx(classes.column_1, classes.helper)}>
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
                  if (value !== null && !value.startOf('day').isBefore(moment().startOf('day').toDate()) && value.startOf('day').isValid()) {
                    setDtFaturamento(value.startOf('day')._d)
                  } else {
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
        </div> */}
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          size="small"
          color='secondary'
          onClick={() => {}}
        >
          SECONDARY
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={() => {}}
        >
          PRIMARY
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
}))

const returnBorderColor = (pedido) => {
  return '#4f9eff'
  // azul se nem tiver subido para o PG
  // amarelo se tiver status 0
  // vermelho se tiver status 2
  // verde se tiver status 1
}