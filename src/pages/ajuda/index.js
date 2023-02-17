import React from 'react';

import { Panel } from '../../components/commom_in';

function Ajuda() {
	return (
		<Panel>
			<h5>No momento não possuimos suporte online</h5>
			<p>
				Para receber assistencia, entre em contato com:{' '}
				<strong style={{ fontWeight: 'bold' }}>(11) 99804-5826</strong>
			</p>
			<p>
				Ou por email com:{' '}
				<strong style={{ fontWeight: 'bold' }}>helpdesk@slaplic.com.br</strong>
			</p>
		</Panel>
	);
}

export default Ajuda;
