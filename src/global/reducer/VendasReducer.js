import {
  VENDA_CHANGE_BUY_QTT, VENDA_CHANGE_CLIENTE, VENDA_CHANGE_TAB_INDEX, VENDA_CHANGE_TIPO_VENDA, VENDA_CHECKED_PROD, VENDA_CLEAR_CART, VENDA_DESTROY_STORE, VENDA_EDIT_PEDIDO, VENDA_LOAD_CLIENTES, VENDA_LOAD_CONSULTA_COLETAS_CARGA, VENDA_LOAD_DEPOSITOS, VENDA_LOAD_PAGAMENTOS, VENDA_LOAD_PRODUTOS_DISPONIVEIS, VENDA_MOVE_CARRINHO_2_PRODUTOS, VENDA_MOVE_PRODUTOS_2_CARRINHO, VENDA_RESET_DETALHES, VENDA_SET_COND_PAG, VENDA_SET_DEP_DESTINO, VENDA_SET_DEP_ORIGEM, VENDA_SET_OBS
} from "../actions/VendasActionTypes";

const initialState = {
  InitProdutos: [],
  Produtos: [],
  Clientes: [],
  Condicoes: [],
  Depositos: [],

  Carrinho: [],
  Cliente: {},
  OBS: "",
  TipoVenda: "",
  CondPag: "",
  RemOrigem: "",
  RemDestino: "",

  Checked: [],
  TabIndex: 0,
  FixPedido: null,

  cargaColetas: null
};

export const VendasReducer = (state = initialState, action) => {
  switch (action.type) {
    case VENDA_LOAD_PRODUTOS_DISPONIVEIS:
      let _newProdutos = [];
      action.Produtos.forEach((produto) =>
        _newProdutos.push({ ...produto })
      );

      return {
        ...state,
        Produtos: _newProdutos,
        InitProdutos: _newProdutos,
      };

    case VENDA_LOAD_CLIENTES:
      return {
        ...state,
        Clientes: action.Clientes,
      };
    case VENDA_LOAD_DEPOSITOS:
      return {
        ...state,
        Depositos: action.Depositos,
      };
    case VENDA_LOAD_PAGAMENTOS:
      return {
        ...state,
        Condicoes: action.pagamentos,
      };

    case VENDA_EDIT_PEDIDO:
      return {
        ...state,
        FixPedido: action.PedidoId,
      };

    case VENDA_CHANGE_TAB_INDEX:
      return {
        ...state,
        TabIndex: action.tab,
      };

    case VENDA_CHANGE_CLIENTE:
      return {
        ...state,
        Cliente: action.cliente,
      };

    case VENDA_SET_DEP_ORIGEM:
      return {
        ...state,
        RemOrigem: action.dep,
      };

    case VENDA_SET_DEP_DESTINO:
      return {
        ...state,
        RemDestino: action.dep,
      };

    case VENDA_SET_OBS:
      return {
        ...state,
        OBS: action.obs,
      };

    case VENDA_CHANGE_TIPO_VENDA:
      return {
        ...state,
        TipoVenda: action.tVenda,
        CondPag: "",
        RemOrigem: "",
        RemDestino: "",
      };
    case VENDA_SET_COND_PAG:
      return {
        ...state,
        CondPag: action.cond,
      };

    case VENDA_CHECKED_PROD:
      /*precisei por esse teste aqui porque a seleção de produtos mandar ID por ID 
      quando selecionado, já o carrinho(administrado pelo datagrid) manda logo o Array 
      todo de ID's selecionados, mas no caso de um ID ser deselecionado, ele não vai 
      ser informado e não tem como remover ele do array de forma segura*/
      if (typeof action.value == "object") {
        return {
          ...state,
          Checked: action.value,
        };
      } else {
        let _newChecked = [...state.Checked];
        let indexOfProd = _newChecked.indexOf(action.value);
        
        indexOfProd < 0
        ? _newChecked.push(action.value)
        : _newChecked.splice(indexOfProd, 1);
        
        return {
          ...state,
          Checked: _newChecked,
        };
      }

    case VENDA_CHANGE_BUY_QTT:
      let _newCarrinho = [...state.Carrinho];

      const campo = action.campo;

      if (campo === "Quantidade") {
        _newCarrinho.forEach((item) => {
          if (String(item.ProdId) === String(action.ProdId)) {
            item.QVenda = action.Qtd;
          }
        });
      } else if (campo === "Vlr") {
        _newCarrinho.forEach((item) => {
          if (String(item.ProdId) === String(action.ProdId)) {
            item.VVenda = action.Qtd;
          }
        });
      } else if (campo === "Desconto") {
        _newCarrinho.forEach((item) => {
          if (String(item.ProdId) === String(action.ProdId)) {
            item.DVenda = action.Qtd;
          }
        });
      }

      return {
        ...state,
        Carrinho: _newCarrinho,
      };

    case VENDA_MOVE_PRODUTOS_2_CARRINHO:
      let newCarrinho = [...state.Carrinho];
      let newProdutos = [];
      let newChecked = [];
      let FoundID = [];

      //Adiciono produto ao carrinho
      state.Produtos.forEach((Prod) => {
        if (state.Checked.indexOf(Prod.ProdId) !== -1) {
          newCarrinho.push(Prod);
          FoundID.push(Prod.ProdId);
        }
      });

      //Remove os produtos adicionados ao carrinho da lista de produtos
      newProdutos = state.Produtos.filter(
        (prod) => FoundID.indexOf(prod.ProdId) === -1
      );

      //removo da lista de marcados os que eu acabei de adicionar ao carrinho
      newChecked = state.Checked.filter((id) => FoundID.indexOf(id) === -1);

      return {
        ...state,
        Produtos: newProdutos,
        Carrinho: newCarrinho,
        Checked: newChecked,
      };

    case VENDA_MOVE_CARRINHO_2_PRODUTOS:
      let newCarrinho_ = [];
      let newProdutos_ = [...state.Produtos];
      let newChecked_ = [];
      let FoundID_ = [];

      //Adiciono aos produtos itens removidos do carrinho apos zerar a Qtd. Compra
      state.Carrinho.forEach((Prod) => {
        if (state.Checked.indexOf(Prod.ProdId) !== -1) {
          newProdutos_.push({ ...Prod, QVenda: 0, VVenda: Prod.PrVenda });
          FoundID_.push(Prod.ProdId);
        }
      });

      //Removo os itens do carrinho
      newCarrinho_ = state.Carrinho.filter(
        (prod) => FoundID_.indexOf(prod.ProdId) === -1
      );

      //removo da lista de marcados os que eu acabei de voltar pra produtos
      newChecked_ = state.Checked.filter((id) => FoundID_.indexOf(id) === -1);

      return {
        ...state,
        Produtos: newProdutos_,
        Carrinho: newCarrinho_,
        Checked: newChecked_,
      };

    case VENDA_LOAD_CONSULTA_COLETAS_CARGA:
      return {
        ...state,
        cargaColetas: action.carga
      };

    case VENDA_CLEAR_CART:
      return {
        ...state,
        Produtos: [...state.InitProdutos],
        Carrinho: [],
        Checked: [],
      };
      
      case VENDA_RESET_DETALHES:
      return {
        ...state,
        Cliente: {},
        OBS: "",
        TipoVenda: "",
        CondPag: "",
        RemOrigem: "",
        RemDestino: "",
        FixPedido: null
      };

    case VENDA_DESTROY_STORE:
      return initialState;

    default:
      return state;
  }
};
