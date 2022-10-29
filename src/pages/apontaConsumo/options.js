import moment from 'moment'
import React from 'react'

import { Button, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core'
import { Launch as LaunchIcon } from '@material-ui/icons'

import { useConsumo } from '../../hooks/useConsumo'

export const Options = () => {
  const classes = useStyles()

  const {
    uiControl: {
      podeLancarInventario
    },
    data: {
      EquipList,
      selectedEquip,
      RefList,
      selectedRef,
      leituras1,
      selectedL1,
      leituras2,
      selectedL2,
    },
    actions: {
      onChangeEquip,
      onChangeRef,
      onChangeL1,
      onChangeL2,
      onOpenLancamentoModal
    }
  } = useConsumo()

  return (
    <div className={classes.root}>
      <div>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="select-eq-label">Equipamento</InputLabel>
          <Select
            labelId="select-eq-label"
            id="select-eq"
            value={selectedEquip}
            onChange={e => onChangeEquip(e.target.value)}
            label="Equipamento"
          >
            <MenuItem value={null}>
              <em>Nenhum</em>
            </MenuItem>

            {EquipList.map(eq => <MenuItem value={eq.EquiCod}>{eq.EquiCod} - {eq.Nome_Fantasia}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="select-ref-label">Referencia</InputLabel>
          <Select
            labelId="select-ref-label"
            id="select-ref"
            value={selectedRef}
            onChange={e => onChangeRef(e.target.value)}
            label="Referencia"
          >
            <MenuItem value={null}>
              <em>Nenhuma</em>
            </MenuItem>

            {RefList.map(ref => <MenuItem value={ref.Refdt}>{moment(ref.Refdt).add(3, 'hours').format('MM/YYYY')}</MenuItem>)}
          </Select>
        </FormControl>

        {selectedRef !== null ? (
          <>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="select-l1-label">Leitura inicial</InputLabel>
              <Select
                labelId="select-l1-label"
                id="select-l1"
                value={selectedL1}
                onChange={e => onChangeL1(e.target.value)}
                label="Leitura inicial"
                disabled={selectedRef === null}
              >
                <MenuItem value={null}>
                  <em>Nenhuma</em>
                </MenuItem>

                {leituras1.map(ref => <MenuItem value={ref.LeituraId}>{moment(ref.DataLeitura).format('DD/MM/YYYY hh:mm:ss')}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="select-l2-label">Leitura final</InputLabel>
              <Select
                labelId="select-l2-label"
                id="select-l2"
                value={selectedL2}
                onChange={e => onChangeL2(e.target.value)}
                label="Leitura final"
                disabled={selectedRef === null}
              >
                <MenuItem value={null}>
                  <em>Nenhuma</em>
                </MenuItem>

                {leituras2.slice().reverse().map(ref => <MenuItem value={ref.LeituraId}>{moment(ref.DataLeitura).format('DD/MM/YYYY hh:mm:ss')}</MenuItem>)}
              </Select>
            </FormControl>
          </>
        )
          :
          null
        }
      </div>

      <Button
        className={classes.button}
        onClick={onOpenLancamentoModal}
        disabled={!podeLancarInventario}
        variant='contained'
        color='primary'
        startIcon={<LaunchIcon />}
      >
        Gravar movimentação
      </Button>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '80px',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)",
    padding: '0px 1%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '150px',
  },
  button: {
    padding: '16px'
  }
}));