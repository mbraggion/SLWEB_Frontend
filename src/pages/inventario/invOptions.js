import moment from 'moment'
import React from 'react'

import { FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import { RED_PRIMARY } from '../../misc/colors'

export const InventarioOptions = ({ selectedRef, availableRefs, onUpdateRef, isDepositSelected, Inventario }) => {
  const classes = useStyles()

  const handleOnChangeRef = (value) => {
    onUpdateRef(value)
  }

  return (
    <section className={classes.root}>
      <label></label>
      {whichStatus(Inventario ? Inventario.status : null)}
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="simple-select-outlined-label">Referencia</InputLabel>
        <Select
          labelId="simple-select-outlined-label"
          id="simple-select-outlined"
          value={selectedRef}
          onChange={(e) => handleOnChangeRef(e.target.value)}
          label="Referencia"
          disabled={!isDepositSelected}
        >
          <MenuItem value=''>
            <em>Nenhuma</em>
          </MenuItem>
          {availableRefs.map(ref => <MenuItem key={ref.RefUd} value={ref.RefUd}>{moment(ref.RefUd).format('MM/YYYY')}</MenuItem>)}
        </Select>
        {isDepositSelected
          ? null
          : <FormHelperText
            style={{
              color: RED_PRIMARY
            }}
          >
            Selecione um depósito
          </FormHelperText>
        }
      </FormControl>
    </section>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '63px',
    width: '100%',
    borderBottom: '1px solid #ccc',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  formControl: {
    margin: '10px 10px 10px 0px',
    minWidth: 120,
  }
}));

const whichStatus = (status) => {
  switch (status) {
    case null:
      return null
    case 'nao existe':
      return 'Inventário não existe'
    case 'fechado':
      return 'Inventário já fechado'
    case 'aberto':
      return 'Inventário disponível'
    default:
      return null
  }
}