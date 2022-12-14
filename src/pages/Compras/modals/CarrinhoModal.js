import React, { useState, useEffect } from 'react'
import Input from "react-number-format";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../../services/api";

import { DataGrid } from "@material-ui/data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Tooltip,
  makeStyles,
  IconButton
} from "@material-ui/core/";
import { ShoppingCart, LocalShipping } from "@material-ui/icons";

import InputMultline from "../../../components/materialComponents/InputMultline";
import { Toast } from "../../../components/toasty";
import { RED_PRIMARY } from "../../../misc/colors";
import { SetCheckedProd, SetBuyQtt, UpdateProdutos, ClearCarrinho } from "../../../global/actions/ComprasAction";


const CarrinhoModal = ({ open, onClose, desconto, ...props }) => {
  const classes = useStyles()

  const [wait, setWait] = useState(false);
  const [aVista, setAVista] = useState(false);
  const [obs, setObs] = useState("");
  const [retira, setRetira] = useState(false);
  // eslint-disable-next-line
  const [targetCEP, setTargetCEP] = useState('WYSI');
  const [faturamento, setFaturamento] = useState(null);

  const { SetBuyQtt, UpdateProdutos, SetCheckedProd, ClearCarrinho, } = props;

  const { Carrinho, Checked, MinCompra, PodeRetirar } = props.State;

  const columns = returnColunsDef(aVista, desconto);

  const CarrinhoFormatado = fromStore2Datagrid(Carrinho);

  async function loadData() {
    try {
      const response = await api.get(`/compras/faturamento/rotas/${targetCEP}`)

      setFaturamento(response.data.Faturamento)
    } catch (err) {

    }
  }

  useEffect(() => {
    if (open) {
      loadData()
    }
    // eslint-disable-next-line
  }, [open])

  const updateChecked = (SelectedIDs) => {
    let naoMarcados = [];

    CarrinhoFormatado.forEach((prod) => {
      if (SelectedIDs.indexOf(prod.id) === -1) naoMarcados.push(prod.id);
    });

    let CheckedSemNaoMarcados = Checked.filter(
      (check) => naoMarcados.indexOf(check) === -1
    );

    // Basicamente: Carrinho U Checked - CarrinhoNãoMarcados
    const newChecked = [...CheckedSemNaoMarcados, ...SelectedIDs];
    SetCheckedProd(newChecked);
  };

  const handleBuy = async (event) => {
    const LoadDTO = {
      Items: Carrinho,
      Obs: obs,
      Retira: retira,
      AVista: aVista,
      Desconto: desconto
    };

    setWait(true);

    if (!verifyPedido(LoadDTO, retira, MinCompra, aVista, desconto)) {
      setWait(false);
      return;
    }

    let toastId = null;

    try {
      toastId = Toast("Aguarde...", "wait");

      await api.post("/compras/comprar", LoadDTO);

      Toast("Pedido incluído com sucesso!", "update", toastId, "success");
      ClearCarrinho();
      setObs("");
      setRetira(false);
      setAVista(false);
      setWait(false);
    } catch (err) {
      Toast(
        'Usuário bloqueado para comprar. Verifique as pendencias na tela "Contas à Pagar"',
        "update",
        toastId,
        "error"
      );
      setWait(false);
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={() => onClose(false)}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <div className="XAlign" style={{ justifyContent: "flex-start" }}>
          <ShoppingCart className={classes.extendedIcon} />
          Carrinho
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="XAlign" style={{ justifyContent: "space-between" }}>
          <div className="YAlign" style={{ flex: "unset" }}>
            {PodeRetirar ? (
              <FormControlLabel
                control={
                  <Checkbox
                    className={classes.checkbox}
                    checked={retira}
                    onChange={(e) => setRetira(e.target.checked)}
                  />
                }
                label="Franqueado Retira"
              />
            ) : null}
            <FormControlLabel
              control={
                <Checkbox
                  className={classes.checkbox}
                  checked={aVista}
                  onChange={(e) => setAVista(e.target.checked)}
                />
              }
              label="Pagamento antecipado (-5%)"
            />
          </div>

          <div className="XAlign" style={{ width: "unset" }}>
            <Tooltip
              title={faturamento === null ? (
                <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  <Typography color="inherit">Previsões para CEP padrão</Typography>
                  <Typography color="inherit">Carregando...</Typography>
                </div>
              ) : (
                <div style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                  <Typography color="inherit">Previsões para CEP: <strong>{faturamento.CEP}</strong></Typography>
                  {/* <Typography color="inherit">Região: <strong>{faturamento.Regiao}</strong></Typography> */}
                  <em>Faturamento previsto: </em> <u>{faturamento.PrevFaturamento}({faturamento.Faturamento})</u>.
                  <br />
                  <em>Rota prevista: </em> <u>{faturamento.PrevRota}({faturamento.Rota})</u>.
                </div>
              )

              }
              placement="top"
              arrow={true}
            >
              <IconButton
                color="primary"
                style={{
                  margin: '0px 8px 0px 0px'
                }}
              >
                <LocalShipping />
              </IconButton>
            </Tooltip>
            <div className="YAlign" style={{ flex: "unset" }}>
              <Typography gutterBottom variant="subtitle1">
                <strong>Valor mínimo:</strong> R$ {MinFrete(MinCompra, retira)}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                <strong>Total do Pedido:</strong> R${totalPedido(Carrinho, aVista, desconto)}
              </Typography>
            </div>
          </div>
        </div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            className={classes.dataGrid}
            rows={CarrinhoFormatado}
            columns={columns}
            autoPageSize={true}
            disableSelectionOnClick={true}
            disableColumnMenu={true}
            checkboxSelection={true}
            pageSize={5}
            hideFooter={CarrinhoFormatado?.length > 5 ? false : true}
            onCellEditCommit={(params, event) => {
              SetBuyQtt(params);
            }}
            onSelectionModelChange={(SelectedIDs) => {
              updateChecked(SelectedIDs);
            }}
          />
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "8px 24px" }}>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <InputMultline
            style={{
              width: "100%",
              backgroundColor:
                100 - obs.length < 0 ? "rgb(255, 0, 0, 0.5)" : "inherit",
            }}
            onChange={(e) => setObs(e.target.value)}
            value={obs}
            label={`Obs.(${100 - obs.length})`}
            fullWidth={true}
          />
        </Box>

        <Tooltip
          title={
            <label
              style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
            >
              Gravar pedido de compra
            </label>
          }
          placement="top"
          arrow

        >
          <Button
            disabled={wait}
            onClick={(e) => handleBuy(e)}
            color="primary"
          >
            Comprar
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <label
              style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
            >
              Remove itens selecionados
            </label>
          }
          placement="top"
          arrow

        >
          <Button
            disabled={
              CarrinhoMarcados(Carrinho, Checked) > 0 && !wait ? false : true
            }
            onClick={() => UpdateProdutos()}
            color="primary"
          >
            Remover
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <label
              style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
            >
              Remove todos os produtos do carrinho
            </label>
          }
          placement="top"
          arrow

        >
          <Button
            disabled={wait}
            onClick={() => {
              ClearCarrinho()
              setAVista(false)
            }}
            color="primary"
          >
            Limpar
          </Button>
        </Tooltip>
        <Tooltip
          title={
            <label
              style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }}
            >
              Fechar carrinho
            </label>
          }
          placement="right"
          arrow

        >
          <Button
            disabled={wait}
            onClick={() => onClose(false)}
            color="primary"
          >
            Fechar
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = (store) => ({
  State: store.CompraState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      SetCheckedProd,
      SetBuyQtt,
      ClearCarrinho,
      UpdateProdutos,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CarrinhoModal);

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  dataGrid: {
    '& input[type="checkbox"]': {
      transform: "scale(0.5)",
    },
  },
  checkbox: {
    transform: "scale(0.3)",
    marginLeft: "8px",
  },
}));

const MinFrete = (min, retira) => {
  return retira ? "0,00" : String(Number(min).toFixed(2)).replace('.', ',');
};

const CarrinhoMarcados = (CarrinhoList, Marcados) => {
  let count = 0;
  CarrinhoList.forEach((prod) =>
    Marcados.indexOf(prod.Cód) !== -1 ? count++ : null
  );

  return count;
};

const verifyPedido = (pedido, retira, MinCompra, aVista, Desconto) => {
  if (pedido.Items.length === 0) {
    Toast("Nenhum item no carrinho", "warn");
    return false;
  }

  for (let i = 0; i < pedido.Items.length; i++) {
    if (pedido.Items[i].QCompra === 0) {
      Toast(
        "Um ou mais produtos do carrinho não tem uma quantidade definida",
        "warn"
      );
      return false;
    }
  }

  if (pedido.Obs.length > 100) {
    Toast("Tamanho do campo Observações excede o limite", "warn");
    return false;
  }

  if (!retira && Number.parseFloat(totalPedido(pedido.Items, aVista, Desconto)) < Number.parseFloat(MinCompra)) {
    Toast("Valor total do pedido é menor que o mínimo", "warn");
    return false;
  }

  return true;
};

const fromStore2Datagrid = (carrinho) => {
  const aux = [];

  carrinho.forEach((item) => {
    aux.push({
      id: item.Cód,
      Produto: item.Produto,
      Quantidade: item.QCompra,
      Vlr: item.VlrUn,
      Conversao: item.QtMin,
      Royalties: item.ProdRoy
    });
  });

  return aux;
};

const returnColunsDef = (aVista, Desconto) => {
  return [
    { field: "id", headerName: "Código", width: 100, editable: false },
    {
      field: "Produto",
      headerName: "Produto",
      flex: 1,
      editable: false,
    },
    {
      field: "Quantidade",
      headerName: "Qtd",
      type: "number",
      hasFocus: true,
      width: 90,
      sortable: false,
      editable: true,
      renderCell: (params) => (
        <div
          style={{
            fontWeight: "bold",
            color: RED_PRIMARY,
          }}
        >
          {params.value}
        </div>
      ),
      renderEditCell: (params) => (
        <Input
          style={{
            fontWeight: "bold",
            color: RED_PRIMARY,
          }}
          autoFocus={true}
          decimalScale={0}
          fixedDecimalScale={true}
          isNumericString
          prefix=""
          allowNegative={false}
          onChange={(e) => {
            params.api.setEditCellValue(
              {
                id: params.id,
                field: params.field,
                value: Number(e.target.value),
              },
              e
            );
          }}
          value={params.value}
        />
      ),
    },
    {
      field: "VlrUn",
      headerName: "Valor Un.",
      type: "number",
      sortable: false,
      width: 90,
      valueGetter: (params) =>
        params.getValue(params.id, "Vlr") *
        params.getValue(params.id, "Conversao") *
        ((aVista ? 0.95 : 1) + (Desconto && params.getValue(params.id, "Royalties") === 1 ? Desconto : 1) - 1),
    },
    {
      field: "VlrTotal",
      headerName: "Total",
      type: "number",
      sortable: false,
      description: "Cálculo do Valor Unitário x Quantidade",
      width: 90,
      valueGetter: (params) =>
        String(Number.parseFloat(
          params.getValue(params.id, "Quantidade") *
          params.getValue(params.id, "VlrUn"),
        ).toFixed(2)).replace('.', ',')
    },
  ]
}

const totalPedido = (carrinho, aVista, Desconto) => {
  let aux = 0;

  carrinho.forEach((item) => {
    aux +=
      Number.parseFloat(item.VlrUn).toFixed(4) * (item.QtMin * item.QCompra) * ((aVista ? 0.95 : 1) + (Desconto && item.ProdRoy === 1 ? Desconto : 1) - 1)
  });

  return String(Number.parseFloat(aux).toFixed(2)).replace('.', ',');
};