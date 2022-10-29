import moment from 'moment'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

import { Toast } from '../components/toasty'

const Consumo = createContext()

export const ConsumoProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false)

  const [equipList, setEquipList] = useState([])
  const [refList, setRefList] = useState([])
  const [leituras, setLeituras] = useState([])
  const [leituraDet, setLeituraDet] = useState(null)
  const [leituraConsumo, setLeituraConsumo] = useState(null)
  const [receita, setReceita] = useState(null)

  const [selectedEquip, setSelectedEquip] = useState(null)
  const [selectedRef, setSelectedRef] = useState(null)
  const [selectedRefInit, setSelectedRefInit] = useState(null)
  const [selectedRefEnc, setSelectedRefEnc] = useState(null)
  

  const [isLancamentoModalOpen, setIsLancamentoModalOpen] = useState(false)
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false)

  async function LoadData() {
    try {
      const r = await api.get("/referencia");
      const e = await api.get("/equip")

      setRefList(r.data.Referencias)
      setEquipList(e.data.Ativos)
      setLoaded(true);
    } catch (err) {
      setLoaded(false);
      setEquipList([])
      setRefList([])
    }
  }

  async function LoadLeituras() {
    let toastId = null
    toastId = Toast('Buscando leituras...', 'wait')

    try {
      const response = await api.get(`/consumo/leituras/${equipList.filter(eq => eq.EquiCod === selectedEquip)[0].AnxId}/${equipList.filter(eq => eq.EquiCod === selectedEquip)[0].EquiCod}/${encodeURI(selectedRef)}`);

      setLeituras(response.data.Leituras)
      Toast('Leituras carregadas!', 'update', toastId, 'success')
    } catch (err) {
      Toast('Falha ao buscar leituras', 'update', toastId, 'error')
      setSelectedEquip(null)
      setSelectedRef(null)
    }
  }

  async function LoadConsumo() {
    let toastId = null
    toastId = Toast('Calculando consumo...', 'wait')

    try {
      const response = await api.get(`/consumo/${equipList.filter(eq => eq.EquiCod === selectedEquip)[0].AnxId}/${equipList.filter(eq => eq.EquiCod === selectedEquip)[0].PdvId}/${selectedRefInit}/${selectedRefEnc}`);

      setLeituraDet(response.data.Produtos)
      setLeituraConsumo(response.data.Consumos)
      Toast('Consumo calculado!', 'update', toastId, 'success')
    } catch (err) {
      setSelectedRefInit(null)
      setSelectedRefEnc(null)
      Toast('Falha ao calcular consumo', 'update', toastId, 'error')
    }
  }

  async function LoadReceita(RecId) {
    let toastId = null
    toastId = Toast('Buscando detalhes da receita...', 'wait')

    try {
      const response = await api.get(`/receita/${RecId}`);

      setReceita(response.data.Receita)
      Toast('Detalhes da receita encontrados!', 'update', toastId, 'success')
    } catch (err) {
      setReceita(null)
      Toast('Falha ao buscar detalhes da receita', 'update', toastId, 'error')
    }
  }

  async function handleOpenReceitasModal(receitaId) {
    setIsReceitaModalOpen(true)

    await LoadReceita(receitaId)
  }

  function handleCloseReceitasModal() {
    setIsReceitaModalOpen(false)

    setReceita(null)
  }

  function handleOpenLancamentoModal() {
    setIsLancamentoModalOpen(true)
  }

  function handleCloseLancamentoModal() {
    setIsLancamentoModalOpen(false)
  }

  useEffect(() => {
    LoadData()
  }, [])

  useEffect(() => {
    setSelectedRefInit(null)
    setSelectedRefEnc(null)
    setSelectedRef(null)
    setLeituraDet(null)
    setLeituraConsumo(null)
  }, [selectedEquip])

  useEffect(() => {
    setSelectedRefInit(null)
    setSelectedRefEnc(null)
    setLeituraDet(null)
    setLeituraConsumo(null)

    if (selectedEquip !== null && selectedRef !== null) {
      LoadLeituras()
    }
  }, [selectedEquip, selectedRef])

  useEffect(() => {
    if (selectedRefInit !== null && selectedRefEnc !== null) {
      LoadConsumo()
    }
  }, [selectedRefInit, selectedRefEnc])

  return (
    <Consumo.Provider value={
      {
        uiControl: {
          loaded,
          podeLancarInventario: leituraConsumo !== null && leituraDet !== null,
          jaLancouInventario: true,
          isRecipeModalOpen: isReceitaModalOpen,
          isLaunchModalOpen: isLancamentoModalOpen,
        },
        data: {
          EquipList: equipList,
          RefList: refList,
          leituras1: selectedRefEnc !== null ? leituras.filter(leit => moment(leit.DataLeitura).isBefore(moment(leituras.filter(ll => ll.LeituraId === selectedRefEnc)[0].DataLeitura))) : leituras,
          leituras2: selectedRefInit !== null ? leituras.filter(leit => moment(leit.DataLeitura).isAfter(moment(leituras.filter(ll => ll.LeituraId === selectedRefInit)[0].DataLeitura))) : leituras,
          Receita: receita,
          Detalhes: leituraDet,
          Consumo: leituraConsumo,

          selectedEquip: selectedEquip,
          selectedRef: selectedRef,
          selectedL1: selectedRefInit,
          selectedL2: selectedRefEnc,
        },
        actions: {
          onChangeEquip: setSelectedEquip,
          onChangeRef: setSelectedRef,
          onChangeL1: setSelectedRefInit,
          onChangeL2: setSelectedRefEnc,

          onOpenLancamentoModal: handleOpenLancamentoModal,
          onCloseLancamentoModal: handleCloseLancamentoModal,
          onOpenReceitaModal: handleOpenReceitasModal,
          onCloseReceitaModal: handleCloseReceitasModal
        }
      }
    }>
      {children}
    </Consumo.Provider>
  )
}

export const useConsumo = () => {
  const context = useContext(Consumo)

  return context
}