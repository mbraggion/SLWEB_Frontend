import React from 'react'

import { makeStyles, TextField } from '@material-ui/core'

export const Contrato = ({ contract }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.linha}>
        <TextField value={contract.ConId} onChange={() => {}} disabled={true} />
        <TextField value={contract.Nome_Fantasia} onChange={() => {}} disabled={true} />
      </div>
      <div className={classes.linha}>
        <TextField value={contract.Nome_Fantasia} onChange={() => {}} disabled={true} />
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  linha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}))