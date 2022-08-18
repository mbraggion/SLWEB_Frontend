import React, { useState, useEffect } from "react";

//Meio de comunicação
import { api } from "../../services/api";
//"Placeholder" da página enquanto dados são carregados no
import Loading from "../../components/loading_screen";

//import de elementos visuais
import { Panel } from "../../components/commom_in";

import { LeadsList } from './LeadsList'
import { LeadsListOptions } from './options'
import { DetailsModal } from './modals/detalhesModal'
import { AddLead } from './modals/AddLead'

const GestaoDeLeads = () => {
  const [loaded, setLoaded] = useState(false);
  const [Leads, setLeads] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [detalhesModal, setDetalhesModal] = useState(false);
  const [newLeadsModal, setNewLeadsModal] = useState(false);
  const [targetId, setTargetId] = useState(null);

  //componentDidMount
  useEffect(() => {
    async function LoadData() {
      try {
        //requisição inicial para obter dados essenciais da pagina
        const response = await api.get("/leads/adm");

        setLoaded(true);
        setLeads(response.data.Leads)
      } catch (err) {
      }
    }

    LoadData();
  }, []);

  const handleOpenDetailsModal = (index) => {
    setDetalhesModal(true)
    setTargetId(returnLeadsFilter(Leads, mostrarInativos, filtro)[index].Id)
  }

  const handleCloseDetailsModal = (index) => {
    setDetalhesModal(false)
    setTargetId(null)
  }

  const handleOpenNewLeadModal = () => {
    setNewLeadsModal(true)
  }

  const handleCloseNewLeadModal = () => {
    setNewLeadsModal(false)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel style={{ justifyContent: 'flex-start' }}>
      <AddLead
        open={newLeadsModal}
        onClose={handleCloseNewLeadModal}
      />
      <DetailsModal
        open={detalhesModal}
        onClose={handleCloseDetailsModal}
        targetID={targetId}
      />
      <LeadsListOptions
        onChangeFiltro={setFiltro}
        mostrarInativos={mostrarInativos}
        switchInativos={setMostrarInativos}
        onOpenNewLeadsModal={handleOpenNewLeadModal}
        totalLeads={returnLeadsFilter(Leads, mostrarInativos, filtro).length}
      />
      <LeadsList
        Leads={returnLeadsFilter(Leads, mostrarInativos, filtro)}
        onOpenModal={handleOpenDetailsModal}
      />
    </Panel>
  );
}

export default GestaoDeLeads

const returnLeadsFilter = (leads, shouldShowInactive, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return leads.filter(lead => {
    if (shouldShowInactive) {
      return true
    } else if (!shouldShowInactive && lead.Disponivel === true) {
      return true
    } else {
      return false
    }
  }).filter(lead => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      String(lead.Nome_Fantasia).trim().toLowerCase().match(re) ||
      String(lead.Razao_Social).trim().toLowerCase().match(re) ||
      String(lead.Estado).trim().toLowerCase().match(re) ||
      String(lead.Municipio).trim().toLowerCase().match(re) ||
      String(lead.Filial).trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}