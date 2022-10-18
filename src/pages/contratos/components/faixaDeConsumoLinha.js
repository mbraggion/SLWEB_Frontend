import React from 'react'
import NumberFormat from 'react-number-format'

import { makeStyles, Typography } from '@material-ui/core'
import { GREY_LIGHT } from '../../../misc/colors'

export const FaixaDeConsumoLinha = ({ faixa, allowEdit, onUpdate, header }) => {
  const classes = useStyles()
  
  return header
    ? (
      <div className={classes.container}>
        <Typography
          className={classes.label}
          style={{
            fontWeight: 'bold'
          }}
        >
          Por
        </Typography>
        <NumberFormat
          className={classes.value}
          value=''
          placeholder='Início'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={false}
          decimalScale={0}
          onValueChange={() => { }}
          disabled={true}
          style={{
            fontWeight: 'bold',
            borderBottom: 'none'
          }}
        />
        <NumberFormat
          className={classes.value}
          value=''
          placeholder='Fim'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={false}
          decimalScale={0}
          onValueChange={() => { }}
          disabled={true}
          style={{
            fontWeight: 'bold',
            borderBottom: 'none'
          }}
        />
        <NumberFormat
          className={classes.percentage}
          value=''
          placeholder='Repasse'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={false}
          onValueChange={() => { }}
          disabled={true}
          style={{
            fontWeight: 'bold',
            borderBottom: 'none'
          }}
        />
      </div>
    )
    : (
      <div className={classes.container}>
        <Typography className={classes.label}>
          Dose
        </Typography>
        <NumberFormat
          className={classes.value}
          value={faixa.AFCIni}
          placeholder='qtd'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={true}
          decimalScale={0}
          onValueChange={(e) => onUpdate('inicio', e.value, faixa.AFCId)}
          disabled={allowEdit}
        />
        <NumberFormat
          className={classes.value}
          value={faixa.AFCFin}
          placeholder='qtd'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={true}
          decimalScale={0}
          onValueChange={(e) => onUpdate('fim', e.value, faixa.AFCId)}
          disabled={allowEdit}
        />
        <NumberFormat
          className={classes.percentage}
          value={faixa.AFCPorc * 100}
          placeholder='%'
          type='text'
          isNumericString
          allowNegative={false}
          allowLeadingZeros={false}
          decimalSeparator=','
          thousandSeparator='.'
          decimalScale={2}
          suffix='%'
          onValueChange={(e) => onUpdate('porcentagem', e.value, faixa.AFCId)}
          disabled={allowEdit}
        />
      </div>
    )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottom: `1px solid ${GREY_LIGHT}`,
    padding: '8px 0px 8px 0px'
  },
  label: {
    fontSize: '16px !important'
  },
  value: {
    width: '70px !important',
    height: '25px !important',
    textAlign: 'end',
    fontSize: '16px !important'
  },
  percentage: {
    width: '70px !important',
    height: '25px !important',
    textAlign: 'end',
    fontSize: '16px !important'
  }
}))