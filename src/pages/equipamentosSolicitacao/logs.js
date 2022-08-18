import React from "react";
import { api } from "../../services/api";
import { saveAs } from "file-saver";

import FindInPage from "@material-ui/icons/FindInPage";

import Loading from "../../components/loading_screen";
import { Table } from "../../components/table";
import { Toast } from "../../components/toasty";
import { dateCheck, convertData } from "../../misc/commom_functions";
import Button from "../../components/materialComponents/Button";
import { RED_SECONDARY } from "../../misc/colors";

import AdmDialog from "../gerenciarSolicitacoes/modals/admDialog";
import HistoryDialog from "../gerenciarSolicitacoes/modals/historyDialog";
export default class Logs extends React.Component {
  state = {
    logs: [],
    loaded: false,
  };

  async componentDidMount() {
    try {
      const response = await api.get("/equip/requests/own");

      this.setState({ logs: response.data, loaded: true });
    } catch (err) { }
  }

  async handleRetrivePDF(OSID) {
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
      saveAs(blob, `OS${OSID}_${dateCheck()}.pdf`);
    } catch (err) {
      Toast('Falha ao recuperar PDF do servidor', 'update', toastId, 'error')
    }
  }

  showStatus(OS) {
    if (OS === null) return;

    if (OS.OSCComAceite === null && OS.OSCStatus === "Ativo") {
      return "Comercial";
    } else if (OS.OSCTecAceite === null && OS.OSCStatus === "Ativo") {
      return "Técnica";
    } else if (OS.OSCExpDtPrevisao === null && OS.OSCStatus === "Ativo") {
      return "Transporte";
    } else if (OS.OSCComAceite === false || OS.OSCTecAceite === false) {
      return "Supervisão";
    } else if (OS.OSCExpDtPrevisao !== null && OS.OSCStatus === "Ativo") {
      return "Entrega";
    } else if (OS.OSCStatus === "Cancelado") {
      return "Nenhuma";
    } else if (OS.OSCStatus === "Concluido") {
      return "Nenhuma";
    } else {
      return "Desconhecido";
    }
  }

  render() {
    return !this.state.loaded ? (
      <Loading />
    ) : this.state.logs.length > 0 ? ( //Se nao tiver nenhum log, nem mostra a estrutura da tabela
      <Table
        hoverable={true}
        responsive={true}
        centered
      >
        <thead>
          <tr>
            <th>Solicitação Nº</th>
            <th>Status</th>
            <th>Pendência</th>
            <th>Data de solicitação</th>
            <th>Data pretendida</th>
            <th>Data prevista</th>
            <th>Gerenciar</th>
            <th>Histórico</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {this.state.logs.map((log, i) => (
            <tr>
              <td align="center">{log.OSCId}</td>
              <td align="center">{log.OSCStatus}</td>
              <td align="center"><strong>{this.showStatus(log)}</strong></td>
              <td align="center">{convertData(log.OSCDtSolicita)}</td>
              <td align="center">{convertData(log.OSCDtPretendida)}</td>
              <td align="center">
                {log.OSCExpDtPrevisao !== ""
                  ? convertData(log.OSCExpDtPrevisao)
                  : ""}
              </td>
              <td align="center" style={{ padding: "0", textAlign: "center" }}>
                <AdmDialog Req={log} />
              </td>
              <td align="center" style={{ padding: "0", textAlign: "center" }}>
                <HistoryDialog Req={log} />
              </td>
              <td align="center" style={{ padding: "0", textAlign: "center" }}>
                <Button
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: RED_SECONDARY,
                  }}
                  onClick={() => this.handleRetrivePDF(log.OSCId)}
                >
                  <FindInPage />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <h5>Você ainda não fez nenhuma solicitação!</h5>
      </div>
    );
  }
}
