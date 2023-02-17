import React from 'react';

import MenuAbas from '../../components/materialComponents/PainelAbas';
import { Logs } from './logs';
import Segmentos from './solicitacao';

import { Panel } from '../../components/commom_in';

class Solicitacao extends React.Component {
	render() {
		return (
			<Panel
				style={{
					overflow: 'auto',
					alignContent: 'center',
					padding: '0px',
					justifyContent: 'flex-start',
				}}
			>
				<MenuAbas titles={['Solicitar', 'Solicitações']}>
					<Segmentos />
					<Logs />
				</MenuAbas>
			</Panel>
		);
	}
}

export default Solicitacao;
