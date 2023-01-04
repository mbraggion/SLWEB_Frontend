import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'

import { makeStyles } from '@material-ui/core'
import Loading from '../../components/loading_screen'

import { Consultas } from './components/consultas'
import { NovaColeta } from './components/novaColeta'

import { DetalhesModal } from './modals/DetalhesModal'

export const Leituras = ({ match }) => {
    const [loaded, setLoaded] = useState(false)
    const [coletas, setColetas] = useState([])
    const [equipamentos, setEquipamentos] = useState([])
    const [coletaDetalhesModalOpen, setColetaDetalhesModalOpen] = useState(false)
    const [coletaDetalhes, setColetaDetalhes] = useState({})
    const [novaColetaDetalhesModalOpen, setNovaColetaDetalhesModalOpen] = useState(false)

    const classes = useStyles();

    async function LoadData() {
        try {
            const response = await api.get('/coletas')

            setColetas(response.data.Coletas)
            setEquipamentos(response.data.Equipamentos)
            setLoaded(true)
        } catch (err) {
            setLoaded(false)
        }
    }

    useEffect(() => {
        LoadData()
    }, [])

    const handleOpenNovaColetaModal = () => {
        setNovaColetaDetalhesModalOpen(true)
    }

    const handleCloseNovaColetaModal = () => {
        setNovaColetaDetalhesModalOpen(false)
    }

    const handleOpenColetaDetailsModal = async (anxid, pdvid, fseq, coleta) => {
        setColetaDetalhesModalOpen(true)

        try {
            const response = await api.get(`/coletas/detalhes/${anxid}/${pdvid}/${fseq}`)

            setColetaDetalhes({ ...coleta, Detalhes: response.data.Detalhes })
        } catch (err) {
        }
    }

    const handleCloseColetaDetailsModal = () => {
        setColetaDetalhesModalOpen(false)
        setColetaDetalhes({})
    }

    return !loaded ? (
        <Loading />
    ) : (
        <div className={classes.root}>
            <DetalhesModal
                open={coletaDetalhesModalOpen}
                onClose={handleCloseColetaDetailsModal}
                title='Detalhes da Coleta'
                detalhes={coletaDetalhes}
                coletasHandler={setColetas}
            />
            <Consultas
                Coletas={coletas}
                onOpenColetaDetails={(a, p, f, c) => handleOpenColetaDetailsModal(a, p, f, c)}
                selectedEquip={match.params.ativo}
            />
            <NovaColeta
                Equipamentos={equipamentos}
                open={novaColetaDetalhesModalOpen}
                handleOpenModal={handleOpenNovaColetaModal}
                handleCloseModal={handleCloseNovaColetaModal}
                onUpdate={LoadData}
                selectedEquip={match.params.ativo}
            />
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      width: '100%',
    //   height: '100%'
      height: 'calc(100% - 72px)'
    },
  }));