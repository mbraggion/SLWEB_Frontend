import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { Panel } from '../../components/commom_in'
import Loading from '../../components/loading_screen'
import { ContractList } from './contractList'
import { DetailsModal } from './modals/detailsModal'
import { NewContractModal } from './modals/newContractModal'
import { ContractsListOptions } from './options'

const Contratos = () => {
  const [contracts, setContracts] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [newContractModalOpen, setNewContractModalOpen] = useState(false);
  const [targetContract, setTargetContract] = useState(null);

  const LoadData = async () => {
    setLoaded(false);

    try {
      const response = await api.get('/contracts')

      setContracts(response.data.contracts)
      setLoaded(true);
    } catch (err) {
    }
  }

  useEffect(() => {
    LoadData();
  }, []);

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

  const updateContractStatus = (CNPJ, ConId, newStatus) => {
    setContracts(oldState => {
      let aux = [...oldState]

      aux.forEach((item, index) => {
        if (item.CNPJ === CNPJ && item.ConId === ConId) {
          aux[index].ConStatus = newStatus
        }
      })

      return aux
    })
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel>
      <NewContractModal
        open={newContractModalOpen}
        onClose={handleCloseNewContractModal}
        onRefresh={LoadData}
      />
      <DetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        target={targetContract}
        onUpdate={setTargetContract}
        onUpdateContractStatus={updateContractStatus}
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
  var re = new RegExp(filterString.trim().toLowerCase())

  return contracts.filter(contract => {
    if (shouldShowInactive) {
      return true
    } else if (!shouldShowInactive && contract.ConStatus === 'A') {
      return true
    } else {
      return false
    }
  }).filter(contract => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      contract.Nome_Fantasia.trim().toLowerCase().match(re) ||
      contract.CNPJ.trim().toLowerCase().match(re) ||
      contract.CNPJss.trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}