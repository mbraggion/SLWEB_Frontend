import moment from 'moment'
import React from 'react'

import {
  FormControl, IconButton, InputLabel,
  makeStyles,
  MenuItem,
  Select, Tooltip
} from '@material-ui/core'
import { Add as AddIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, LayersClear as LayersClearIcon, Lock as LockIcon, LockOpen as LockOpenIcon } from '@material-ui/icons'
import { Toast } from '../../../components/toasty'
import { GREEN_PRIMARY } from '../../../misc/colors'
import { api } from '../../../services/api'

export const InventarioOptions = ({ updateInventory, selectedRef, availableRefs, onUpdateRef, isDepositSelected, selectedDepId, Inventario }) => {
  const classes = useStyles()

  const handleOnChangeRef = (value) => {
    onUpdateRef(value)
  }

  const handleCreateNewInv = async () => {
    let toastId = null
    
    toastId = Toast('Aguarde...', 'wait')

    try{
      await api.post(`/inventario/${selectedDepId}/${encodeURI(selectedRef)}`)

      updateInventory()
      Toast('Inventário gerado!', 'update', toastId, 'success')
    }catch(err){
      Toast('Falha ao gerar inventário', 'update', toastId, 'error')
    }
  }

  const handleCloseInv = async () => {
    let toastId = null
    
    toastId = Toast('Aguarde...', 'wait')

    try{
      await api.put(`/inventario/${selectedDepId}/${encodeURI(selectedRef)}`)

      updateInventory()
      Toast('Inventário fechado!', 'update', toastId, 'success')
    }catch(err){
      Toast('Falha ao fechar inventário', 'update', toastId, 'error')
    }
  }

  return (
    <section className={classes.root}>
      <div className={classes.infoContainer}>
        <div>{whichStatus(Inventario ? Inventario.status : null)}</div>
        <div>{whichActions(Inventario ? Inventario.status : null, handleCreateNewInv, handleCloseInv)}</div>
      </div>

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
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '63px',
    width: '100%',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const whichStatus = (status) => {
  switch (status) {
    case 'ausente':
      return (

        <Tooltip
          title={
            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}>
              Inventário não lançado
            </div>
          }
          placement="top"
          arrow={true}
        >
          <IconButton
            onClick={() => { }}
            disabled={false}
          >
            <LayersClearIcon />
          </IconButton>
        </Tooltip>
      )
    case 'fechado':
      return (
        <Tooltip
          title={
            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}>
              Inventário fechado
            </div>
          }
          placement="top"
          arrow={true}
        >
          <IconButton
            onClick={() => { }}
            disabled={false}
          >
            <LockIcon />
          </IconButton>
        </Tooltip>
      )
    case 'aberto':
      return (

        <Tooltip
          title={
            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}>
              Inventário aberto
            </div>
          }
          placement="top"
          arrow={true}
        >
          <IconButton
            onClick={() => { }}
            disabled={false}
          >
            <LockOpenIcon />
          </IconButton>
        </Tooltip>
      )
    default:
      return null
  }
}

const whichActions = (status, onCreateNewInventory, onCloseOpenInventory) => {
  switch (status) {
    case 'ausente':
      return (
        <Tooltip
          title={
            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}>
              Lançar inventário do mes selecionado
            </div>
          }
          placement="top"
          arrow={true}
        >
          <IconButton
            onClick={onCreateNewInventory}
            disabled={false}
            style={{
              color: GREEN_PRIMARY,
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      )
    case 'fechado':
      return null
    case 'aberto':
      return (
        <Tooltip
          title={
            <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}>
              Fechar inventário do mes
            </div>
          }
          placement="top"
          arrow={true}
        >
          <IconButton
            onClick={onCloseOpenInventory}
            disabled={false}
            color='primary'
          >
            <AssignmentTurnedInIcon />
          </IconButton>
        </Tooltip>
      )
    default:
      return null
  }
}