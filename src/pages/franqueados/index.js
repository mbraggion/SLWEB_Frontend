import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

import { Panel } from '../../components/commom_in'
import Loading from '../../components/loading_screen'

import { Main } from './main'
import { Options } from './options'
import { NewFranquiaModal } from './modals/newFranquiaModal'
import { DetailsModal } from './modals/detailsModal'

const Franqueados = () => {
  const [loaded, setLoaded] = useState(false)
  const [newFranquiaModal, setNewFranquiaModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [franqueados, setFranqueados] = useState([])
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);

  useEffect(() => {
    LoadData()
  }, [])

  const LoadData = async () => {
    try {
      const response = await api.get('/administrar/franquia')

      setFranqueados(response.data)
      setLoaded(true)
    } catch (err) {
      setLoaded(false)

    }
  }

  const handleOpenNewFranquiaModal = () => {
    setNewFranquiaModal(true)
  }

  const handleCloseNewFranquiaModal = () => {
    setNewFranquiaModal(false)
  }

  const handleOpenDetailsModal = () => {
    setDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModal(false)
  }

  return !loaded ?
    <Loading />
    :
    (
      <Panel>
        <NewFranquiaModal
          open={newFranquiaModal}
          onClose={handleCloseNewFranquiaModal}
        />
        <DetailsModal
          open={detailsModal}
          onClose={handleCloseDetailsModal}
        />
        <Options
          onChangeFiltro={setFiltro}
          mostrarInativos={mostrarInativos}
          switchInativos={setMostrarInativos}
          onOpenNewFranquiaModal={handleOpenNewFranquiaModal}
        />
        <Main
          franquias={returnFranquiasFilter(franqueados, mostrarInativos, filtro)}
          onOpenDetailsModal={handleOpenDetailsModal}
        />
      </Panel>
    )
}

export default Franqueados

const returnFranquiasFilter = (franquias, shouldShowInactive, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return franquias.filter(fr => {
    if (shouldShowInactive) {
      return true
    } else if (!shouldShowInactive && fr.Inatv !== 'S') {
      return true
    } else {
      return false
    }
  }).filter(fr => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      String(fr.A1_GRPVEN).trim().toLowerCase().match(re) ||
      String(fr.A1_COD).trim().toLowerCase().match(re) ||
      String(fr.M0_CODFIL).trim().toLowerCase().match(re) ||
      String(fr.GrupoVenda).trim().toLowerCase().match(re) ||
      String(fr.M0_FILIAL).trim().toLowerCase().match(re) ||
      String(fr.NREDUZ).trim().toLowerCase().match(re) ||
      String(fr.UF).trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}