import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

import { Fab, Paper, Typography, useMediaQuery } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add as AddIcon } from '@material-ui/icons'

import { Toast } from '../../components/toasty'

import { NovaColetaModal } from './modals/NovaColeta'
import { NovaColetaContent } from './novaColetaContent'

export const NovaColeta = (props) => {
  const classes = useStyles();
  const isMdUp = useMediaQuery('@media (min-width: 1080px)');
  const { handleCloseModal, handleOpenModal } = props;

  const [leiturasDisponiveis, setLeiturasDisponiveis] = useState([]);
  const [leituraDoses, setLeituraDoses] = useState([]);
  const [zerou, setZerou] = useState('N');
  const [referencia, setReferencia] = useState(moment().startOf('month').format());
  const [margemLeitura, setMargemLeitura] = useState(MARGEM_INITIAL_STATE);
  const [detalhes, setDetalhes] = useState(DETAILS_INITIAL_STATE)

  const handleRequestDetails = async (eqdata) => {
    if (typeof eqdata == 'undefined') {
      handleClearNovaLeituraStates()
      return;
    }

    try {
      setLeituraDoses([]);
      const response = await api.get(`/coletas/historico/${String(eqdata.EquiCod).trim()}/${eqdata.AnxId}`)

      setLeiturasDisponiveis(response.data.LeiturasDisponiveis)

      setMargemLeitura({
        de: response.data.UltColeta[0] ? response.data.UltColeta[0].UltimaColeta : null,
        deID: response.data.UltColeta[0] ? response.data.LeiturasDisponiveis.filter(leit => leit.LeituraId === response.data.UltColeta[0].LeituraId)[0].LeituraId : null,
        deCont: response.data.UltColeta[0] ? response.data.LeiturasDisponiveis.filter(leit => leit.LeituraId === response.data.UltColeta[0].LeituraId)[0].Contador : null,
        ate: null,
        ateID: null,
        ateCont: null,
        excluir: response.data.UltColeta[0] ? response.data.UltColeta[0].UltimaColeta : null
      })


      setDetalhes({
        EquiCod: eqdata.EquiCod,
        Cliente: String(eqdata.AnxDesc).trim(),
        CNPJ: eqdata.CNPJss,
        AnxId: eqdata.AnxId,
        PdvId: eqdata.PdvId,
        ConId: eqdata.ConId,
        UltimaColeta: response.data.UltColeta[0] ? response.data.UltColeta[0].UltimaColeta : null,
        ProximaColeta: response.data.UltColeta[0] ? response.data.UltColeta[0].ProximaColeta : null,
        ContadorAnterior: response.data.UltColeta[0] ? response.data.UltColeta[0].ContadorAnterior : null,
        ProximaColetaMes: response.data.UltColeta[0] ? response.data.UltColeta[0].ProximaColetaMes : null,
        Zerou: response.data.UltColeta[0] ? response.data.UltColeta[0].Zerou : null,
      })

    } catch (err) {
    }
  }

  const handleClearNovaLeituraStates = () => {
    setLeiturasDisponiveis([])
    setLeituraDoses([])
    setMargemLeitura(MARGEM_INITIAL_STATE)
    setDetalhes(DETAILS_INITIAL_STATE)
    setZerou('N')
    setReferencia(moment().startOf('month').format())
  }

  const handleGravaColeta = async () => {
    let toastId = null;
    toastId = Toast("Aguarde...", "wait");

    try {
      await api.post('/coletas/novacoleta/', {
        Detalhes: detalhes,
        Doses: leituraDoses,
        Margem: margemLeitura,
        Zerou: zerou,
        Ref: referencia
      })

      Toast("Coleta gravada com sucesso!", "update", toastId, "success");
      handleClearNovaLeituraStates()
      props.onUpdate()
    } catch (err) {
      Toast('Falha ao gravar coleta', "update", toastId, "error");
    }
  }

  const handleChangeReferencia = (date) => {
    setReferencia(date)
  }

  const handleChangeZerou = () => {
    if (margemLeitura.de === null || margemLeitura.de === margemLeitura.ate) {
      Toast('Não é possivel zerar a primeira consulta da máquina', 'info')
      return
    }
    setZerou(oldState => {
      return oldState === 'N' ? 'S' : 'N'
    })
  }

  useEffect(() => {
    handleCloseModal()
    // eslint-disable-next-line
  }, [isMdUp])

  useEffect(() => {
    async function getQtd() {
      if (margemLeitura.de !== null && margemLeitura.ate !== null) {
        const response = await api.get(`/coletas/novacoleta/${margemLeitura.deID}/${margemLeitura.ateID}/${detalhes.AnxId}/${detalhes.PdvId}`)

        setLeituraDoses(response.data.Coleta)
      }
    }
    getQtd()
    // eslint-disable-next-line
  }, [margemLeitura])

  return isMdUp ? (
    <Paper className={classes.root}>
      <div className={classes.container}>
        <Typography
          variant='h5'
          style={{ margin: '8px 0px 0px 8px' }}
        >
          Nova Coleta
        </Typography>
        <NovaColetaContent
          classes={classes}

          equipamentos={props.Equipamentos}
          detalhes={detalhes}
          leituras={leiturasDisponiveis}
          margem={margemLeitura}
          leituraDoses={leituraDoses}
          zerou={zerou}
          referencia={referencia}
          defaultSelected={props.selectedEquip}

          handleLookForPastData={handleRequestDetails}
          setMargem={setMargemLeitura}
          setLeituraDoses={setLeituraDoses}
          handleGravaColeta={handleGravaColeta}
          handleChangeZerou={handleChangeZerou}
          handleChangeReferencia={handleChangeReferencia}
        />
      </div>
    </Paper>
  ) : (
    <>
      <div
        style={{
          position: "absolute",
          right: "50px",
          bottom: "50px",
          alignItems: "unset",
        }}
      >
        <Fab
          color="primary"
          onClick={() => handleOpenModal()}
          variant="extended"
        >
          <AddIcon className={classes.extendedIcon} />
          Nova Coleta
        </Fab>
      </div>
      <NovaColetaModal
        open={props.open}
        onClose={props.handleCloseModal}
        title='Nova Coleta'
      >
        <NovaColetaContent
          classes={classes}

          equipamentos={props.Equipamentos}
          detalhes={detalhes}
          leituras={leiturasDisponiveis}
          margem={margemLeitura}
          leituraDoses={leituraDoses}
          zerou={zerou}
          referencia={referencia}
          defaultSelected={props.selectedEquip}

          handleLookForPastData={handleRequestDetails}
          setMargem={setMargemLeitura}
          setLeituraDoses={setLeituraDoses}
          handleGravaColeta={handleGravaColeta}
          handleChangeZerou={handleChangeZerou}
          handleChangeReferencia={handleChangeReferencia}
        />
      </NovaColetaModal>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minWidth: '430px',
    maxWidth: '500px',
    height: '100%',
    overflowY: 'auto',
    marginLeft: '8px',
  },
  container: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: '100%',
    width: '100%',
    minWidth: '430px',
    maxWidth: '500px',
  },
  infoBox: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #18a0fb',
    borderRadius: '5px',
    color: '#18a0fb',
    backgroundColor: '#fff',
    padding: '0px 20px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '8px 8px',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  sectionRow: {
    display: "flex",
    width: '100%',
    flexDirection: 'row',
    justifyContent: "space-around",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const MARGEM_INITIAL_STATE = {
  de: null,
  deID: null,
  deCont: null,
  ate: null,
  ateID: null,
  ateCont: null,
  excluir: null
}

const DETAILS_INITIAL_STATE = {
  EquiCod: '',
  Cliente: null,
  CNPJ: null,
  AnxId: null,
  PdvId: null,
  ConId: null,
  UltimaColeta: null,
  ProximaColeta: null,
  ContadorAnterior: null,
  ProximaColetaMes: null,
  Zerou: null,
}