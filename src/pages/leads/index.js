import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { api } from '../../services/api';

import {
	LoadLeadsFranqueado,
	LoadLeadsGeral,
	LoadLeadsLimite,
} from '../../global/actions/LeadAction';

// import AdicionarLead from './modals/AddLead'
import Assumidos from './LeadsAssumidos';
import Disponiveis from './LeadsDisponiveis';

import { Panel } from '../../components/commom_in';
import Loading from '../../components/loading_screen';

function LeadsList(props) {
	const [Loaded, setLoaded] = useState(false);

	const { LoadLeadsFranqueado, LoadLeadsGeral, LoadLeadsLimite } = props;
	const { LeadsFranqueado, LeadsGeral, Limites } = props.State;

	useEffect(() => {
		async function load() {
			try {
				const response = await api.get('/leads');

				LoadLeadsFranqueado(response.data.LeadsFranqueado);
				LoadLeadsGeral(response.data.LeadsGeral);
				LoadLeadsLimite(response.data.Limites);
				setLoaded(true);
			} catch (err) {}
		}
		load();
		// eslint-disable-next-line
	}, []);

	return !Loaded ? (
		<Loading />
	) : (
		<Panel
			style={{
				alignItems: 'flex-start',
				padding: '16px',
				justifyContent: 'column',
				flexWrap: 'noWrap',
				overflow: 'auto',
			}}
		>
			{/* <AdicionarLead /> */}
			<Assumidos
				Leads={LeadsFranqueado}
				ContAssumidos={Limites[0].Tentativas}
				ContMax={Limites[0].MaxTentativas}
			/>
			<Disponiveis Leads={LeadsGeral} />
		</Panel>
	);
}

const mapStateToProps = (store) => ({
	State: store.leadsState,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			LoadLeadsFranqueado,
			LoadLeadsGeral,
			LoadLeadsLimite,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(LeadsList);
