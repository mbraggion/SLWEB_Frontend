import React from 'react';

import FindInPage from "@material-ui/icons/FindInPage";

import { Table } from "../../components/table";
import Button from "../../components/materialComponents/Button";
import { convertData } from "../../misc/commom_functions";
import { RED_SECONDARY } from "../../misc/colors";

import AdmDialog from "./modals/admDialog";
import HistDialog from "./modals/historyDialog";

const emAndamento = ({ OS, onRequestPDF, onRefresh }) => {
  return (
    <Table
      width={100}
      height={50}
      hoverable={true}
      responsive={false}
      centered
    >
      <thead>
        <tr>
          <th>Solicitação</th>
          <th>Filial</th>
          <th>Status</th>
          <th>Pendência</th>
          <th>Data de solicitação</th>
          <th>Data pretendida</th>
          <th>Previsão Tec.</th>
          <th>Previsão Exp.</th>
          <th>Gerenciar</th>
          <th>Histórico</th>
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        {OS.map(
          (OS) => (
            <tr>
              <td align="center">{OS.OSCId}</td>
              <td align="center">{OS.M0_CODFIL}</td>
              <td align="center">{OS.OSCStatus}</td>
              <td align="center"><strong>{OS.Stage}</strong></td>
              <td align="center">{convertData(OS.Datas.OSCDtSolicita)}</td>
              <td align="center">{convertData(OS.Datas.OSCDtPretendida)}</td>
              <td align="center"> {OS.Assinaturas.OSCTecDtPrevisao !== "" ? convertData(OS.Assinaturas.OSCTecDtPrevisao) : "NA"} </td>
              <td align="center"> {OS.Assinaturas.OSCExpDtPrevisao !== "" ? convertData(OS.Assinaturas.OSCExpDtPrevisao) : "NA"} </td>
              <td align="center"> <AdmDialog Req={OS} onRefresh={onRefresh} /> </td>
              <td> <HistDialog Req={OS} /> </td>
              <td> <Button style={{ color: "#FFFFFF", backgroundColor: RED_SECONDARY, }} onClick={() => onRequestPDF(OS.OSCId)} > <FindInPage /> </Button> </td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  )
}

export default emAndamento;
