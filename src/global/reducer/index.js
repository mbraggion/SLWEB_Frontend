import { SolicitacaoReducer } from './SolicitacaoReducer';
import { LeadsReducer } from './LeadReducer';
import { EtcReducer } from './EtcReducer';
import { ComprasReducer } from './ComprasReducer';
import { VendasReducer } from './VendasReducer';

import { combineReducers } from 'redux';

export const Reducers = combineReducers({
	solicitacaoState: SolicitacaoReducer,
	leadsState: LeadsReducer,
	EtcState: EtcReducer,
	CompraState: ComprasReducer,
	VendaState: VendasReducer,
});
