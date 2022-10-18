import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import Input from "react-number-format";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../services/api";

import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import { DataGrid } from "@material-ui/data-grid";
import { Add, ShoppingCart } from "@material-ui/icons";

import { Panel } from "../../components/commom_in";
import Loading from "../../components/loading_screen";
import MenuAbas from "../../components/materialComponents/PainelAbas";
import { Toast } from '../../components/toasty';
import { RED_PRIMARY } from '../../misc/colors';

import { ChangeCliente, ChangeTipoVenda, ClearCarrinho, DestroyStore, LoadClientes, LoadDepositos, LoadInsumos, LoadPagamentos, ResetarDetalhes, SetBuyQtt, SetCheckedProd, SetColetaCarga, UpdateCarrinho, UpdateProdutos } from "../../global/actions/VendasAction";
import Pedidos from "./Pedidos";
import Vender from "./Vender";

function Vendas(props) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [wait, setWait] = useState(false);

  const classes = useStyles();

  const { LoadInsumos, UpdateCarrinho, SetBuyQtt, SetCheckedProd, UpdateProdutos, ClearCarrinho, ResetarDetalhes, DestroyStore, LoadClientes, LoadPagamentos, LoadDepositos, ChangeCliente, SetColetaCarga, ChangeTipoVenda } = props;

  const { TabIndex, Produtos, Checked, Carrinho, Cliente, OBS, TipoVenda, CondPag, RemOrigem, RemDestino, FixPedido, cargaColetas } = props.State;

  const CarrinhoFormatado = fromStore2Datagrid(Carrinho);

  //componentDidMount
  useEffect(() => {
    async function Load() {
      try {
        const response = await api.get("/vendas/produtos");

        LoadInsumos(Array.isArray(response.data.Produtos) ? response.data.Produtos : []);
        LoadClientes(Array.isArray(response.data.Clientes) ? response.data.Clientes : []);
        LoadPagamentos(response.data.CodPag);
        LoadDepositos(response.data.Depositos);
        setLoaded(true);

        cargaFilaColetas(response.data.Clientes)
      } catch (err) {
      }
    }
    Load();
    // eslint-disable-next-line
  }, [LoadInsumos, LoadClientes, LoadPagamentos, LoadDepositos]);

  //componentWillUnmount
  useEffect(() => {
    return () => DestroyStore();
  }, [DestroyStore]);

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

  const handleSubmit = async () => {
    setWait(true)

    const LoadDTO = {
      Carrinho,
      Cliente,
      OBS,
      TipoVenda,
      CondPag,
      RemOrigem,
      RemDestino,
    }

    if (!verifyDTO(LoadDTO)) {
      setWait(false)
      return
    }

    let toastId = null


    try {
      toastId = Toast('Aguarde...', 'wait')

      if (FixPedido === null) {
        await api.post('/vendas/vender', {
          Pedido: LoadDTO
        })

        Toast('Pedido registrado com sucesso!', 'update', toastId, 'success')
      } else {
        await api.put(`/vendas/pedidos/atualizar/${FixPedido}`, {
          Pedido: LoadDTO
        })

        Toast('Pedido atualizado com sucesso!', 'update', toastId, 'success')
      }

      setOpen(false)
      setWait(false)
      ResetarDetalhes()
      ClearCarrinho()
    } catch (err) {
      Toast('Falha ao gravar pedido de venda', 'update', toastId, 'error')
      setWait(false)
    }
  };

  const cargaFilaColetas = (ClientesNaoDoRedux) => {
    if (cargaColetas === null) {
      return
    }

    ClientesNaoDoRedux.forEach((cliente) => {
      if (String(cliente.CNPJ) === String(cargaColetas.Cliente)) {
        ChangeCliente(cliente)
      }
    });

    ChangeTipoVenda('V')

    cargaColetas.Items.forEach(item => {
      if (item.ProdId) {
        SetCheckedProd(item.ProdId)
      }
    })
    
    UpdateCarrinho()

    cargaColetas.Items.forEach(item => {
      SetBuyQtt({
        id: item.ProdId,
        value: item.QVenda,
        field: 'Quantidade'
      })

      SetBuyQtt({
        id: item.ProdId,
        value: item.VVenda,
        field: 'Vlr'
      })

      SetBuyQtt({
        id: item.ProdId,
        value: item.DVenda,
        field: 'Desconto'
      })
    })

    SetColetaCarga(null)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <Panel
      style={{
        overflow: "auto",
        alignContent: "center",
        padding: "0px",
        justifyContent: "flex-start",
      }}
    >
      <MenuAbas titles={["Vender", "Vendas realizadas"]} activeTab={TabIndex}>
        <Vender />
        <Pedidos />
      </MenuAbas>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <div className='XAlign' style={{ justifyContent: 'flex-start' }}>
            <ShoppingCart className={classes.extendedIcon} />
            Carrinho
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="XAlign" style={{ justifyContent: FixPedido !== null ? 'space-between' : "flex-end", flexWrap: 'wrap' }}>
            {FixPedido &&
              <Typography gutterBottom variant="subtitle1" style={{ color: RED_PRIMARY }}>
                <strong style={{ color: '#000' }}>Atualizando pedido:</strong> {FixPedido}
              </Typography>
            }
            <Typography gutterBottom variant="subtitle1">
              <strong>Total da Venda:</strong> R${totalPedido(Carrinho)}
            </Typography>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              className={classes.dataGrid}
              rows={CarrinhoFormatado}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick={true}
              disableColumnMenu={true}
              checkboxSelection={true}
              hideFooter={CarrinhoFormatado.length > 5 ? false : true}
              onCellEditCommit={(params, event) => {
                SetBuyQtt(params);
              }}
              onSelectionModelChange={(SelectedIDs) => {
                updateChecked(SelectedIDs);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '8px 24px' }}>

          <Tooltip
            title={
              <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                {FixPedido !== null ? `Atualizar pedido ${FixPedido}` : 'Gravar venda'}
              </label>
            }
            placement="top"
            arrow

          >
            <Button disabled={wait} onClick={(e) => handleSubmit(e)} color="primary">
              {FixPedido !== null ? 'Atualizar' : 'Gravar'}
            </Button>
          </Tooltip>

          <Tooltip
            title={
              <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                Remove marcados
              </label>
            }
            placement="top"
            arrow

          >
            <Button
              disabled={CarrinhoMarcados(Carrinho, Checked) > 0 && !wait ? false : true}
              onClick={() => UpdateProdutos()}
              color="primary"
            >
              Remover
            </Button>
          </Tooltip>

          <Tooltip
            title={
              <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                Limpa carrinho
              </label>
            }
            placement="top"
            arrow

          >
            <Button disabled={wait} onClick={() => ClearCarrinho()} color="primary">
              Limpar
            </Button>
          </Tooltip>

          <Tooltip
            title={
              <label style={{ fontSize: "14px", color: "#FFF", lineHeight: "20px" }} >
                Fechar carrinho
              </label>
            }
            placement="right"
            arrow

          >
            <Button disabled={wait} onClick={() => setOpen(false)} color="primary">
              Fechar
            </Button>
          </Tooltip>

        </DialogActions>
      </Dialog>
      <div
        className="YAlign"
        style={{
          position: "absolute",
          right: "16px",
          bottom: "16px",
          alignItems: "unset",
        }}
      >
        <Zoom
          in={TabIndex === 0 && ProdutosMarcados(Produtos, Checked) > 0}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${TabIndex === 0 ? transitionDuration.exit : 0
              }ms`,
            zIndex: "2",
          }}
          unmountOnExit
        >
          <Fab
            variant="extended"
            onClick={() => UpdateCarrinho()}
            color="primary"
          >
            <StyledBadge
              badgeContent={ProdutosMarcados(Produtos, Checked)}
              color="primary"
            >
              <Add className={classes.extendedIcon} />
              Adicionar
            </StyledBadge>
          </Fab>
        </Zoom>

        <Zoom
          in={TabIndex === 0 && Carrinho.length > 0}
          timeout={transitionDuration}
          style={{
            marginTop: "8px",
            transitionDelay: `${TabIndex === 0 ? transitionDuration.exit : 0
              }ms`,
            zIndex: "2",
          }}
          unmountOnExit
        >
          <Fab
            variant="extended"
            onClick={() => {
              setOpen(true);
            }}
            color="primary"
          >
            <StyledBadge badgeContent={Carrinho.length} color="primary">
              <ShoppingCart className={classes.extendedIcon} />
              Carrinho
            </StyledBadge>
          </Fab>
        </Zoom>
      </div>
    </Panel>
  );
}

const mapStateToProps = (store) => ({
  State: store.VendaState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      LoadInsumos,
      UpdateCarrinho,
      SetBuyQtt,
      SetCheckedProd,
      UpdateProdutos,
      ClearCarrinho,
      ResetarDetalhes,
      DestroyStore,
      LoadClientes,
      LoadPagamentos,
      LoadDepositos,
      ChangeCliente,
      SetColetaCarga,
      ChangeTipoVenda
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Vendas);

const ProdutosMarcados = (ProdList, Marcados) => {
  let count = 0;
  ProdList.forEach((prod) =>
    Marcados.indexOf(prod.ProdId) !== -1 ? count++ : null
  );

  return count;
};

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -4,
    top: -4,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

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
    transform: "scale(0.4)",
  },
}));

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

const totalPedido = (carrinho) => {
  let aux = 0;

  carrinho.forEach((item) => {
    aux += item.FatConversao !== null ? (item.VVenda - item.DVenda) * (item.QVenda * item.FatConversao) : (item.VVenda - item.DVenda) * item.QVenda;
  });

  return String(Number.parseFloat(aux).toFixed(2)).replace('.', ',');
};

const fromStore2Datagrid = (carrinho) => {
  const aux = [];

  carrinho.forEach((item) => {
    aux.push({
      id: item.ProdId,
      Produto: item.Produto,
      Quantidade: item.QVenda,
      Vlr: item.VVenda,
      Desconto: item.DVenda,
      Conversao: item.FatConversao !== null ? item.FatConversao : 1,
    });
  });

  return aux;
};

const columns = [
  { field: "id", headerName: "Cod", width: 80, editable: false },
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
    width: 80,
    editable: true,
    renderCell: (params) => (
      <div style={{
        fontWeight: 'bold',
        color: RED_PRIMARY,
      }}>
        {params.value}
      </div>
    ),
    renderEditCell: (params) => (
      <Input
        style={{
          fontWeight: 'bold',
          color: RED_PRIMARY,
        }}
        autoFocus={true}
        decimalScale={0}
        allowLeadingZeros={false}
        allowEmptyFormatting={false}
        allowNegative={false}
        fixedDecimalScale={true}
        isNumericString
        prefix=""
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
    field: "Vlr",
    headerName: "Valor Un.",
    type: "number",
    hasFocus: true,
    width: 90,
    editable: true,
    sortable: false,
    renderCell: (params) => (
      <div style={{
        fontWeight: 'bold',
        color: RED_PRIMARY,
      }}>
        {String(params.value).replace('.', ',')}
      </div>
    ),
    renderEditCell: (params) => (
      <Input
        style={{
          fontWeight: 'bold',
          color: RED_PRIMARY,
        }}
        decimalSeparator=','
        thousandSeparator='.'
        autoFocus={true}
        decimalScale={4}
        fixedDecimalScale={false}
        isNumericString
        prefix=""
        allowLeadingZeros={false}
        allowEmptyFormatting={false}
        allowNegative={false}
        onChange={(e) => {
          params.api.setEditCellValue(
            {
              id: params.id,
              field: params.field,
              value: inputNumberString2Number(e.target.value),
            },
            e
          );
        }}
        value={params.value}
      />
    ),
  },
  {
    field: "Desconto",
    headerName: "Desconto",
    type: "number",
    hasFocus: true,
    width: 90,
    editable: true,
    sortable: false,
    renderCell: (params) => (
      <div style={{
        fontWeight: 'bold',
        color: RED_PRIMARY,
      }}>
        {String(params.value).replace('.', ',')}
      </div>
    ),
    renderEditCell: (params) => (
      <Input
        style={{
          fontWeight: 'bold',
          color: RED_PRIMARY,
        }}
        autoFocus={true}
        decimalScale={4}
        decimalSeparator=','
        thousandSeparator='.'
        fixedDecimalScale={false}
        isNumericString
        prefix=""
        allowLeadingZeros={false}
        allowEmptyFormatting={false}
        allowNegative={false}
        onChange={(e) => {
          params.api.setEditCellValue(
            {
              id: params.id,
              field: params.field,
              value: inputNumberString2Number(e.target.value),
            },
            e
          );
        }}
        value={params.value}
      />
    ),
  },
  {
    field: "VlrTotal",
    headerName: "Total",
    type: "number",
    description: "Cálculo do Valor Unitário x Quantidade",
    width: 120,
    valueGetter: (params) =>
      String(Number.parseFloat(
        (params.getValue(params.id, "Quantidade") * params.getValue(params.id, "Conversao")) *
        (
          params.getValue(params.id, "Vlr") - params.getValue(params.id, "Desconto")
        )
      ).toFixed(2)).replace('.', ',')
    ,
  },
];

const CarrinhoMarcados = (CarrinhoList, Marcados) => {
  let count = 0;
  CarrinhoList.forEach((prod) =>
    Marcados.indexOf(prod.ProdId) !== -1 ? count++ : null
  );

  return count;
};

const transitionDuration = {
  appear: 300,
  enter: 300,
  exit: 300,
};

const verifyDTO = (Pedido) => {

  //verificar se o cliente foi definido
  if (typeof Pedido.Cliente.CNPJ === 'undefined') {
    Toast('Cliente não selecionado', 'warn')
    return false
  }

  //verificar se o tipo de operação foi definido(venda/bonificação/remessa)
  if (Pedido.TipoVenda === '') {
    Toast('Tipo de venda não selecionado', 'warn')
    return false
  }

  //verificar se o tipo de pagamento foi definido no caso venda
  if (Pedido.TipoVenda === 'V' && Pedido.CondPag === '') {
    Toast('Tipo de pagamento não informado', 'warn')
    return false
  }

  //verificar se os depósitos foram definidos no caso remessa
  if (Pedido.TipoVenda === 'R' && (Pedido.RemOrigem === '' || Pedido.RemDestino === '')) {
    Toast('Depósito de origem ou destino não informado', 'warn')
    return false
  }

  //verificar se o carrinho está vazio
  if (Pedido.Carrinho.length <= 0) {
    Toast('Carrinho está vazio', 'warn')
    return false
  }

  //verificar o tamanho da OBS
  if (Pedido.OBS.length > 200) {
    Toast('A observação não deve ultrapassar 200 caractéres', 'warn')
    return false
  }

  //verificar se tem item com QTD zerada no carrinho
  for (let i = 0; i < Pedido.Carrinho.length; i++) {
    if (Pedido.Carrinho[i].QVenda === 0) {
      Toast('Um dos produtos tem Qtd. zerada', 'warn')
      return false
    }
  }

  //verificar se tem item com Valor zerado no carrinho
  for (let i = 0; i < Pedido.Carrinho.length; i++) {
    if (Pedido.Carrinho[i].VVenda === 0) {
      Toast('Um dos produtos tem valor zerado', 'warn')
      return false
    }
  }

  //verificar se o desconto está muito grande
  for (let i = 0; i < Pedido.Carrinho.length; i++) {
    if (
      Pedido.Carrinho[i].QVenda * (
        Pedido.Carrinho[i].VVenda - Pedido.Carrinho[i].DVenda
      ) < 0
    ) {
      Toast('Um dos produtos tem desconto maior que o preco unitário', 'warn')
      return false
    }
  }

  return true
}

const inputNumberString2Number = (numericString) => {
  return Number(
    String(numericString)
      .replace('.', '')
      .replace(',', '.')
  )
}