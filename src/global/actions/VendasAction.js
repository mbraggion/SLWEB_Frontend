import {
	VENDA_LOAD_PRODUTOS_DISPONIVEIS,
	VENDA_CHECKED_PROD,
	VENDA_MOVE_PRODUTOS_2_CARRINHO,
	VENDA_CHANGE_BUY_QTT,
	VENDA_MOVE_CARRINHO_2_PRODUTOS,
	VENDA_CLEAR_CART,
	VENDA_RESET_DETALHES,
	VENDA_DESTROY_STORE,
	VENDA_LOAD_CLIENTES,
	VENDA_CHANGE_CLIENTE,
	VENDA_CHANGE_TIPO_VENDA,
	VENDA_LOAD_PAGAMENTOS,
	VENDA_SET_COND_PAG,
	VENDA_SET_DEP_DESTINO,
	VENDA_SET_DEP_ORIGEM,
	VENDA_SET_OBS,
	VENDA_LOAD_DEPOSITOS,
	VENDA_EDIT_PEDIDO,
	VENDA_LOAD_CONSULTA_COLETAS_CARGA,
	VENDA_CHANGE_TAB_INDEX,
} from './VendasActionTypes';

export const LoadInsumos = (value) => ({
	type: VENDA_LOAD_PRODUTOS_DISPONIVEIS,
	Produtos: value,
});
export const LoadClientes = (value) => ({
	type: VENDA_LOAD_CLIENTES,
	Clientes: value,
});
export const LoadDepositos = (value) => ({
	type: VENDA_LOAD_DEPOSITOS,
	Depositos: value,
});
export const LoadPagamentos = (value) => ({
	type: VENDA_LOAD_PAGAMENTOS,
	pagamentos: value,
});
export const SwitchTab = (value) => ({
	type: VENDA_CHANGE_TAB_INDEX,
	tab: value,
});

export const SetCheckedProd = (value) => ({
	type: VENDA_CHECKED_PROD,
	value: value,
});

export const EditPedido = (value) => ({
	type: VENDA_EDIT_PEDIDO,
	PedidoId: value,
});

export const ChangeCliente = (value) => ({
	type: VENDA_CHANGE_CLIENTE,
	cliente: value,
});

export const ChangeTipoVenda = (value) => ({
	type: VENDA_CHANGE_TIPO_VENDA,
	tVenda: value,
});

export const SetCondPag = (value) => ({
	type: VENDA_SET_COND_PAG,
	cond: value,
});
export const SetDepOrigem = (value) => ({
	type: VENDA_SET_DEP_ORIGEM,
	dep: value,
});
export const SetDepDestino = (value) => ({
	type: VENDA_SET_DEP_DESTINO,
	dep: value,
});
export const SetObs = (value) => ({
	type: VENDA_SET_OBS,
	obs: value,
});

export const UpdateCarrinho = () => ({
	type: VENDA_MOVE_PRODUTOS_2_CARRINHO,
});

export const UpdateProdutos = () => ({
	type: VENDA_MOVE_CARRINHO_2_PRODUTOS,
});

export const SetBuyQtt = (value) => ({
	type: VENDA_CHANGE_BUY_QTT,
	ProdId: value.id,
	Qtd: value.value,
	campo: value.field,
});

export const SetColetaCarga = (value) => ({
	type: VENDA_LOAD_CONSULTA_COLETAS_CARGA,
	carga: value,
});

export const ResetarDetalhes = () => ({
	type: VENDA_RESET_DETALHES,
});

export const ClearCarrinho = () => ({
	type: VENDA_CLEAR_CART,
});

export const DestroyStore = () => ({
	type: VENDA_DESTROY_STORE,
});
