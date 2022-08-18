import React from 'react';

import { Button } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

import { LinhaVariavel } from './linhaVariavel'

export const DespesasVariaveis = ({ DesV, onAddNewLine, AllowAddNewLine, onChangeValue, onUpdateLine }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {DesV.map(d =>
        <LinhaVariavel
          key={d.DOVCod}
          linha={d}
          onChangeValue={onChangeValue}
          onUpdateLine={onUpdateLine}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddNewLine}
        disabled={!AllowAddNewLine}
      >
        Nova Despesa Variável
      </Button>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    width: '100%',
    padding: '8px 0px 0px 0px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    margin: '8px'
  },
}))