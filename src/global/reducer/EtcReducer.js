import { OVERFLOW_AUTO, OVERFLOW_HIDDEN } from '../actions/EtcActionTypes';

const initialState = {
	overflow: 'auto',
};

export const EtcReducer = (state = initialState, action) => {
	switch (action.type) {
		case OVERFLOW_AUTO:
			return {
				...state,
				overflow: action.over,
			};
		case OVERFLOW_HIDDEN:
			return {
				...state,
				overflow: action.over,
			};

		default:
			return state;
	}
};
