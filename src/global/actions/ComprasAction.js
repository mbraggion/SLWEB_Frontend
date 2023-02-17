import {
	COMPRA_LOAD_PRODUTOS_DISPONIVEIS,
	COMPRA_CLEAR_CART,
	COMPRA_DESTROY_STORE,
	COMPRA_CHANGE_TAB_INDEX,
	COMPRA_CHECKED_PROD,
	COMPRA_CHANGE_BUY_QTT,
	COMPRA_MOVE_CARRINHO_2_PRODUTOS,
	COMPRA_MOVE_PRODUTOS_2_CARRINHO,
	COMPRA_SET_MIN_COMPRA,
	COMPRA_SET_RETIRA,
	COMPRA_LOAD_MULTIPLICADOR_DESCONTO,
} from './ComprasActionTypes';

export const LoadInsumos = (value) => ({
	type: COMPRA_LOAD_PRODUTOS_DISPONIVEIS,
	Produtos: value,
});

export const LoadMultiplicador = (value) => ({
	type: COMPRA_LOAD_MULTIPLICADOR_DESCONTO,
	Multiplicador: value,
});

export const SetMin = (value) => ({
	type: COMPRA_SET_MIN_COMPRA,
	min: value,
});

export const SetPodeRetirar = (value) => ({
	type: COMPRA_SET_RETIRA,
	retira: value,
});

export const ClearCarrinho = () => ({
	type: COMPRA_CLEAR_CART,
});

export const DestroyStore = () => ({
	type: COMPRA_DESTROY_STORE,
});

export const ChangeTab = (value) => ({
	type: COMPRA_CHANGE_TAB_INDEX,
	Tab: value,
});

export const SetCheckedProd = (value) => ({
	type: COMPRA_CHECKED_PROD,
	value: value,
});

export const SetBuyQtt = (value) => ({
	type: COMPRA_CHANGE_BUY_QTT,
	ProdId: value.id,
	Qtd: value.value,
});

export const UpdateProdutos = () => ({
	type: COMPRA_MOVE_CARRINHO_2_PRODUTOS,
});

export const UpdateCarrinho = () => ({
	type: COMPRA_MOVE_PRODUTOS_2_CARRINHO,
});
