import {
	LOAD_ATIVOS_DISPONIVEIS,
	LOAD_BEBIDAS_DISPONIVEIS,
	LOAD_CLIENTES_ENDERECOS,
	LOAD_CONFIGURACOES_PADRAO,
	LOAD_MIN_DDL_PARA_ENVIO,
	LOAD_AJUDAS,
	CHANGE_MAQUINA,
	CHANGE_PAG_TIPO,
	CHANGE_VALIDADOR_TIPO,
	CHANGE_VALIDADOR_FICHAS,
	CLICK_ADD_BEBIDA,
	CLICK_REMOVE_BEBIDA,
	CLEAR_CONFIG,
	CHANGE_BEBIDA_DETAILS_INDIVIDUALY,
	CHANGE_MAQUINA_CORPORATIVA,
	CHOOSE_INIBIR_COPOS,
	CHOOSE_ACOMPANHA_GABINETE,
	CHOOSE_ABASTECIMENTO_HIDRICO,
	CHOOSE_CHIP_TELEMETRIA,
	CHOOSE_ANTENA_EXTERNA,
	CHOOSE_CLIENTE,
	CHANGE_ENDERECO,
	CHOOSE_CONTATO,
	DATA_ENTREGA_DESEJADA,
	CHOOSE_EMAIL_ACOMPANHAMENTO,
	CHOOSE_TELEFONE_CONTATO,
	SET_OBSERVACAO,
	RESET,
} from './SolicitacaoActionTypes';

export const clickButton = (value) => ({
	type: CLICK_ADD_BEBIDA,
	Configuracao: value,
});

export const clickRemove = (value) => ({
	type: CLICK_REMOVE_BEBIDA,
	id: value,
});

export const clearConfig = () => ({
	type: CLEAR_CONFIG,
});

export const ChangePagamento = (value) => ({
	type: CHANGE_PAG_TIPO,
	PagType: value,
});

export const ChangeValidador = (value) => ({
	type: CHANGE_VALIDADOR_TIPO,
	TipoValidador: value,
});

export const ChangeValidadorFichas = (value) => ({
	type: CHANGE_VALIDADOR_FICHAS,
	Ficha: value,
});

export const LoadAtivos = (value) => ({
	type: LOAD_ATIVOS_DISPONIVEIS,
	Ativos: value,
});

export const LoadBebidas = (value) => ({
	type: LOAD_BEBIDAS_DISPONIVEIS,
	Bebidas: value,
});

export const LoadClientesEnderecos = (value) => ({
	type: LOAD_CLIENTES_ENDERECOS,
	CliEnd: value,
});

export const LoadConfigPadrao = (value) => ({
	type: LOAD_CONFIGURACOES_PADRAO,
	ConfigPadrao: value,
});

export const LoadMinDDL = (value) => ({
	type: LOAD_MIN_DDL_PARA_ENVIO,
	DDL: value,
});

export const LoadHelper = (value) => ({
	type: LOAD_AJUDAS,
	help: value,
});

export const ChangeMaquina = (value) => ({
	type: CHANGE_MAQUINA,
	MaquinaSelecionada: value,
});

export const ChangeCorporativa = (value) => ({
	type: CHANGE_MAQUINA_CORPORATIVA,
	Corp: value,
});

export const ChooseInibCopos = (value) => ({
	type: CHOOSE_INIBIR_COPOS,
	Inib: value,
});

export const ChooseGabinete = (value) => ({
	type: CHOOSE_ACOMPANHA_GABINETE,
	Gab: value,
});

export const ChooseAbastecimento = (value) => ({
	type: CHOOSE_ABASTECIMENTO_HIDRICO,
	Agua: value,
});

export const ChooseChip = (value) => ({
	type: CHOOSE_CHIP_TELEMETRIA,
	Chip: value,
});

export const ChooseAntena = (value) => ({
	type: CHOOSE_ANTENA_EXTERNA,
	Antena: value,
});

export const ChooseCliente = (value) => ({
	type: CHOOSE_CLIENTE,
	Cliente: value,
});

export const ChangeEndereco = (value) => ({
	type: CHANGE_ENDERECO,
	Endereco: value,
});

export const ChooseData = (value) => ({
	type: DATA_ENTREGA_DESEJADA,
	Data: value,
});

export const DefineContato = (value) => ({
	type: CHOOSE_CONTATO,
	Contato: value,
});

export const ChooseTelefone = (value) => ({
	type: CHOOSE_TELEFONE_CONTATO,
	Telefone: value,
});

export const ChooseEmail = (value) => ({
	type: CHOOSE_EMAIL_ACOMPANHAMENTO,
	Email: value,
});

export const DefineOBS = (value) => ({
	type: SET_OBSERVACAO,
	Obs: value,
});

export const ResetRequest = () => ({
	type: RESET,
});

export const ChangeBebidaDetailsManually = (value) => ({
	type: CHANGE_BEBIDA_DETAILS_INDIVIDUALY,
	changed: value,
});
