import React from 'react';

import { makeStyles } from '@material-ui/styles'

import { LinhaFixa } from './linhaFixa'

export const Resumo = ({ Res }) => {
  const classes = useStyles()

  return (
    <div className={classes.root} >
      {Res.map(r => <LinhaFixa key={r.DreCod} linha={r}/>)}
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