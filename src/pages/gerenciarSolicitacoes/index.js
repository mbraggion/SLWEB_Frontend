import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { api } from "../../services/api";

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core';

import Loading from "../../components/loading_screen";
import { Toast } from "../../components/toasty";
import { Panel } from "../../components/commom_in";
import { dateCheck } from "../../misc/commom_functions";

import SolList from './SolList'

import { SolicitacoesOptions } from './options'

const Management = () => {
  const [OSS, setOSS] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [filtro, setFiltro] = useState('');
  const [mostrarPendencias, setMostrarPendencias] = useState(true);

  const classes = useStyles();
  const status = ['Ativo', 'Cancelado', 'Concluido']

  useEffect(() => {
    async function LoadData() {
      try {
        const response = await api.get("/equip/requests/all");

        setOSS(response.data);
        setLoaded(true);
      } catch (err) {
      }
    }
    LoadData();
  }, [])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleRetrivePDF = async (OSID) => {
    let toastId = null

    try {
      toastId = Toast('Buscando...', 'wait')

      const response = await api.get(`/equip/requests/retrive/${OSID}`, {
        responseType: "arraybuffer",
      });

      Toast('Encontrado!', 'update', toastId, 'success')
      //Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
      const blob = new Blob([response.data], { type: "application/pdf" });

      //Salvo em PDF junto com a data atual, só pra não sobreescrever nada
      saveAs(blob, `OS_${dateCheck()}.pdf`);
    } catch (err) {
      Toast('Falha ao recuperar PDF do servidor', 'update', toastId, 'error')
    }
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >

      <SolicitacoesOptions
        onChangeFiltro={setFiltro}
        mostrarPendencias={mostrarPendencias}
        switchPendencias={setMostrarPendencias}
      />

      <div className={classes.root}>
        {status.map(s => (
          <Accordion
            expanded={expanded === s}
            onChange={handleChange(s)}
            disabled={returnOSsFiltered(OSS.filter(OS => OS.OSCStatus === s), mostrarPendencias, filtro).length === 0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${s}-content`}
              id={`${s}-header`}
            >
              <Typography
                variant="h6"
                style={{
                  color: returnCorrectBorderColor(s)
                }}
              >
                {
                  s === 'Ativo' ?
                    'Solicitações em Andamento'
                    : s === 'Cancelado' ?
                      'Solicitações Canceladas'
                      : s === 'Concluido' ?
                        'Solicitações Concluídas'
                        : '???'
                }({OSS.filter(OS => OS.OSCStatus === s).length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SolList
                OS={returnOSsFiltered(OSS.filter(OS => OS.OSCStatus === s), mostrarPendencias, filtro)}
                onRequestPDF={handleRetrivePDF}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Panel>
  );
}

export default Management

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(100% - 100px)'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const returnOSsFiltered = (oss, shouldShowPending, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return oss.filter(os => {
    if (!shouldShowPending) {
      return true
    } else if (shouldShowPending && os.Responsavel.includes(window.sessionStorage.getItem('role'))) {
      return true
    } else {
      return false
    }
  }).filter(os => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      String(os.OSCId).trim().toLowerCase().match(re) ||
      String(os.M0_CODFIL).trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}

const returnCorrectBorderColor = (status) => {
  switch (status) {
    case 'Cancelado':
      return '#f5814c';

    case 'Ativo':
      return '#4f9eff';

    case 'Concluido':
      return '#29ff8d';
    default:
      return '#8403fc'
  }
}