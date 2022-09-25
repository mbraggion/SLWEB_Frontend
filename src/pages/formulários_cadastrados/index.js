import React, { useEffect, useState } from "react";
import { api } from "../../services/api";


import { Panel } from "../../components/commom_in";
import Loading from "../../components/loading_screen";
import { Toast } from '../../components/toasty';
import { Line } from './line';
import { DetailsModal } from './modal/details';
import { FormsListOptions } from './options';

const FormsAcompanhamento = () => {
  const [formularios, setFormularios] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [targetDetails, setTargetDetails] = useState(null)
  const [filtro, setFiltro] = useState('');
  const [mostrarIncompletos, setMostrarIncompletos] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get("/form/all");

        setLoaded(true)
        setFormularios(response.data.Form);
      } catch (err) {

      }
    }
    loadData()
  }, [])

  const handleOpenDetailsModal = (details) => {
    if(details.FormOpen === true){
      Toast('Esse formulário ainda não foi concluído')
    }
    
    setDetailsModalOpen(true)
    setTargetDetails(details)
  }
  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setTargetDetails(null)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel style={{ justifyContent: "flex-start", alignItems: "center" }}>
      <FormsListOptions 
      onChangeFiltro={setFiltro} 
      mostrarIncompletos={mostrarIncompletos} 
      switchIncompletos={setMostrarIncompletos} 
      />
      <DetailsModal
        Form={targetDetails}
        isModalOpen={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        modalTitle={`Formulário ${targetDetails ? targetDetails.Cod : ''}`}
      />
      {returnFormsFiltered(formularios, mostrarIncompletos, filtro).map(f => (
        <Line key={f.Cod} Form={f} onOpenModal={handleOpenDetailsModal} />
      ))}
    </Panel>
  );
}

export default FormsAcompanhamento;

const returnFormsFiltered = (forms, shouldShowIncomplete, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return forms.filter(form => {
    if (shouldShowIncomplete) {
      return true
    } else if (!shouldShowIncomplete && form.FormOpen === false) {
      return true
    } else {
      return false
    }
  }).filter(form => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      String(form.Email).trim().toLowerCase().match(re) || 
      String(form.Cod).trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}