import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'

import { Panel } from '../../components/commom_in';
import Loading from '../../components/loading_screen'

import { ClientList } from './clientList'
import { DetailsModal } from './modals/detailsModal'
import { NewClientModal } from './modals/newCliente'
import { ClienteListOptions } from './options'

function Clientes() {
  const [loaded, setLoaded] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [clientes, setClientes] = useState([])
  const [targetCliente, setTargetCliente] = useState({});

  //componentDidMount
  useEffect(() => {
    async function LoadData() {
      try {
        //requisição inicial para obter dados essenciais da pagina
        const response = await api.get("/client");

        setClientes(response.data);
        setLoaded(true);
      } catch (err) {
      }
    }

    LoadData();
  }, []);

  const handleOpenDetailsModal = (index) => {
    setTargetCliente(returnClientesFilter(clientes, mostrarInativos, filtro)[index])
    setDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setTargetCliente({})
  }

  const handleOpenNewClientModal = () => {
    setNewClientModalOpen(true)
  }

  const handleCloseNewClientModal = () => {
    setNewClientModalOpen(false)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel>
      <ClienteListOptions
        onChangeFiltro={setFiltro}
        mostrarInativos={mostrarInativos}
        switchInativos={setMostrarInativos}
        onOpenNewClientesModal={handleOpenNewClientModal}
      />
      <ClientList
        Clientes={returnClientesFilter(clientes, mostrarInativos, filtro)}
        onOpenModal={handleOpenDetailsModal}
      />
      <DetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        title='Detalhes do Cliente'
        Details={targetCliente}
        DetailsChangeHandler={setTargetCliente}
        updateClientesArray={setClientes}
      />
      <NewClientModal
        open={newClientModalOpen}
        onClose={handleCloseNewClientModal}
        title='Cadastrar Cliente'
        onUpdateClientesArray={setClientes}
      />
    </Panel>
  )
}

export default Clientes;

const returnClientesFilter = (clientes, shouldShowInactive, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return clientes.filter(cliente => {
    if (shouldShowInactive) {
      return true
    } else if (!shouldShowInactive && cliente.ClienteStatus === 'A') {
      return true
    } else {
      return false
    }
  }).filter(cliente => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      cliente.Nome_Fantasia.trim().toLowerCase().match(re) || 
      cliente.Razão_Social.trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}