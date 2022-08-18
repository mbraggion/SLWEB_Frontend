import React from 'react'
import NumberFormat from 'react-number-format'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { RED_PRIMARY } from '../../../misc/colors'

export const LinhaEditavel = ({ linha, pRef, onChangeValue, onUpdateLine, editavel = true }) => {
  const classes = useStyles({ editavel })

  return (
    <div className={classes.root}>
      <Typography
        className={classes.desc}
        variant="subtitle1"
      >
        {linha.DreDesc}
      </Typography>
      <div className={classes.valuesDiv}>
        <NumberFormat
          className={classes.values}
          value={linha.DreVlr}
          placeholder='R$'
          type='text'
          prefix='R$'
          allowNegative={false}
          allowLeadingZeros={false}
          allowedDecimalSeparators={true}
          decimalSeparator=','
          thousandSeparator='.'
          decimalScale={2}
          onBlur={() => onUpdateLine(linha.DreCod, linha.DreVlr, (linha.DreVlr / pRef))}
          onValueChange={editavel
            ? (e) => onChangeValue(linha.DreCod, e.value, (e.value / pRef))
            : () => { }
          }
          disabled={!editavel}
        />
        <Typography
          className={classes.percentages}
          variant="subtitle1"
        >
          <strong style={{ color: RED_PRIMARY }}>
            {calculatePercentage(linha.DreVlr, pRef)}
          </strong>
        </Typography>
      </div>
    </div>
  )
}

const calculatePercentage = (amount, refAmount) => {
  let s = Number((amount / refAmount) * 100)

  return String(
    Number.isNaN(s)
      ? Number(0).toFixed(2)
      : s.toFixed(2)
  ) + '%'
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
    padding: '14px 16px !important',
  },
  valuesDiv: (props) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    height: '25px',
    // background: props.editavel === false ? '#CCC' : 'transparent'
  }),
  desc: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  values: (props) => ({
    padding: '0px 0px 0px 8px !important',
    width: '80px !important',
    border: 'none !important',
    background: props.editavel === true ? '#CCC !important' : 'transparent',
    height: '100% !important',
  }),
  percentages: {
    padding: '0px 0px 0px 4px',
    width: '70px'
  }
}))