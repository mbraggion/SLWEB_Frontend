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
  const [jaLancou, setJaLancou] = useState(false)
  const [consumoJaLancado, setConsumoJaLancado] = useState([])
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

    let eq = equipList.filter(eq => eq.EquiCod === selectedEquip)[0]

    try {
      const response = await api.get(`/consumo/${eq.AnxId}/${eq.PdvId}/${eq.DepId}/${selectedRef}/${eq.EquiCod}/${selectedRefInit}/${selectedRefEnc}`);

      setLeituraDet(response.data.Produtos)
      setLeituraConsumo(response.data.Consumos)
      setJaLancou(response.data.consumoGravado)
      setConsumoJaLancado(response.data.consumoGravadoQtds)
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

  async function handleGravaConsumo(zerada) {
    let toastId = null
    toastId = Toast('Gravando consumo...', 'wait')

    let eq = equipList.filter(eq => eq.EquiCod === selectedEquip)[0]
      ? equipList.filter(eq => eq.EquiCod === selectedEquip)[0]
      : null

    if (eq === null) {
      throw new Error('impossivel determinar o equipamento alvo')
    }

    if (Number(eq.DepId) === 1) {
      Toast('Não é possível fazer o apontamento de consumo para o depósito central, atualize o depósito do cliente na tela Ponto de Venda', 'warn')
      return
    }

    try {
      const response = await api.post(`/consumo/gravar/${eq.DepId}/${selectedRef}`, {
        Consumo: leituraConsumo,
        Zerado: zerada,
        IMEI: eq.IMEI,
        EquiCod: eq.EquiCod,
        ref1: leituras.filter(l => l.LeituraId === selectedRefInit)[0].DataLeitura,
        ref2: leituras.filter(l => l.LeituraId === selectedRefEnc)[0].DataLeitura
      });

      setJaLancou(true)
      setConsumoJaLancado(response.data.consumoGravadoQtds)
      Toast('Consumo gravado com sucesso!', 'update', toastId, 'success')
    } catch (err) {
      setJaLancou(false)
      Toast('Falha ao gravar consumo', 'update', toastId, 'error')
    }
  }

  async function handleApagaConsumo() {
    let toastId = null
    toastId = Toast('Removendo consumo gravado...', 'wait')

    let eq = equipList.filter(eq => eq.EquiCod === selectedEquip)[0]
      ? equipList.filter(eq => eq.EquiCod === selectedEquip)[0]
      : null

    if (eq === null) {
      throw new Error('impossivel determinar o equipamento alvo')
    }

    try {
      await api.delete(`/consumo/apagar/${eq.DepId}/${selectedRef}/${eq.EquiCod}`)

      setJaLancou(false)
      Toast('Consumo gravado removido com sucesso!', 'update', toastId, 'success')
    } catch (err) {
      setJaLancou(true)
      Toast('Falha ao remover consumo gravado', 'update', toastId, 'error')
    }
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
    // eslint-disable-next-line
  }, [selectedRef])

  useEffect(() => {
    if (selectedRefInit !== null && selectedRefEnc !== null) {
      LoadConsumo()
    }
    // eslint-disable-next-line
  }, [selectedRefInit, selectedRefEnc])

  return (
    <Consumo.Provider value={
      {
        uiControl: {
          loaded,
          podeLancarInventario: leituraConsumo !== null && leituraDet !== null,
          jaLancouInventario: jaLancou,
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
          ConsumoJaLancado: consumoJaLancado,

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
          onCloseReceitaModal: handleCloseReceitasModal,

          onGravarConsumo: handleGravaConsumo,
          onRetrocederConsumo: handleApagaConsumo,
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