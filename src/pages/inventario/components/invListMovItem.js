import clsx from "clsx";
import moment from 'moment';
import React from 'react';

import { makeStyles } from '@material-ui/core';
import { AddShoppingCart as AddShoppingCartIcon, ShoppingCart as ShoppingCartIcon } from '@material-ui/icons';
import { BLUE_SECONDARY, GREEN_PRIMARY, RED_PRIMARY } from '../../../misc/colors';

export const InvListMovItem = ({ Mov }) => {
  const classes = useStyles()

  return (
    <tr>
      <td className={classes.line}>
        {moment(Mov.DtMov).format('L')}
      </td>
      <td className={clsx(classes.lineDoc, Mov.A1_NOME === 'INVENTÁRIO INICIAL' || Mov.A1_NOME === 'INVENTÁRIO FINAL' ? classes.blue : classes.black)}>
        {whichDoc(Mov.A1_NOME, Mov.E, Mov.S, Mov.DOC)}
      </td>
      <td className={clsx(classes.line, Mov.A1_NOME === 'INVENTÁRIO INICIAL' || Mov.A1_NOME === 'INVENTÁRIO FINAL' ? classes.blue : Mov.E !== 0 ? classes.green : Mov.S !== 0 ? classes.red : classes.black)}>
        {whichMovimento(Mov.A1_NOME, Mov.E, Mov.S)}
      </td>
      <td className={clsx(classes.lineDoc, classes.blue)}>
        {whichSaldo(Mov.A1_NOME, Mov.SldAnt, Mov.SldAtu)}
      </td>
      <td className={clsx(classes.lineDoc, classes.line)}>
        {Mov.A1_NOME}
      </td>
    </tr>
  )
}

const useStyles = makeStyles((theme) => ({
  line: {
    padding: '1rem 2rem',
    border: '0',
    background: '#fff',
    color: '#969CB3',
    borderRadius: '0.25rem'
  },
  lineDoc: {
    padding: '1rem 8px',
    border: '0',
    background: '#fff',
    color: '#969CB3',
    borderRadius: '0.25rem'
  },
  green: {
    color: GREEN_PRIMARY,
    fontWeight: 'bold'
  },
  red: {
    color: RED_PRIMARY,
    fontWeight: 'bold'
  },
  blue: {
    color: BLUE_SECONDARY,
    fontWeight: 'bold'
  },
  black: {
    color: '#000',
  }
}));

const whichDoc = (desc, e, s, doc) => {
  if (desc === 'INVENTÁRIO INICIAL' || desc === 'INVENTÁRIO FINAL') {
    return ''
  } else if (e !== 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <AddShoppingCartIcon fontSize="small" style={{ marginRight: '8px ' }} />
        {doc}
      </div>
    )
  } else if (s !== 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>
        <ShoppingCartIcon fontSize="small" style={{ marginRight: '8px ' }} />
        {doc}
      </div>
    )
  } else {
    return '???'
  }
}

const whichMovimento = (desc, e, s) => {
  if (desc === 'INVENTÁRIO INICIAL' || desc === 'INVENTÁRIO FINAL') {
    return ''
  } else if (e !== 0) {
    return <>+ {e}</>
  } else if (s !== 0) {
    return <>- {s}</>
  } else {
    return '???'
  }
}

const whichSaldo = (desc, ant, atu) => {
  if (desc === 'INVENTÁRIO INICIAL') {
    return ant
  } else if (desc === 'INVENTÁRIO FINAL') {
    return atu
  } else {
    return atu
  }
}