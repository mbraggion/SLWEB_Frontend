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

import EmAndamento from './EmAndamento'
import Concluidos from './Concluidos'
import Cancelados from './Cancelados'

const Management = () => {
  const [OSS, setOSS] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  // const [switch, setSwitch] = useState(false);

  const classes = useStyles();

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
      }}>
      <div className={classes.root}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          disabled={OSS.filter(OS => OS.OSCStatus === "Ativo").length === 0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              variant="h6"
              style={{
                color: '#4f9eff'
              }}
            >
              Solicitações em andamento({OSS.filter(OS => OS.OSCStatus === "Ativo").length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <EmAndamento
              OS={OSS.filter(OS => OS.OSCStatus === "Ativo")}
              onRequestPDF={(ID) => handleRetrivePDF(ID)}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
          disabled={OSS.filter(OS => OS.OSCStatus === "Cancelado").length === 0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography
              variant="h6"
              style={{
                color: '#f5814c'
              }}
            >
              Solicitações canceladas({OSS.filter(OS => OS.OSCStatus === "Cancelado").length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Cancelados
              OS={OSS.filter(OS => OS.OSCStatus === "Cancelado")}
              onRequestPDF={(ID) => handleRetrivePDF(ID)}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
          disabled={OSS.filter(OS => OS.OSCStatus === "Concluido").length === 0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography
              variant="h6"
              style={{
                color: '#29ff8d'
              }}
            >
              Solicitações concluídas({OSS.filter(OS => OS.OSCStatus === "Concluido").length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{ height: '100%' }}
          >
            <Concluidos
              OS={OSS.filter(OS => OS.OSCStatus === "Concluido")}
              onRequestPDF={(ID) => handleRetrivePDF(ID)}
            />
          </AccordionDetails>
        </Accordion>
      </div>
    </Panel>
  );
}

export default Management

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));