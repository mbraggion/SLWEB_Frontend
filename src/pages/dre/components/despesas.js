import React from 'react';

import { makeStyles } from '@material-ui/styles'

import { LinhaEditavel } from './linhaEditavel'

export const Despesas = ({ Des, pRef, onChangeValue, onUpdateLine }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {Des.filter(d => d.DreCod !== 34 && d.DreCod !== 30 && d.DreCod !== 35).map(d =>
        <LinhaEditavel
          key={d.DreCod}
          linha={d}
          pRef={pRef}
          onChangeValue={onChangeValue}
          onUpdateLine={onUpdateLine}
        />
      )}
      {Des.filter(d => d.DreCod === 34 || d.DreCod === 30 || d.DreCod === 35).map(d =>
        <LinhaEditavel
          linha={d}
          pRef={pRef}
          onChangeValue={onChangeValue}
          onUpdateLine={onUpdateLine}
          editavel={false}
        />
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    width: '100%',
    padding: '8px 0px 8px 0px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    margin: '8px'
  },
}))