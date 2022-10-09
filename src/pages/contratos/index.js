import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { Panel } from '../../components/commom_in'
import Loading from '../../components/loading_screen'
import { ContractList } from './contractList'
import { DetailsModal } from './modals/detailsModal'
import { ContractsListOptions } from './options'

const Contratos = () => {
  const [contracts, setContracts] = useState([])
  const [loaded, setLoaded] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [targetContract, setTargetContract] = useState(null);

  const LoadData = async () => {
    try {
      const response = await api.get('/contracts')

      setContracts(response.data.contracts)
      setLoaded(true);
    } catch (err) {
      console.log(err)
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

  return !loaded ? (
    <Loading />
  ) : (
    <Panel>
      <DetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        target={targetContract}
        onUpdate={setTargetContract}
      />
      <ContractsListOptions
        onChangeFiltro={setFiltro}
        mostrarInativos={mostrarInativos}
        switchInativos={setMostrarInativos}
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