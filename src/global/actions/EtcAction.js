import { OVERFLOW_AUTO, OVERFLOW_HIDDEN } from './EtcActionTypes';

export const OverflowOn = () => ({
	type: OVERFLOW_AUTO,
	over: 'auto',
});

export const OverflowOff = () => ({
	type: OVERFLOW_HIDDEN,
	over: 'hidden',
});
