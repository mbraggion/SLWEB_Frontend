import React from 'react'

import { makeStyles } from '@material-ui/core'

export const InvListMovList = ({ children }) => {
  const classes = useStyles()

  return (
    <table className={classes.container}>
      <thead>
        <tr>
          <th className={classes.header}>Data</th>
          <th>Documento</th>
          <th>Movimento</th>
          <th>Saldo</th>
          <th>Descrição</th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    borderSpacing: '0 0.5rem'
  },
  header: {
    color: '#333',
    fontWeight: '400',
    padding: '1rem 2rem',
    textAlign: 'left',
    lineHeight: '1.5rem'
  }
}));