import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { Panel } from '../../components/commom_in'
import Loading from '../../components/loading_screen'
import { ContractList } from './components/contractList'
import { ContractsListOptions } from './components/options'
import { DetailsModal } from './modals/detailsModal'

const Contratos = () => {
  const [contracts, setContracts] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [newContractModalOpen, setNewContractModalOpen] = useState(false);
  const [targetContract, setTargetContract] = useState(null);

  useEffect(() => {
    LoadData()
  }, [])

  const LoadData = async () => {
    try {
      const response = await api.get('/contratos')

      setContracts(response.data.contracts)
      setLoaded(true);
    } catch (err) {

    }
  }

  const handleOpenDetailsModal = (tg) => {
    setDetailsModalOpen(true)
    setTargetContract(tg)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setTargetContract(null)
  }

  const handleOpenNewContractModal = () => {
    setNewContractModalOpen(true)
  }

  const handleCloseNewContractModal = () => {
    setNewContractModalOpen(false)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel>
      <DetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        target={targetContract}
      />
      <ContractsListOptions
        onChangeFiltro={setFiltro}
        mostrarInativos={mostrarInativos}
        switchInativos={setMostrarInativos}
        onOpenNewContractModal={handleOpenNewContractModal}
      />
      <ContractList
        Contracts={returnContractsFilter(contracts, mostrarInativos, filtro)}
        onOpenModal={handleOpenDetailsModal}
      />
    </Panel>
  )
}

export default Contratos

const returnContractsFilter = (contracts, shouldShowInactive, filterString) => {
  return contracts
  // var re = new RegExp(filterString.trim().toLowerCase())

  // return clientes.filter(cliente => {
  //   if (shouldShowInactive) {
  //     return true
  //   } else if (!shouldShowInactive && cliente.ClienteStatus === 'A') {
  //     return true
  //   } else {
  //     return false
  //   }
  // }).filter(cliente => {
  //   if (filterString.trim() === '') {
  //     return true
  //   } else if (filterString.trim() !== '' && (
  //     cliente.Nome_Fantasia.trim().toLowerCase().match(re) || cliente.Razão_Social.trim().toLowerCase().match(re)
  //   )) {
  //     return true
  //   } else {
  //     return false
  //   }
  // })
}