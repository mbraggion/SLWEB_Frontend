import {
	LOAD_LEADS_FRANQUEADO,
	LOAD_LEADS_GERAL,
	LOAD_LEADS_LIMITE,
	ADD_LIMITE,
	SUB_LIMITE,
	MOVE_LEAD,
	UPD_LEAD,
} from './LeadActionTypes';

export const LoadLeadsGeral = (value) => ({
	type: LOAD_LEADS_GERAL,
	leads: value,
});

export const LoadLeadsFranqueado = (value) => ({
	type: LOAD_LEADS_FRANQUEADO,
	leads: value,
});

export const LoadLeadsLimite = (value) => ({
	type: LOAD_LEADS_LIMITE,
	limites: value,
});

export const AddLimite = () => ({
	type: ADD_LIMITE,
});

export const SubLimite = () => ({
	type: SUB_LIMITE,
});

export const MoveLinha = (lead) => ({
	type: MOVE_LEAD,
	Lead: lead,
});

export const UpdateLinha = (lead) => ({
	type: UPD_LEAD,
	Lead: lead,
});
