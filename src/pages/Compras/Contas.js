import { saveAs } from "file-saver";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../services/api";

import { Button, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, withStyles } from "@material-ui/core/";
import { Receipt } from '@material-ui/icons';

import { ChangeTab, SetMin, SetPodeRetirar } from "../../global/actions/ComprasAction";

import Loading from "../../components/loading_screen";
import { Toast } from "../../components/toasty";

import { Table } from "../../components/table";
import ContaModal from './modals/ContasModal';
import PagamentoModal from './modals/PagamentoModal';

const Contas = (props) => {
  const TabIndex = 1;

  const [contaModalOpen, setContaModalOpen] = useState(false);
  const [pagamentoModalOpen, setPagamentoModalOpen] = useState(false);
  const [wait, setWait] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [ResumoCompras, setResumo] = useState([]);
  const [Duplicatas, setDuplicatas] = useState([]);
  const [aFaturar, setAFaturar] = useState(null);
  const [TotalDuplicatas, setTotalDuplicatas] = useState([]);
  const [TotalAno, setTotalAno] = useState([]);
  const [pedidoDet, setPedidoDet] = useState({});
  const [tipoDuplicata, setTipoDuplicata] = useState(null);
  const [confiavel, setConfiavel] = useState(false);
  const [naoCompensavel, setNaoCompensavel] = useState([]);

  const { ChangeTab, SetMin, SetPodeRetirar } = props;

  //component did mount
  useEffect(() => {
    async function loadProdutos() {
      try {
        ChangeTab(TabIndex);

        const response = await api.get("/compras/contas");

        setResumo(response.data.Geral);
        setDuplicatas(response.data.Duplicatas);
        setTotalDuplicatas(DefineTotalDuplicatas(response.data.Duplicatas));
        setTotalAno(response.data.ComprasAno);
        setAFaturar(response.data.AFaturar[0].Total);
        setConfiavel(response.data.Confiavel);
        setNaoCompensavel(response.data.NaoCompensavel);

        SetMin(response.data.VlrMinCompra);
        SetPodeRetirar(response.data.Retira);

        setLoaded(true);
      } catch (err) {

      }
    }
    loadProdutos();
  }, [ChangeTab, SetMin, SetPodeRetirar]);

  const handleOpenContaDialog = async (DOC) => {
    setContaModalOpen(true);
    setTipoDuplicata(DOC.E1Desc);

    try {
      const response = await api.get(`/compras/pedidos/detalhes/${DOC.E1_NUM}/DOC`);
      setPedidoDet({
        Parcela: DOC.E1_PARCELA,
        ...response.data
      });
    } catch (err) {
      setPedidoDet({});
    }
  };

  const handleCloseContaDialog = () => {
    setPedidoDet({});
    setContaModalOpen(false);
    setTipoDuplicata(null);
  };

  const handleOpenPagamentoDialog = async () => {
    setPagamentoModalOpen(true)
  }

  const handleClosePagamentoDialog = () => {
    setPagamentoModalOpen(false)
  };

  const handleRetriveBoleto = async (Pedido) => {
    setWait(true);
    let toastId = null;

    try {
      toastId = Toast("Buscando...", "wait");

      const response = await api.get(`/compras/retriveboleto/${Pedido.PedidoId}/${Pedido.Parcela.trim() === '' ? 'UNICA' : Pedido.Parcela.trim()}`, {
        responseType: "arraybuffer",
      });

      //quando não encontra o documento retorna um arraybuffer de 5 bytes(false)
      if (response.data.byteLength > 28) {
        Toast("Encontrado!", "update", toastId, "success");
        //Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
        const blob = new Blob([response.data], { type: "application/pdf" });

        //Salvo em PDF junto com a data atual, só pra não sobreescrever nada
        saveAs(blob, `BOLETO_NF_${Pedido.PedidoId}_${Pedido.Parcela.trim() === '' ? 'ÚNICA' : Pedido.Parcela.trim()}.pdf`);
        setWait(false);
      } else {
        Toast("Documento não encontrado", "update", toastId, "error");
        setWait(false);
      }
    } catch (err) {

      setWait(false);
    }
  };

  const handleRetriveNota = async (DOC) => {
    setWait(true);
    let toastId = null;

    try {
      toastId = Toast("Buscando...", "wait");

      const response = await api.get(`/compras/retrivenfe/${DOC}`, {
        responseType: "arraybuffer",
      });

      //quando não encontra o documento retorna um arraybuffer de 5 bytes(false)
      if (response.data.byteLength > 28) {
        Toast("Encontrado!", "update", toastId, "success");
        //Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
        const blob = new Blob([response.data], { type: "application/pdf" });

        //Salvo em PDF junto com a data atual, só pra não sobreescrever nada
        saveAs(blob, `NF_${DOC}.pdf`);
        setWait(false);
      } else {
        Toast("Documento não encontrado", "update", toastId, "error");
        setWait(false);
      }
    } catch (err) {

      setWait(false);
    }
  };

  return !loaded ? (
    <Loading />
  ) : (
    <div
      className="XAlign"
      style={{
        width: "100%",
        height: "100%",
        flexWrap: "wrap  ",
        alignItems: "flex-start",
      }}
    >
      <ContaModal
        open={contaModalOpen}
        onClose={handleCloseContaDialog}
        Detalhes={pedidoDet}
        Cooldown={wait}
        onRequestBoleto={
          (DOC) => handleRetriveBoleto(DOC)
        }
        onRequestNFe={
          (DOC) => handleRetriveNota(DOC)
        }
        type={tipoDuplicata}
      />
      <PagamentoModal
        open={pagamentoModalOpen}
        onClose={handleClosePagamentoDialog}
        duplicatas={Duplicatas}
        confiavel={confiavel}
        naoCompensavel={naoCompensavel}
      />
      <Typography variant="h5" gutterBottom>
        Resumo anual de {moment().year()}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Jan</StyledTableCell>
              <StyledTableCell>Fev</StyledTableCell>
              <StyledTableCell>Mar</StyledTableCell>
              <StyledTableCell>Abr</StyledTableCell>
              <StyledTableCell>Mai</StyledTableCell>
              <StyledTableCell>Jun</StyledTableCell>
              <StyledTableCell>Jul</StyledTableCell>
              <StyledTableCell>Ago</StyledTableCell>
              <StyledTableCell>Set</StyledTableCell>
              <StyledTableCell>Out</StyledTableCell>
              <StyledTableCell>Nov</StyledTableCell>
              <StyledTableCell>Dez</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TotalAno.map(ta => (
              <StyledTableRowWithoutHighlight>
                <StyledTableCell>
                  <strong>{ta.Tipo}</strong>
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["1"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["2"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["3"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["4"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["5"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["6"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["7"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["8"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["9"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["10"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["11"])}
                </StyledTableCell>
                <StyledTableCell>
                  {currencyFormat(ta["12"])}
                </StyledTableCell>
              </StyledTableRowWithoutHighlight>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <div style={{ marginTop: "16px" }}>
          <Typography variant="h5" gutterBottom>
            Títulos em aberto
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>NF</StyledTableCell>
                  <StyledTableCell>Parcela</StyledTableCell>
                  <StyledTableCell>Tipo</StyledTableCell>
                  <StyledTableCell>Descrição</StyledTableCell>
                  <StyledTableCell>Emissão</StyledTableCell>
                  <StyledTableCell>Vencimento</StyledTableCell>
                  <StyledTableCell>Valor</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Duplicatas.length > 0 ? (
                  Duplicatas.map((dup) => {
                    return (
                      <StyledTableRow
                        style={{
                          background: !moment()
                            .utc()
                            .isSameOrBefore(moment(dup.DtVenc).utc(), "day")
                            ? "#ff4747"
                            : null,
                        }}
                        key={dup.E1_NUM}
                        onClick={() => handleOpenContaDialog(dup)}
                      >
                        <StyledTableCell>{dup.E1_NUM}</StyledTableCell>
                        <StyledTableCell>
                          {String(dup.E1_PARCELA).trim() === ""
                            ? "ÚNICA"
                            : dup.E1_PARCELA}
                        </StyledTableCell>
                        <StyledTableCell>{dup.E1Desc}</StyledTableCell>
                        <StyledTableCell>{dup.E1_TIPO[0]}</StyledTableCell>
                        <StyledTableCell>
                          {moment(dup.DtEmissao).utc().format("L")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment(dup.DtVenc).utc().format("L")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencyFormat(dup.E1_SALDO)}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {Duplicatas.length ? (
            <Button
              variant="outlined"
              color="primary"
              style={{
                width: "100%",
                borderRadius: '0px 0px 5px 5px'
              }}
              startIcon={<Receipt />}
              onClick={handleOpenPagamentoDialog}
            >
              Informar pagamento
            </Button>
          ) : null}
        </div>
        <div style={{ marginTop: "16px" }}>
          <Typography variant="h5" gutterBottom>
            Balanço
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Bloqueado</StyledTableCell>
                  <StyledTableCell>Limite</StyledTableCell>
                  <StyledTableCell>Limite Extra</StyledTableCell>
                  <StyledTableCell>Compras</StyledTableCell>
                  <StyledTableCell>Saldo</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <StyledTableRowWithoutHighlight>
                  <StyledTableCell
                    style={{
                      background:
                        ResumoCompras.Bloqueado === "S" ? "#ff4747" : null,
                    }}
                  >
                    {ResumoCompras.Bloqueado === "S" ? "SIM" : "NÃO"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {currencyFormat(ResumoCompras.LimiteCredito)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {currencyFormat(ResumoCompras.LimExtraCredito)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {currencyFormat(ResumoCompras.Compras)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {currencyFormat(ResumoCompras.LimiteAtual)}
                  </StyledTableCell>
                </StyledTableRowWithoutHighlight>
              </TableBody>
            </Table>
          </TableContainer>

          {TotalDuplicatas.length > 0 || aFaturar ? (
            <>
              <Typography variant="h5" gutterBottom>
                Resumo dos títulos
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Tipo</StyledTableCell>
                      <StyledTableCell>Vencida</StyledTableCell>
                      <StyledTableCell>A Vencer</StyledTableCell>
                      <StyledTableCell>Total</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TotalDuplicatas.map((total) => (
                      <StyledTableRowWithoutHighlight>
                        <StyledTableCell>{total.Desc}</StyledTableCell>
                        <StyledTableCell
                          style={{ background: total.Vencido > 0 ? "#ff4747" : null, }}
                        >
                          {currencyFormat(total.Vencido)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencyFormat(total.Avencer)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencyFormat(
                            Number.parseFloat(total.Vencido) +
                            Number.parseFloat(total.Avencer)
                          )}
                        </StyledTableCell>
                      </StyledTableRowWithoutHighlight>
                    ))}
                    {aFaturar ? (
                      <StyledTableRowWithoutHighlight>
                        <StyledTableCell>A Faturar</StyledTableCell>
                        <StyledTableCell>0,00</StyledTableCell>
                        <StyledTableCell>
                          {currencyFormat(aFaturar)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {currencyFormat(aFaturar)}
                        </StyledTableCell>
                      </StyledTableRowWithoutHighlight>
                    ) : null}
                    <StyledTableRowWithoutHighlight style={{ background: '#CCC' }}>
                      <StyledTableCell>Total</StyledTableCell>
                      <StyledTableCell>
                        {currencyFormat(TotalDuplicatas.reduce((accumulator, dup) => {
                          return accumulator + dup.Vencido
                        }, 0))}
                      </StyledTableCell>
                      <StyledTableCell>
                        {currencyFormat(TotalDuplicatas.reduce((accumulator, dup) => {
                          return accumulator + dup.Avencer
                        }, 0) + aFaturar)}
                      </StyledTableCell>
                      <StyledTableCell>
                        {currencyFormat(
                          TotalDuplicatas.reduce((accumulator, dup) => {
                            return accumulator + dup.Vencido
                          }, 0) +
                          TotalDuplicatas.reduce((accumulator, dup) => {
                            return accumulator + dup.Avencer
                          }, 0) +
                          aFaturar
                        )}
                      </StyledTableCell>
                    </StyledTableRowWithoutHighlight>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (store) => ({
  State: store.CompraState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ChangeTab,
      SetMin,
      SetPodeRetirar,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Contas);

//estilo célula
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

//estilo linha
const StyledTableRowWithoutHighlight = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:hover": {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      backgroundColor: "#CCC",
    },
  },
}))(TableRow);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:hover": {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      backgroundColor: "#CCC",
      cursor: "pointer",
    },
  },
}))(TableRow);

const DefineTotalDuplicatas = (duplicatas = []) => {
  let duplicatasTotal = [];
  let achou = false;

  duplicatas.forEach((dup) => {
    if (duplicatasTotal.length === 0) {
      duplicatasTotal.push({
        Desc: dup.E1Desc,
        Avencer: dup.Status === "Avencer" ? Number(dup.E1_SALDO) : 0,
        Vencido: dup.Status === "Avencer" ? 0 : Number(dup.E1_SALDO),
        Total: Number(dup.E1_SALDO),
      });
      return;
    }

    for (let i = 0; i < duplicatasTotal.length; i++) {
      if (duplicatasTotal[i].Desc === dup.E1Desc) {
        duplicatasTotal[i] = {
          ...duplicatasTotal[i],
          Avencer:
            dup.Status === "Avencer"
              ? Number(duplicatasTotal[i].Avencer) + Number(dup.E1_SALDO)
              : Number(duplicatasTotal[i].Avencer),
          Vencido:
            dup.Status === "Avencer"
              ? Number(duplicatasTotal[i].Vencido)
              : Number(duplicatasTotal[i].Vencido) + Number(dup.E1_SALDO),
          Total: Number(duplicatasTotal[i].Total) + Number(dup.E1_SALDO),
        };
        achou = true;
        break;
      }
    }

    if (!achou) {
      duplicatasTotal.push({
        Desc: dup.E1Desc,
        Avencer: dup.Status === "Avencer" ? Number(dup.E1_SALDO) : 0,
        Vencido: dup.Status === "Avencer" ? 0 : Number(dup.E1_SALDO),
        Total: Number(dup.E1_SALDO),
      });
    }
    achou = false;
  });

  return duplicatasTotal;
};

const currencyFormat = (currency) => {
  if (
    currency !== null &&
    String(currency).trim() !== "" &&
    typeof currency != "undefined"
  ) {
    return String(Number.parseFloat(currency).toFixed(2)).replace(".", ",");
  } else {
    return "0,00";
  }
};
