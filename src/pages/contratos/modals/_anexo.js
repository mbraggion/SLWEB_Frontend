import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { Button, Checkbox, Divider, FormControl, FormControlLabel, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import { Toast } from '../../../components/toasty'
import { api } from '../../../services/api'
import { FaixaDeConsumoLinha } from '../components/faixaDeConsumoLinha'

export const Anexo = forwardRef(({ contract, allowEdit }, ref) => {
  const classes = useStyles()

  const [loaded, setLoaded] = useState(false)
  const [infoAnexo, setInfoAnexo] = useState(null)
  const [infoFaixa, setFaixa] = useState([])

  const LoadData = async () => {
    try {
      const response = await api.get(`/contracts/info/anexo/${String(contract.CNPJ).trim()}/${contract.ConId}`)

      setInfoAnexo(response.data.ContractAnx)
      setFaixa(response.data.ContractFxCon)
      setLoaded(true)
    } catch (err) {
    }
  }

  useEffect(() => {
    LoadData()
    // eslint-disable-next-line
  }, [])

  useImperativeHandle(ref, () => ({
    async handleSubmit() {
      try {
        await api.put(`/contracts/info/anexo/${String(contract.CNPJ).trim()}/${contract.ConId}`, {
          payload: {
            ...infoAnexo,
            Faixa: [...infoFaixa]
          }
        })

        return true
      } catch (err) {
        return false
      }
    },

    async undoChanges() {
      setLoaded(false)
      setInfoAnexo(null)
      setFaixa([])
      await LoadData()
    }
  }))

  const handleUpdateValues = (campo, valor, id) => {
    if (campo === 'inicio') {
      setFaixa(oldState => {
        let aux = [...oldState]

        aux.forEach((f, i) => {
          if (f.AFCId === id) {
            aux[i].AFCIni = valor
          }
        })

        return aux
      })
    } else if (campo === 'fim') {
      setFaixa(oldState => {
        let aux = [...oldState]

        aux.forEach((f, i) => {
          if (f.AFCId === id) {
            aux[i].AFCFin = valor
          }
        })

        return aux
      })
    } else if (campo === 'porcentagem') {
      if (Number(valor) > 100 || Number(valor) < 0) {
        Toast('Valor de porcentagem inválido', 'warn')

        setFaixa(oldState => {
          let aux = [...oldState]

          aux.forEach((f, i) => {
            if (f.AFCId === id) {
              aux[i].AFCPorc = 0
            }
          })

          return aux
        })
      } else {
        setFaixa(oldState => {
          let aux = [...oldState]

          aux.forEach((f, i) => {
            if (f.AFCId === id) {
              aux[i].AFCPorc = valor / 100
            }
          })

          return aux
        })
      }
    } else {
      return
    }
  }

  const handleAddFaixaDeConsumo = () => {
    if (infoFaixa.length === 0) {
      // se nao tiver faixa nenhuma add uma e fds
      setFaixa([{
        AnxId: infoAnexo.AnxId,
        AFCId: 1,
        AFCTipo: "D",
        AFCIni: 0,
        AFCFin: 9999,
        AFCPorc: 0
      }])
    } else {
      setFaixa(oldState => {
        let toprange = 0
        let nextId = 0

        oldState.forEach(f => {
          if (f.AFCFin > toprange) {
            toprange = f.AFCFin
          }

          if (f.AFCId > nextId) {
            nextId = f.AFCId
          }
        })

        return [
          ...oldState,
          {
            AnxId: infoAnexo.AnxId,
            AFCId: nextId + 1,
            AFCTipo: "D",
            AFCIni: toprange + 1,
            AFCFin: toprange + 2,
            AFCPorc: 0
          }
        ]
      })
    }
    // se ja tiver faixa continuar da "última"
  }


  return !loaded
    ? (
      <Typography>Aguarde...</Typography>
    )
    : (
      <div className={classes.container}>

        <div className={classes.linha}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Modelo de negócio</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={infoAnexo.CalcFatId}
              onChange={(e) => setInfoAnexo(oldState => ({
                ...oldState,
                CalcFatId: e.target.value
              }))}
              label="Modelo de negócio"
              disabled={allowEdit}
            >
              <MenuItem value={null} disabled> Selecione... </MenuItem>

              <MenuItem value={1}>Aluguel</MenuItem>
              <MenuItem value={2}>Comodato</MenuItem>
              <MenuItem value={3}>Comodato com mínimo por máquina</MenuItem>
              <MenuItem value={4}>Comodato com mínimo global</MenuItem>
              <MenuItem value={5}>Comodato com preço compartilhado</MenuItem>
              <MenuItem value={6}>Comodato por faixa de consumo</MenuItem>
              <MenuItem value={255}>Venda de Insumo</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={classes.linha} style={{ margin: '8px 0px' }}>
          <TextField
            value={infoAnexo.AnxDiaFecha}
            onChange={(e) => setInfoAnexo({ ...infoAnexo, AnxDiaFecha: e.currentTarget.value })}
            disabled={allowEdit}
            label='Dia de fechamento'
          />
          <FormControlLabel
            control={
              <Checkbox
                className={classes.checkbox}
                checked={infoAnexo.AnxProRata === 'S'}
                onChange={(e) => setInfoAnexo(oldState => ({
                  ...oldState,
                  AnxProRata: e.target.checked ? 'S' : 'N'
                }))}
                style={{ marginLeft: '8px' }}
              />
            }
            disabled={allowEdit}
            label="Pro-Rata"
          />
        </div>

        <div className={classes.linha}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Possui faturamento mínimo?</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={infoAnexo.AnxFatMinimo}
              onChange={(e) => setInfoAnexo(oldState => ({
                ...oldState,
                AnxFatMinimo: e.target.value
              }))}
              label="Possui faturamento mínimo?"
              disabled={allowEdit}
            >
              <MenuItem value={null} disabled> Selecione... </MenuItem>

              <MenuItem value={'S'}>Sim</MenuItem>
              <MenuItem value={'N'}>Não</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={classes.linha}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Calcular mínimo por</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={infoAnexo.AnxCalcMinPor}
              onChange={(e) => setInfoAnexo(oldState => ({
                ...oldState,
                AnxCalcMinPor: e.target.value
              }))}
              label="Calcular mínimo por"
              disabled={allowEdit || infoAnexo.AnxFatMinimo === 'N'}
            >
              <MenuItem value={null} disabled> Selecione... </MenuItem>

              <MenuItem value={'A'}>Anexo</MenuItem>
              <MenuItem value={'P'}>Ponto de Venda</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={classes.linha}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Considerar para mínimo</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={infoAnexo.AnxTipMin}
              onChange={(e) => setInfoAnexo(oldState => ({
                ...oldState,
                AnxTipMin: e.target.value
              }))}
              label="Considerar para mínimo"
              disabled={allowEdit || infoAnexo.AnxFatMinimo === 'N'}
            >
              <MenuItem value={null} disabled> Selecione... </MenuItem>

              <MenuItem value={'D'}>Doses</MenuItem>
              <MenuItem value={'R'}>Reais</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className={classes.linha}>
          <FormControlLabel
            control={
              <Checkbox
                className={classes.checkbox}
                checked={infoAnexo.AnxMinMoeda === 'S'}
                onChange={(e) => setInfoAnexo(oldState => ({
                  ...oldState,
                  AnxMinMoeda: e.target.checked ? 'S' : 'N'
                }))}
                style={{ marginLeft: '8px' }}
              />
            }
            disabled={allowEdit || infoAnexo.AnxFatMinimo === 'N'}
            label="Considerar consumido para cálculo de mínimo"
          />
        </div>

        <div className={classes.linha}>
          <TextField
            value={infoAnexo.AnxObs}
            onChange={(e) => setInfoAnexo({ ...infoAnexo, AnxObs: e.currentTarget.value })}
            disabled={allowEdit}
            label='Observações'
            multiline
            maxRows={4}
            style={{ width: '100%' }}
          />
        </div>

        <Divider style={{ width: '100%', margin: '8px 0px' }} />
        <li
          style={{
            listStyleType: 'none',
            marginBottom: '8px'
          }}
        >
          <Typography
            color="primary"
            display="block"
            variant="body1"

          >
            Repasse
          </Typography>
        </li>

        {infoFaixa.length === 0
          ? <Typography>Sem repasse configurado</Typography>
          : <>
            <FaixaDeConsumoLinha faixa={null} onUpdate={() => { }} allowEdit={false} header={true} />
            {infoFaixa.map(fx => (
              <FaixaDeConsumoLinha faixa={fx} onUpdate={handleUpdateValues} allowEdit={allowEdit} header={false} />
            ))}
          </>
        }

        <Button
          variant='contained'
          onClick={handleAddFaixaDeConsumo}
          color='primary'
          className={classes.button}
          disabled={allowEdit}
        >
          <AddIcon />
          Adicionar repasse
        </Button>
      </div>
    )
})

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  linha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  checkbox: {
    transform: "scale(0.3)",
  },
  formControl: {
    width: '100%',
    margin: '8px 0px 0px 0px'
  },
  button: {
    width: '100%',
    marginTop: '8px'
  }
}))