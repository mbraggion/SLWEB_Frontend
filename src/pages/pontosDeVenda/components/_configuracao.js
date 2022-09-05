import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { api } from '../../../services/api'
import { Toast } from '../../../components/toasty'

import { Button, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from '@material-ui/core'
import { PostAdd as PostAddIcon } from '@material-ui/icons'
import { ConfigListItem } from './configListItem'
import { ConfigListItemHeader } from './configListItemHeader'

export const Configuracao = forwardRef(({ PdvId, AnxId, allowEditing }, ref) => {
  const [configPDV, setConfigPDV] = useState([])
  const [configPadrao, setConfigPadrao] = useState([])
  const [configPadraoSelecionada, setConfigPadraoSelecionada] = useState(null)
  const [produtos, setProdutos] = useState([])
  const [tiposDeVenda, setTiposDeVenda] = useState([])
  const [receitas, setReceitas] = useState([])
  const [loaded, setLoaded] = useState(false)

  async function LoadData() {
    const response = await api.get(`/pontosdevenda/info/${PdvId}/${AnxId}/config`)

    setConfigPDV([...response.data.Dados.CfgPdv])
    setConfigPadrao(response.data.Dados.CfgPadrao)

    setProdutos(response.data.Dados.Produtos)
    setTiposDeVenda(response.data.Dados.TiposVenda)
    setReceitas(response.data.Dados.Receitas)
    setLoaded(true)
  }

  useEffect(() => {
    LoadData()
    // eslint-disable-next-line
  }, [])

  useImperativeHandle(ref, () => ({

    async handleSubmit() {
      if (validate(configPDV)) {
        try {
          await api.put(`/pontosdevenda/atualizar/${PdvId}/${AnxId}/config`, {
            UpdatedData: {
              CFG: configPDV
            }
          })

          return true
        } catch (err) {
          return false
        }
      } else {
        return false
      }
    },

    async undoChanges() {
      setLoaded(false)
      setConfigPadraoSelecionada(null)
      await LoadData()
    }

  }));

  const updateConfigPDV = (field, value, index) => {
    setConfigPDV(oldState => {
      let aux = [...oldState]

      aux[index][field] = value

      return aux
    })
  }

  const handleAddConfig = () => {
    setConfigPDV(oldState => {
      let aux = [...oldState]

      let arrayOrganizadoPorSel = configPDV.sort((a, b) => a.Sel - b.Sel)
      let nextSel = arrayOrganizadoPorSel.length === 0 ? 1 : arrayOrganizadoPorSel[arrayOrganizadoPorSel.length - 1].Sel + 1

      aux.push({
        Sel: nextSel,
        ProdId: null,
        TipoVenda: null,
        Valor_1: 0,
        Valor_2: 0,
        RecId: null
      })

      return aux
    })
  }

  const handleRemoveConfig = (index) => {
    setConfigPDV(oldState => {
      let aux = [...oldState]

      aux.splice(index, 1)

      return aux
    })
  }

  const handleLoadConfig = () => {
    const targetConfigToLoad = configPadrao.filter(cfg => cfg.CfgId === configPadraoSelecionada)[0]

    setConfigPDV(targetConfigToLoad.Produtos.map(hm => ({
      Sel: hm.Sel,
      ProdId: hm.ProdId,
      TipoVenda: hm.TipoVenda,
      Valor_1: 0,
      Valor_2: 0,
      RecId: hm.RecId
    })))
  }

  return !loaded ?
    (
      <Typography variant='subtitle1'> Carregando... </Typography>
    )
    :
    (
      <>
        <div
          className="XAlign"
          style={{
            padding: '0px 0px 8px 8px',
            justifyContent: 'flex-start'
          }}
        >
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Configurações salvas</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              style={{ width: '200px' }}
              value={configPadraoSelecionada}
              onChange={e => {
                setConfigPadraoSelecionada(e.target.value)
              }}
              disabled={allowEditing}
              label="Configurações salvas"
            >
              <MenuItem value={null}>
                <em>Selecione...</em>
              </MenuItem>
              {configPadrao.map(cfg => <MenuItem value={cfg.CfgId}>{cfg.CfgDesc}</MenuItem>)}
            </Select>
          </FormControl>
          <Tooltip
            title={
              <label
                style={{
                  fontSize: "14px",
                  color: "#FFF",
                  lineHeight: "20px"
                }}
              >
                Carregar configuração
              </label>
            }
            placement="top"
            arrow={true}
          >
            <IconButton
              disabled={configPadraoSelecionada === null || allowEditing}
              onClick={handleLoadConfig}
              color='primary'
            >
              <PostAddIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div
          style={{
            overflowY: 'auto',
            maxHeight: '380px',
            borderBottom: '8px'
          }}
        >
          {configPDV.length > 0
            ? <ConfigListItemHeader
              Editing={false}

              Sel={null}
              ProdCod={null}
              TVendaId={null}
              V1={null}
              V2={null}
              RecId={null}

              Produtos={produtos}
              TiposDeVenda={tiposDeVenda}
              Receitas={receitas}

              Linha={null}
              onUpdateConfig={() => { }}
              onRemoveConfig={() => { }}
            />
            : null
          }
          {configPDV.sort((a, b) => a.Sel - b.Sel).map((cfg, index) => (
            <ConfigListItem
              Editing={allowEditing}

              Sel={cfg.Sel}
              ProdCod={cfg.ProdId}
              TVendaId={cfg.TipoVenda}
              V1={cfg.Valor_1}
              V2={cfg.Valor_2}
              RecId={cfg.RecId}

              Produtos={produtos}
              TiposDeVenda={tiposDeVenda}
              Receitas={receitas}

              Linha={index}
              onUpdateConfig={updateConfigPDV}
              onRemoveConfig={handleRemoveConfig}
            />
          ))}
        </div>
        <Button
          onClick={handleAddConfig}
          disabled={allowEditing}
          variant='contained'
          color='primary'
          style={{
            width: '100%',
            borderRadius: '20px'
          }}>
          ADICIONAR BEBIDA
        </Button>
      </>
    )
})

const validate = (config) => {
  for (let i = 0; i < config.length; i++) {
    if (
      Number.isNaN(Number.parseInt(config[i].ProdId)) ||
      Number.isNaN(Number.parseInt(config[i].RecId)) ||
      Number.isNaN(Number.parseInt(config[i].Sel)) ||
      Number.isNaN(Number.parseInt(config[i].TipoVenda)) ||
      Number.isNaN(Number.parseFloat(config[i].Valor_1)) ||
      Number.isNaN(Number.parseFloat(config[i].Valor_2))
    ) {
      Toast(`A ${i + 1} linha da configuração não é válida`, 'warn')
      return false
    }
  }

  return true
}