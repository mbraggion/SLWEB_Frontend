import React, { useState } from "react";
import Draggable from "react-draggable";
import { api } from "../../../services/api";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography } from "@material-ui/core";
import { Settings } from "@material-ui/icons/";

import Button from "../../../components/materialComponents/Button";
import { RED_SECONDARY } from "../../../misc/colors";
import { roleLevel } from "../../../misc/commom_functions";
import { 
  REACT_APP_BACKOFFICE_ROLE_LEVEL, 
  // REACT_APP_EXPEDICAO_ROLE_LEVEL, 
  REACT_APP_FRANQUEADO_ROLE_LEVEL, 
  REACT_APP_SISTEMA_ROLE_LEVEL, 
  REACT_APP_TECNICA_ROLE_LEVEL 
} from "../../../misc/role_levels";

import { Comercial } from '../components/_comercial'
// import { Expedicao } from '../components/_expedicao'
import { Franqueado } from '../components/_franqueado'
import { Indisponivel } from '../components/_indisponivel'
import { Sistema } from '../components/_sistema'
import { Tecnica } from '../components/_tecnica'

function DraggableDialog({ Req, onRefresh }) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = async () => {
    // setStage(CheckStage(Req));
    setOpen(true);
    try {
      await api.put("/equip/requests/check", {
        ID: Req.OSCId,
      });
    } catch (err) {

    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        disabled={false}
        style={{
          color: `${RED_SECONDARY}`,
          border: `1px solid ${RED_SECONDARY}`,
        }}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        <Settings />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          GERENCIAMENTO DE SOLICITAÇÃO
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <strong>Status: </strong>
            {showStatus(CheckStage(Req))}
          </DialogContentText>
          {ShowControlls(
            CheckStage(Req),
            Req,
            handleClose,
            onRefresh
          )}
        </DialogContent>

        <DialogActions style={{ padding: '8px 24px' }}>
          <Button
            style={{
              color: `${RED_SECONDARY}`,
              border: `1px solid ${RED_SECONDARY}`,
            }}
            disabled={false}
            onClick={handleClose}
            color="primary"
          >
            Fechar
          </Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}

export default DraggableDialog;

const CheckStage = (requisicao) => {
  if (requisicao.OSCStatus === "Concluido") {
    //pedido concluido
    return 0;
  } else if (requisicao.OSCStatus === "Cancelado") {
    //pedido cancelado pelo usuário
    return 999;
  } else if (
    requisicao.Assinaturas.OSCComDtValidação === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando aprovação comercial
    return 1;
  } else if (
    requisicao.Assinaturas.OSCComDtValidação !== null &&
    requisicao.Assinaturas.OSCComAceite === false
  ) {
    //negado pelo comercial
    return -1;
  } else if (
    requisicao.Assinaturas.OSCTecDtValidação === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando aprovação técnica
    return 2;
  } else if (
    requisicao.Assinaturas.OSCTecDtValidação !== null &&
    requisicao.Assinaturas.OSCTecAceite === false
  ) {
    //negado pela técnica
    return -2;
  } else if (
    requisicao.Assinaturas.OSCTecDtTermino === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando finalização técnica
    return 3;
  } else if (
    requisicao.Assinaturas.OSCExpDtPrevisao === null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando previsão de entrega da expedição
    return 4;
  } else if (
    requisicao.Assinaturas.OSCExpDtPrevisao !== null &&
    requisicao.OSCStatus === "Ativo"
  ) {
    //aguardando entrega
    return 5;
  } else {
    return null;
  }
};

const ShowControlls = (
  stage,
  Req,
  handleClose,
  onRefresh
) => {
  if ((stage === 999 || stage === 0) && roleLevel() !== REACT_APP_SISTEMA_ROLE_LEVEL) {
    // Concluída ou Cancelada
    return <Indisponivel />
  } else {
    switch (roleLevel()) {
      case REACT_APP_SISTEMA_ROLE_LEVEL:
        //Superuser

        return <Sistema Req={Req} onClose={handleClose} onRefresh={onRefresh} />
      case REACT_APP_FRANQUEADO_ROLE_LEVEL:
        //Franqueado

        return <Franqueado Req={Req} onClose={handleClose} onRefresh={onRefresh} />
      case REACT_APP_BACKOFFICE_ROLE_LEVEL:
        //Comercial

        return <Comercial Req={Req} onClose={handleClose} onRefresh={onRefresh} stage={stage} />
      case REACT_APP_TECNICA_ROLE_LEVEL:
        //Técnica

        return <Tecnica Req={Req} onClose={handleClose} onRefresh={onRefresh} stage={stage} />
      // case REACT_APP_EXPEDICAO_ROLE_LEVEL:
      //   //Expedição

      //   return <Expedicao Req={Req} onClose={handleClose} onRefresh={onRefresh} stage={stage} />
      default:
        return (
          <Typography>
            Você não pode gerenciar essa solicitação no momento
          </Typography>
        );
    }
  }
};

const showStatus = (stage) => {
  switch (stage) {
    case 0:
      return "Solicitação concluída";
    case 1:
      return "Solicitação aguarda validação comercial";
    case -1:
      return "Solicitação rejeitada pelo departamento comercial";
    case 2:
      return "Solicitação aguarda validação técnica";
    case -2:
      return "Solicitação rejeitada pelo departamento técnico";
    case 3:
      return "Solicitação aguarda finalização da montagem";
    case 4:
      return "Solicitação em fase de preparação e transporte";
    case 5:
      return "Solicitação aguardando entrega";
    case 999:
      return "Solicitação cancelada pelo franqueado";
    default:
      return "Desconhecido";
  }
};

function PaperComponent(props) {
  return (
    <Draggable
      {...props}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}