import React, { Component } from 'react';
import { api } from '../../services/api';

import { navigateTo } from '../../misc/commom_functions';

export default class autoLogin extends Component {
	async componentDidMount() {
		sessionStorage.clear();

		const code = this.props.match.params.code;
		const target = this.props.match.params.target;

		this.login(code, target);
	}

	async login(code, targetWindow) {
		try {
			const response = await api.post('/checkAuth', {
				code,
			});

			if (response.data.token) {
				sessionStorage.setItem('token', response.data.token);
				sessionStorage.setItem('role', response.data.role);
				sessionStorage.setItem('filial_logada', response.data.nome !== '');
				sessionStorage.setItem('usuário', response.data.nome);
				sessionStorage.setItem('links', JSON.stringify(response.data.Links));

				this.redirectWindow(targetWindow);
			} else {
				sessionStorage.clear();
				navigateTo('move', '/');
			}
		} catch (err) {
			navigateTo('move', '/');
		}
	}

	async redirectWindow(target) {
		switch (target) {
			case 'solicitacao':
				navigateTo('move', '/solicitacao');
				break;

			case 'compras':
				navigateTo('move', '/compras');
				break;

			case 'vendas':
				navigateTo('move', '/vendas');
				break;

			case 'equipamentos':
				navigateTo('move', '/equipamentos');
				break;

			case 'perfil':
				navigateTo('move', '/perfil');
				break;

			case 'clientes':
				navigateTo('move', '/clientes');
				break;

			case 'coletas':
				navigateTo('move', '/leituras');
				break;

			case 'pontodevenda':
				navigateTo('move', '/pontodevenda');
				break;

			default:
				navigateTo('move', '/');
		}
	}

	render() {
		return <div />;
	}
}
