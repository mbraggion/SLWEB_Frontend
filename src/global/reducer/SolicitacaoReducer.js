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
	CHANGE_MAQUINA_CORPORATIVA,
	CHOOSE_INIBIR_COPOS,
	CHOOSE_ACOMPANHA_GABINETE,
	CHOOSE_ABASTECIMENTO_HIDRICO,
	CHOOSE_CHIP_TELEMETRIA,
	CHOOSE_ANTENA_EXTERNA,
	CHOOSE_CLIENTE,
	CHANGE_ENDERECO,
	DATA_ENTREGA_DESEJADA,
	CHOOSE_CONTATO,
	CHOOSE_TELEFONE_CONTATO,
	CHOOSE_EMAIL_ACOMPANHAMENTO,
	SET_OBSERVACAO,
	RESET,
	CHANGE_BEBIDA_DETAILS_INDIVIDUALY,
} from '../actions/SolicitacaoActionTypes';

export const SolicitacaoReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_ATIVOS_DISPONIVEIS:
			return {
				...state,
				AtivosDisponiveis: action.Ativos,
			};
		case LOAD_BEBIDAS_DISPONIVEIS:
			return {
				...state,
				BebidasDisponiveis: action.Bebidas,
			};
		case LOAD_CLIENTES_ENDERECOS:
			return {
				...state,
				ClientesEnderecos: action.CliEnd,
			};
		case LOAD_CONFIGURACOES_PADRAO:
			return {
				...state,
				ConfiguracoesPadrao: action.ConfigPadrao,
			};
		case LOAD_MIN_DDL_PARA_ENVIO:
			return {
				...state,
				MinDDLEnvio: action.DDL,
			};
		case LOAD_AJUDAS:
			return {
				...state,
				Ajudas: action.help,
			};

		case CHANGE_MAQUINA:
			return {
				...state,
				MaquinaId: action.MaquinaSelecionada.MaqModId,
				Maquina: action.MaquinaSelecionada.MaqModelo,
				PermiteGab: action.MaquinaSelecionada.PerGab,
				Capacidade: action.MaquinaSelecionada.MaqCapacidade,
				MaxContenedores: action.MaquinaSelecionada.Contenedores,
			};

		case CLICK_ADD_BEBIDA:
			let novoContenedor = null;
			if (action.Configuracao.bebida === 'ÁGUA QUENTE') {
				//se a bebida for agua quente é só ignorar o contenedor
				novoContenedor = [...state.Contenedor];
			} else if (action.Configuracao.tipo === 'Mistura') {
				//se a bebida for do tipo mistura

				//aqui eu separo os contenedores que a bebida usa, ex cont = '105' = [1, 5]
				novoContenedor = [...state.Contenedor].concat(
					JSON.parse(
						'[' +
							String(action.Configuracao.contenedor).replace(/0/g, ',') +
							']'
					)
				);

				//aqui eu "somo" dois arrays sem duplicar elementos, ex: [1, 5, 9] + [1, 3, 7] = [1, 3, 5, 7 ,9]
				novoContenedor = [
					...new Set([
						...state.Contenedor,
						...JSON.parse(
							'[' +
								String(action.Configuracao.contenedor).replace(/0/g, ',') +
								']'
						),
					]),
				];
			} else if (state.Contenedor.indexOf(action.Configuracao.contenedor) < 0) {
				//aqui é se a bebida for pronta e o contenedor ainda não estiver configurado
				novoContenedor = [...state.Contenedor];
				novoContenedor.push(action.Configuracao.contenedor);
			} else {
				//aqui é se a bebida pronta já tiver o contenedor configurado
				novoContenedor = [...state.Contenedor];
			}

			//ordenação da configuração
			let auxiliar = [...state.Configuracao, action.Configuracao];
			let novaConfiguracao = [];
			auxiliar.map((config) => {
				novaConfiguracao[config.selecao] = config;
				return null;
			});
			let Filtrado = novaConfiguracao.filter(function (el) {
				return el != null;
			});

			return {
				...state,
				Contenedor: novoContenedor,
				Configuracao: Filtrado,
			};
		case CLICK_REMOVE_BEBIDA:
			const removedBebida = state.Configuracao.filter(
				(config) => Number(config.id) === Number(action.id)
			)[0];

			const removedBebidaCont =
				removedBebida.tipo === 'Mistura'
					? JSON.parse(
							'[' + String(removedBebida.contenedor).replace(/0/g, ',') + ']'
					  )
					: removedBebida.contenedor;

			let contenedoresNecessariosRestantes = [];
			// let state.Contenedor = [...state.Contenedor]

			state.Configuracao.forEach((config) => {
				if (config.tipo === null) {
					return null;
				} else if (config.tipo === 'Mistura') {
					contenedoresNecessariosRestantes = [
						...contenedoresNecessariosRestantes,
					].concat(
						JSON.parse('[' + String(config.contenedor).replace(/0/g, ',') + ']')
					);

					contenedoresNecessariosRestantes = [
						...new Set([
							...contenedoresNecessariosRestantes,
							...JSON.parse(
								'[' + String(config.contenedor).replace(/0/g, ',') + ']'
							),
						]),
					];

					return null;
				} else if (
					contenedoresNecessariosRestantes.indexOf(config.contenedor) < 0
				) {
					contenedoresNecessariosRestantes.push(config.contenedor);
					return null;
				} else {
					return null;
				}
			});

			if (Array.isArray(removedBebidaCont)) {
				removedBebidaCont.map((rem) => {
					if (contenedoresNecessariosRestantes.indexOf(rem) < 0) {
						state.Contenedor.splice(state.Contenedor.indexOf(rem), 1);
					}
					return null;
				});
			} else {
				if (
					contenedoresNecessariosRestantes.indexOf(removedBebidaCont) < 0 &&
					removedBebida.bebida !== 'ÁGUA QUENTE'
				) {
					state.Contenedor.splice(
						state.Contenedor.indexOf(removedBebidaCont),
						1
					);
				}
			}

			return {
				...state,
				Contenedor: [...state.Contenedor],
				Configuracao: state.Configuracao.filter(
					(config) => Number(config.id) !== Number(action.id)
				),
			};
		case CHANGE_BEBIDA_DETAILS_INDIVIDUALY:
			//guardo os valores antigos da bebida
			let bebidaOld = state.Configuracao.filter(
				(conf) => Number(conf.id) === Number(action.changed.id)
			)[0];
			let auxConfiguracao = [...state.Configuracao];

			if (action.changed.field === 'selecao') {
				//caso o cara troque a seleção

				//testar se o cara nao ta tentando trocar pela MESMA seleção
				if (Number(bebidaOld.selecao) === Number(action.changed.value)) {
					return {
						...state,
					};
				}

				let valid = true;

				//validar se a nova seleção que o cara escolheu está disponivel
				for (let index in state.Configuracao) {
					if (
						Number(state.Configuracao[index].selecao) ===
						Number(action.changed.value)
					) {
						valid = false;
						break;
					}
				}

				if (!valid) {
					//se o novo numero de seleção não for valido eu volto o anterior
					for (let index in auxConfiguracao) {
						if (auxConfiguracao[index].id === bebidaOld.id) {
							auxConfiguracao[index].selecao = bebidaOld.selecao;
							break;
						}
					}

					return {
						...state,
						Configuracao: auxConfiguracao,
					};
				} else {
					//se estiver disponivel trocar
					for (let index in auxConfiguracao) {
						if (auxConfiguracao[index].id === bebidaOld.id) {
							auxConfiguracao[index].selecao = action.changed.value;
							break;
						}
					}

					return {
						...state,
						Configuracao: auxConfiguracao,
					};
				}
			} else if (
				action.changed.field === 'valor' ||
				action.changed.field === 'valor2'
			) {
				if (
					(state.Pagamento === 'Validador' ||
						state.Pagamento === 'Cartão e Validador') &&
					state.TipoValidador === 'Ficha'
				) {
					let ficha = null;

					state.Validador.forEach((pos) => {
						if (pos.charAt(0) === 'F') {
							ficha = pos;
						}
					});

					//valor incopativel com ficha
					if (
						Number(String(action.changed.value).replace(/,/g, '.')) %
							Number(ficha.replace('F', '')) >
						0
					) {
						for (let index in auxConfiguracao) {
							if (auxConfiguracao[index].id === bebidaOld.id) {
								auxConfiguracao[index][action.changed.field] =
									bebidaOld[action.changed.field];
								break;
							}
						}

						return {
							...state,
							Configuracao: auxConfiguracao,
						};
					} else {
						//valor compativel com ficha
						for (let index in auxConfiguracao) {
							if (auxConfiguracao[index].id === bebidaOld.id) {
								auxConfiguracao[index][action.changed.field] =
									action.changed.value;
								break;
							}
						}

						return {
							...state,
							Configuracao: auxConfiguracao,
						};
					}
				} else {
					//valor não tem regra para substituir
					for (let index in auxConfiguracao) {
						if (auxConfiguracao[index].id === bebidaOld.id) {
							auxConfiguracao[index][action.changed.field] =
								action.changed.value;
							break;
						}
					}

					return {
						...state,
						Configuracao: auxConfiguracao,
					};
				}
			}
			break;

		case CHANGE_PAG_TIPO:
			return {
				...state,
				Pagamento: action.PagType,
				TipoValidador:
					action.PagType === 'Validador' ||
					action.PagType === 'Cartão e Validador'
						? 'Moeda'
						: null,
				Validador:
					action.PagType === 'Validador' ||
					action.PagType === 'Cartão e Validador'
						? ['0.05', '0.10', '0.25', '0.50', '1.00']
						: [],
			};

		case CHANGE_VALIDADOR_TIPO:
			return {
				...state,
				TipoValidador: action.TipoValidador,
				Validador:
					action.TipoValidador === 'Ficha'
						? ['F1']
						: ['0.05', '0.10', '0.25', '0.50', '1.00'],
			};

		case CHANGE_VALIDADOR_FICHAS:
			let aux = [];
			if (isNaN(Number(action.Ficha.charAt(0)))) {
				aux = [...state.Validador];
				let achou = false;
				state.Validador.forEach((pos, i) => {
					if (pos.charAt(0) === 'F') {
						aux[i] = action.Ficha;
						achou = true;
					}
				});

				if (achou === false) {
					aux.push(action.Ficha);
				}

				return {
					...state,
					Validador: aux,
				};
			} else {
				if (state.Validador.indexOf(action.Ficha) < 0) {
					state.Validador.push(action.Ficha);
				} else {
					state.Validador.splice(state.Validador.indexOf(action.Ficha), 1);
				}

				return {
					...state,
					Validador: [...state.Validador],
				};
			}

		case CHANGE_MAQUINA_CORPORATIVA:
			return {
				...state,
				Corporativa: action.Corp,
			};
		case CHOOSE_INIBIR_COPOS:
			return {
				...state,
				InibirCopos: action.Inib,
			};
		case CHOOSE_ACOMPANHA_GABINETE:
			return {
				...state,
				Gabinete: action.Gab,
			};
		case CHOOSE_ABASTECIMENTO_HIDRICO:
			return {
				...state,
				Abastecimento: action.Agua,
			};
		case CHOOSE_CHIP_TELEMETRIA:
			return {
				...state,
				Chip: action.Chip,
			};
		case CHOOSE_ANTENA_EXTERNA:
			return {
				...state,
				AntExt: action.Antena,
			};

		case CHOOSE_CLIENTE:
			return {
				...state,
				Cliente_Destino: action.Cliente.Nome_Fantasia,
				CNPJ_Destino: action.Cliente.CNPJss,
			};
		case CHANGE_ENDERECO:
			return {
				...state,
				Endereço_Entrega: action.Endereco,
			};
		case DATA_ENTREGA_DESEJADA:
			return {
				...state,
				Data_Entrega_Desejada: action.Data,
			};
		case CHOOSE_CONTATO:
			return {
				...state,
				Contato: action.Contato,
			};
		case CHOOSE_TELEFONE_CONTATO:
			return {
				...state,
				Telefone_Contato: action.Telefone,
			};
		case CHOOSE_EMAIL_ACOMPANHAMENTO:
			return {
				...state,
				Email_Acompanhamento: action.Email,
			};
		case SET_OBSERVACAO:
			return {
				...state,
				Observacao: action.Obs,
			};
		case CLEAR_CONFIG:
			return {
				...state,
				Configuracao: [],
				Contenedor: [],
			};

		case RESET:
			return { ...state, ...resetedState };

		default:
			return state;
	}
};

const initialState = {
	AtivosDisponiveis: [],
	BebidasDisponiveis: [],
	ClientesEnderecos: [],
	ConfiguracoesPadrao: [],
	Ajudas: [],
	MinDDLEnvio: 0,

	MaquinaId: '',
	Maquina: '',
	PermiteGab: false,
	Capacidade: 0,
	MaxContenedores: 0,

	Contenedor: [],
	Configuracao: [],
	Pagamento: '',
	Validador: [],
	TipoValidador: null,

	InibirCopos: '',
	Corporativa: '',
	Gabinete: false,
	Abastecimento: '',
	Chip: '',
	AntExt: '',

	Cliente_Destino: '',
	CNPJ_Destino: '',
	Endereço_Entrega: '',
	Data_Entrega_Desejada: '',
	Contato: '',
	Email_Acompanhamento: '',
	Telefone_Contato: '',
	Observacao: '',
};

const resetedState = {
	ConfiguracoesPadrao: [],

	MaquinaId: '',
	Maquina: '',
	PermiteGab: false,
	Capacidade: 0,
	MaxContenedores: 0,

	Contenedor: [],
	Configuracao: [],
	Pagamento: '',
	Validador: [],
	TipoValidador: null,

	InibirCopos: '',
	Corporativa: '',
	Gabinete: false,
	Abastecimento: '',
	Chip: '',
	AntExt: '',

	Cliente_Destino: '',
	CNPJ_Destino: '',
	Endereço_Entrega: '',
	Data_Entrega_Desejada: '',
	Contato: '',
	Email_Acompanhamento: '',
	Telefone_Contato: '',
	Observacao: '',
};
