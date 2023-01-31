import React, { useState } from 'react';
import moment from 'moment'
import { saveAs } from "file-saver";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Draggable from "react-draggable";
import { api } from "../../../services/api";

import {
  Close,
  HourglassEmpty,
  FileCopy,
  ListAlt,
  Block,
  Edit,
  CancelScheduleSend,
  FeaturedPlayList
} from "@material-ui/icons";
import { DataGrid } from "@material-ui/data-grid";
import {
  Dialog,
  Tooltip,
  DialogActions,
  DialogContent,
  Paper,
  Grow,
  Button,
  Typography,
  DialogTitle,
  IconButton,
  ButtonGroup
} from "@material-ui/core/";

import { Toast } from "../../../components/toasty";
import {
  ChangeCliente,
  ChangeTipoVenda,
  SetDepOrigem,
  SetDepDestino,
  SetCondPag,
  SetObs,
  SetCheckedProd,
  UpdateCarrinho,
  SetBuyQtt,
  ResetarDetalhes,
  ClearCarrinho,
  EditPedido,
  SwitchTab
} from "../../../global/actions/VendasAction";

import nfeLogo from '../../../assets/svg/NFe.svg';
import xmlLogo from '../../../assets/svg/XML.svg';

const DetailsModal = ({ pedidoDet, open, actualPedidoInfo, setActualPedidoInfo, setPedidos, setPedidoDet, setOpen, ...props }) => {
  const [wait, setWait] = useState(false);

  const {
    Clientes,
  } = props.State;

  const {
    ChangeCliente,
    ChangeTipoVenda,
    SetDepOrigem,
    SetDepDestino,
    SetCondPag,
    SetObs,
    SetCheckedProd,
    UpdateCarrinho,
    SetBuyQtt,
    ResetarDetalhes,
    ClearCarrinho,
    EditPedido,
    SwitchTab
  } = props;

  const handleCloseDialog = () => {
    setActualPedidoInfo({});
    setPedidoDet([]);
    setOpen(false);
  };

  const extraControls = (status) => {
    switch (status) {
      case 'F':
        return (
          <ButtonGroup variant="contained" color="primary">
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Gerar PDF
                </label>
              }
              placement="top"
              arrow
            >
              <IconButton
                disabled={wait}
                onClick={() => handleRequestPDF(actualPedidoInfo)}
                color="secondary"
              >
                <FeaturedPlayList />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Copiar pedido
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleCopyVenda()} color="secondary">
                <FileCopy />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Baixar DANFE
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleRecoverDOC(actualPedidoInfo, 'DANFE')} color="primary">
                <img
                  src={nfeLogo}
                  width='23px'
                  height='23px'
                  alt='NFe Icon'
                />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Baixar XML
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleRecoverDOC(actualPedidoInfo, 'XML')} color="primary">
                <img
                  src={xmlLogo}
                  width='23px'
                  height='23px'
                  alt='NFe Icon'
                />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )
      case 'P':
        return (
          <ButtonGroup variant="contained" color="primary">
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Gerar PDF
                </label>
              }
              placement="top"
              arrow
            >
              <IconButton
                disabled={wait}
                onClick={() => handleRequestPDF(actualPedidoInfo)}
                color="secondary"
              >
                <FeaturedPlayList />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Cancelar Pedido
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleCancel()} color="primary">
                <Block />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Editar Venda
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleEditVenda()} color="secondary">
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Solicitar NFe
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleRequestNFE()} color="primary">
                <img
                  src={nfeLogo}
                  width='23px'
                  height='23px'
                  alt='NFe Icon'
                />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        )
      case 'S':
        return (
          <ButtonGroup variant="contained" color="primary">
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Gerar PDF
                </label>
              }
              placement="top"
              arrow
            >
              <IconButton
                disabled={wait}
                onClick={() => handleRequestPDF(actualPedidoInfo)}
                color="secondary"
              >
                <FeaturedPlayList />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Copiar pedido
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleEditVenda()} color="secondary">
                <FileCopy />
              </IconButton>
            </Tooltip>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 8px 0px 0px' }}>
              <HourglassEmpty />
              <Typography variant='subtitle2'>Gerando NFe...</Typography>
            </div>
          </ButtonGroup>
        )
      case 'C':
        return (
          <ButtonGroup variant="contained" color="primary">
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Gerar PDF
                </label>
              }
              placement="top"
              arrow
            >
              <IconButton
                disabled={wait}
                onClick={() => handleRequestPDF(actualPedidoInfo)}
                color="secondary"
              >
                <FeaturedPlayList />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  Copiar pedido
                </label>
              }
              placement="top"
              arrow

            >
              <IconButton disabled={wait} onClick={() => handleEditVenda()} color="secondary">
                <FileCopy />
              </IconButton>
            </Tooltip>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 8px 0px 0px' }}>
              <CancelScheduleSend />
              <Typography variant='subtitle2'>Venda cancelada</Typography>
            </div>
          </ButtonGroup>
        )
      default:
        return
    }
  }

  const handleRecoverDOC = async (pedido, doctype) => {
    if (doctype === '') {
      Toast('Selecione um tipo de documento', 'warn')
      return
    }

    let configs = selectDocConfigs(doctype);

    setWait(true);
    let toastId = null

    try {
      toastId = Toast('Buscando...', 'wait')

      const response = await api.get(
        `/vendas/pedidos/detalhes/DOCS/${doctype}/${pedido.Serie_Pvc}/${pedido.Pvc_ID}`,
        {
          responseType: "arraybuffer",
        }
      );

      //quando não encontra o documento retorna um arraybuffer de 5 bytes(false)
      if (response.data.byteLength > 5) {
        Toast('Documento encontrado!', 'update', toastId, 'success')
        //Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
        const blob = new Blob([response.data], { type: configs.appType });

        //Salvo em PDF junto com a data atual, só pra não sobreescrever nada
        saveAs(blob, `NFe_${pedido.DOC}_${configs.sulfix}.${configs.ext}`);

        setWait(false);
      } else {
        Toast('Documento não encontrado', 'update', toastId, 'error')
        setWait(false);
      }
    } catch (err) {
      setWait(false);
      Toast('Falha na comunicação', 'update', toastId, 'error')
    }
  };

  const handleRequestPDF = async (pedido) => {
    setWait(true);
    let toastId = null

    try {
      toastId = Toast('Gerando PDF...', 'wait')

      const response = await api.get(`/vendas/pedidos/detalhes/PDF/${pedido.Serie_Pvc}/${pedido.Pvc_ID}`,
        {
          responseType: "arraybuffer",
        })

      Toast('PDF pronto!', 'update', toastId, 'success')
      setWait(false);

      const blob = new Blob([response.data], { type: 'application/pdf' })

      saveAs(blob, `Demonstrativo de Venda - ${pedido.Pvc_ID}.pdf`);

    } catch (err) {
      Toast('Falha ao gerar PDF', 'update', toastId, 'error')
      setWait(false);
    }

  }

  const handleCopyVenda = () => {
    ResetarDetalhes()
    ClearCarrinho()

    //escolhe o cliente correto
    Clientes.forEach((cliente) =>
      String(cliente.CNPJ) === String(actualPedidoInfo.CNPJ) ? ChangeCliente(cliente) : null
    );

    //define detalhes do pedido
    ChangeTipoVenda(String(actualPedidoInfo.Tipo).trim())
    if (String(actualPedidoInfo.Tipo).trim() === 'R') {
      SetDepOrigem(String(actualPedidoInfo.DepOrigemId).trim())
      SetDepDestino(String(actualPedidoInfo.DepDestId).trim())
    } else if (String(actualPedidoInfo.Tipo).trim() === 'V') {
      SetCondPag(String(actualPedidoInfo.CpgId).trim())
    }

    SetObs(actualPedidoInfo.MsgNF !== null ? String(actualPedidoInfo.MsgNF).trim() : '')

    //adiciono os produtos no carrinho
    pedidoDet.forEach(produto => SetCheckedProd(produto.ProdId))
    UpdateCarrinho()

    //corrijo o preco padrao dos itens com o preco do pedido
    pedidoDet.forEach(produto => {
      SetBuyQtt({
        id: produto.ProdId,
        value: produto.FatConversao !== null ? produto.PvdQtd / produto.FatConversao : produto.PvdQtd,
        field: 'Quantidade'
      })

      SetBuyQtt({
        id: produto.ProdId,
        value: produto.PvdVlrUnit,
        field: 'Vlr'
      })

      SetBuyQtt({
        id: produto.ProdId,
        value: produto.PdvVlrDesc !== null ? produto.PdvVlrDesc : 0,
        field: 'Desconto'
      })
    })

    SwitchTab(0)
  }

  const handleEditVenda = () => {
    if (actualPedidoInfo.ST === 'P') {
      if (Math.abs(moment(actualPedidoInfo.Emissao).get('month') - moment().get('month')) > 0) {
        Toast('Não é possivel editar pedidos emitidos no mês anterior', 'error')
        return
      }

      if (moment().diff(moment(actualPedidoInfo.Emissao), 'days') > 10) {
        Toast('Não é possível editar pedidos com mais de 10 dias', 'error')
        return
      }
    }
    
    ResetarDetalhes()
    ClearCarrinho()

    EditPedido(actualPedidoInfo.Pvc_ID)

    //escolhe o cliente correto
    Clientes.forEach((cliente) =>
      String(cliente.CNPJ) === String(actualPedidoInfo.CNPJ) ? ChangeCliente(cliente) : null
    );

    //define detalhes do pedido
    ChangeTipoVenda(String(actualPedidoInfo.Tipo).trim())
    if (String(actualPedidoInfo.Tipo).trim() === 'R') {
      SetDepOrigem(String(actualPedidoInfo.DepOrigemId).trim())
      SetDepDestino(String(actualPedidoInfo.DepDestId).trim())
    } else if (String(actualPedidoInfo.Tipo).trim() === 'V') {
      SetCondPag(String(actualPedidoInfo.CpgId).trim())
    }

    SetObs(actualPedidoInfo.MsgNF !== null ? String(actualPedidoInfo.MsgNF).trim() : '')

    //adiciono os produtos no carrinho
    pedidoDet.forEach(produto => SetCheckedProd(produto.ProdId))
    UpdateCarrinho()

    //corrijo o preco padrao dos itens com o preco do pedido
    pedidoDet.forEach(produto => {
      SetBuyQtt({
        id: produto.ProdId,
        value: produto.FatConversao !== null ? produto.PvdQtd / produto.FatConversao : produto.PvdQtd,
        field: 'Quantidade'
      })

      SetBuyQtt({
        id: produto.ProdId,
        value: produto.PvdVlrUnit,
        field: 'Vlr'
      })

      SetBuyQtt({
        id: produto.ProdId,
        value: produto.PdvVlrDesc !== null ? produto.PdvVlrDesc : 0,
        field: 'Desconto'
      })
    })

    // setOpen(false)
    SwitchTab(0)
  };

  const handleRequestNFE = async () => {
    if (String(actualPedidoInfo.Tipo).trim() === 'R' && Number(actualPedidoInfo.DepDestId) !== 1) {
      if (!window.confirm(`Para emitir uma nota de remessa o depósito do destinatário será alterado para o ser o seu. Depósito atual da remessa: ${actualPedidoInfo.DepDestDesc}`)) {
        return
      }
    }

    setWait(true)
    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      await api.put(`/vendas/pedidos/faturar/${actualPedidoInfo.Serie_Pvc}/${actualPedidoInfo.Pvc_ID}`)

      Toast('Nota solicitada!', 'update', toastId, 'success')

      setWait(false)
      setActualPedidoInfo(previousState => {
        return {
          ...previousState,
          ST: 'S'
        }
      })
      setPedidos(previousState => {
        let index = null
        let aux = [...previousState]

        aux.forEach((pedido, i) => {
          if (pedido.Serie_Pvc === actualPedidoInfo.Serie_Pvc && pedido.Pvc_ID === actualPedidoInfo.Pvc_ID) {
            index = i
          }
        })

        if (index !== null) {
          aux[index].ST = 'S'
        }

        return aux
      })
    } catch (err) {
      Toast('Falha ao solicitar a nota', 'update', toastId, 'error')
      setWait(false)
    }
  };

  const handleCancel = async () => {
    if (Math.abs(moment(actualPedidoInfo.Emissao).get('month') - moment().get('month')) > 0) {
      Toast('Não é possivel cancelar pedidos emitidos no mês anterior', 'error')
      return
    }

    if (moment().diff(moment(actualPedidoInfo.Emissao), 'days') > 10) {
      Toast('Não é possível cancelar pedidos com mais de 10 dias', 'error')
      return
    }

    setWait(true)
    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')

      await api.put(`/vendas/pedidos/cancelar/${actualPedidoInfo.Serie_Pvc}/${actualPedidoInfo.Pvc_ID}`)

      Toast('Venda cancelada!', 'update', toastId, 'success')
      setWait(false)
      setActualPedidoInfo(previousState => {
        return {
          ...previousState,
          ST: 'C'
        }
      })
      setPedidos(previousState => {
        let index = null
        let aux = [...previousState]

        aux.forEach((pedido, i) => {
          if (pedido.Serie_Pvc === actualPedidoInfo.Serie_Pvc && pedido.Pvc_ID === actualPedidoInfo.Pvc_ID) {
            index = i
          }
        })

        if (index !== null) {
          aux[index].ST = 'C'
        }

        return aux
      })
    } catch (err) {
      setWait(false)
      Toast('Falha na comunicação', 'update', toastId, 'error')
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleCloseDialog()}
      keepMounted={false}
      PaperComponent={PaperComponent}
      TransitionComponent={Transition}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <div className='XAlign' style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <ListAlt />
          Detalhes da Venda
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="XAlign" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: '8px' }}>

          <Typography gutterBottom variant="subtitle1">
            {PedidoDesc(String(actualPedidoInfo.Tipo).trim(), actualPedidoInfo.ST, actualPedidoInfo["Nome Fantasia"], actualPedidoInfo.Emissao)}
          </Typography>

          <div
            style={{ all: "unset", display: "flex", flexDirection: "row" }}
          >
            {extraControls(actualPedidoInfo.ST)}
          </div>
        </div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={PedidoDetToDatagrid(pedidoDet)}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
            disableColumnMenu
            hideFooter={pedidoDet.length > 5 ? false : true}
            loading={pedidoDet.length === 0}
          />
        </div>
      </DialogContent >
      <DialogActions style={{ padding: '8px 24px' }}>
        <div
          className="XAlign"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography gutterBottom variant="subtitle1">
            Total: <strong>R$ {calcTotalVenda(pedidoDet)}</strong>
          </Typography>

          <Button
            color="primary"
            onClick={handleCloseDialog}
            startIcon={<Close />}
            disabled={wait}
          >
            Fechar
          </Button>
        </div>
      </DialogActions>
    </Dialog >
  )
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ChangeCliente,
      ChangeTipoVenda,
      SetDepOrigem,
      SetDepDestino,
      SetCondPag,
      SetObs,
      SetCheckedProd,
      UpdateCarrinho,
      SetBuyQtt,
      ResetarDetalhes,
      ClearCarrinho,
      EditPedido,
      SwitchTab
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  State: store.VendaState,
});

export const PedidoDetailsModal = connect(mapStateToProps, mapDispatchToProps)(DetailsModal)

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} style={{ width: "100%", maxWidth: "900px" }} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow {...props} />;
});

const PedidoDesc = (tipo, status, cliente, emissão) => {
  let Desc = "";

  if (status === 'S') {
    Desc = Desc.concat("Solicitada a nota para a ");
  }

  switch (tipo) {
    case "V":
      Desc = Desc.concat("Venda ");
      break;
    case "R":
      Desc = Desc.concat("Remessa ");
      break;
    case "B":
      Desc = Desc.concat("Bonificação ");
      break;
    default:
      break;
  }

  switch (status) {
    case "F":
      Desc = Desc.concat("faturada para ");
      break;
    case "P":
      Desc = Desc.concat("registrada para ");
      break;
    case "C":
      Desc = Desc.concat("para ");
      break;
    default:
      break;
  }

  if (status === 'S') {
    Desc = Desc.concat(`de ${cliente}`);
  } else if (status === 'C') {
    Desc = Desc.concat(` ${cliente} cancelada`);
  } else {

    Desc = Desc.concat(` ${cliente}`);
  }

  // if (status === 'F' || status === 'P') {
  //     Desc = Desc.concat(` em ${moment(emissão).format("LL")}`);
  // }

  return Desc;
};

const columns = [
  {
    field: "index",
    headerName: "Item",
    width: 90,
    editable: false,
    align: "center",
  },
  { field: "id", headerName: "Cód", width: 80, editable: false },
  {
    field: "Produto",
    headerName: "Produto",
    flex: 1,
    editable: false,
  },
  {
    field: "PvdQtd",
    headerName: "Qtd.",
    width: 60,
    editable: false,
    sortable: false,
    align: "right",
  },
  {
    field: "PvdVlrUnit",
    headerName: "Vlr. Un.",
    width: 90,
    editable: false,
    sortable: false,
    align: "right",
  },
  {
    field: "PdvVlrDesc",
    headerName: "Desconto",
    width: 90,
    editable: false,
    sortable: false,
    align: "right",
  },
  {
    field: "PvdVlrTotal",
    headerName: "Vlr. Total",
    width: 90,
    editable: false,
    sortable: false,
    align: "right",
  },
];

const PedidoDetToDatagrid = (pedidoDet) => {
  let aux = [];
  pedidoDet.map((det) =>
    aux.push({
      index: det.PvdID,
      id: det.ProdId,
      Produto: det.Produto,
      PvdQtd: det.PvdQtd,
      PvdVlrUnit: det.PvdVlrUnit,
      PdvVlrDesc: det.PdvVlrDesc,
      PvdVlrTotal: det.PvdVlrTotal,
    })
  );

  return aux;
};

const selectDocConfigs = (doctype) => {
  switch (doctype) {
    case "DANFE":
      return {
        ext: 'pdf',
        sulfix: doctype,
        appType: "application/pdf",
      };
    case "XML" || "CANCELAMENTO" || "CC":
      return {
        ext: 'xml',
        sulfix: doctype,
        appType: "text/xml",
      };
    case "CANCELAMENTO":
      return {
        ext: 'xml',
        sulfix: doctype,
        appType: "text/xml",
      };
    case "CC":
      return {
        ext: 'xml',
        sulfix: doctype,
        appType: "text/xml",
      };

    default:
      return null;
  }
}

const calcTotalVenda = (venda) => {
  let total = 0;

  venda.forEach(v => {
    total = total + v.PvdVlrTotal;
  })

  return Number(total).toFixed(2)
}
