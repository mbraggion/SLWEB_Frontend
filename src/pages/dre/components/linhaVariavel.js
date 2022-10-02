import React from 'react'
import NumberFormat from 'react-number-format'

import { makeStyles } from '@material-ui/styles'

export const LinhaVariavel = ({ linha, onChangeValue, onUpdateLine, editavel }) => {
  const classes = useStyles({ editavel })

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        type="text"
        value={linha.DOVDesc}
        onChange={(e) => onChangeValue(linha.DOVCod, linha.DOVVlr, e.target.value)}
        onBlur={() => onUpdateLine(linha.DOVCod, linha.DOVVlr, linha.DOVDesc)}
        disabled={!editavel}
      />

      <div className={classes.valuesDiv}>
        <NumberFormat
          value={linha.DOVVlr}
          className={classes.values}
          placeholder='R$'
          type='text'
          prefix='R$'
          allowNegative={false}
          allowLeadingZeros={false}
          decimalSeparator=','
          thousandSeparator='.'
          decimalScale={2}
          onBlur={() => onUpdateLine(linha.DOVCod, linha.DOVVlr, linha.DOVDesc)}
          onValueChange={(e) => onChangeValue(linha.DOVCod, e.value, linha.DOVDesc)}
          disabled={!editavel}
        />
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    width: '100%',
    height: '25px',
    padding: '0px 0px 8px 0px !important'
  },
  valuesDiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    height: '25px',
    margin: '0px 8px 0px 8px'
  },
  input: (props) => ({
    width: '100% !important',
    background: props.editavel === true ? '#CCC !important' : 'transparent',
    padding: '4px 0px 4px 8px !important',
    height: '100% !important',
    margin: '0px 8px 0px 8px !important',
    fontWeight: props.editavel === true ? 'normal !important' : 'bold !important'
  }),
  values: (props) => ({
    padding: '0px 0px 0px 8px !important',
    width: '90px !important',
    background: props.editavel === true ? '#CCC !important' : 'transparent',
    height: '100% !important',
    fontWeight: props.editavel === true ? 'normal !important' : 'bold !important',
    textAlign: 'end'
  })
}))