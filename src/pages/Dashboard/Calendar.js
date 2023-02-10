import React from 'react';
import ReactCalendar from 'react-calendar';
import clsx from 'clsx';
import 'react-calendar/dist/Calendar.css';

import {
	AccountBalance as AccountBalanceIcon,
	RemoveShoppingCart as RemoveShoppingCartIcon,
	EventAvailable as EventAvailableIcon,
	EventNote as EventNoteIcon,
	Assignment as AssignmentIcon,
	Receipt as ReceiptIcon,
	Store as StoreIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import {
	BLUE_SECONDARY,
	RED_SECONDARY,
	GREEN_SECONDARY,
	ORANGE_SECONDARY,
	GREY_PRIMARY,
	GREY_SECONDARY,
	PRIMARY_YELLOW,
} from '../../misc/colors';

const dateArray = [
	{ date: '2023-01-26T00:00:00.000000Z', type: 'DREI' },
	{ date: '2023-02-25T03:00:00.000000Z', type: 'DREF' },
	{ date: '2023-02-26T03:00:00.000000Z', type: 'DREI' },
	{ date: '2023-02-06T09:47:17.456000Z', type: 'InvFranq' },
	{ date: '2023-01-30T09:47:17.456000Z', type: 'InvPilao' },
	{ date: '2023-01-31T09:47:17.456000Z', type: 'InvPilao' },
	{ date: '2023-02-01T09:47:17.456000Z', type: 'InvPilao' },
	{ date: '2023-02-02T09:47:17.456000Z', type: 'InvPilao' },

	{ date: '2023-02-15T09:47:17.456000Z', type: 'OS' },
	{ date: '2023-02-16T09:47:17.456000Z', type: 'compra' },
];

export const Calendar = (dates) => {
	const classes = useStyles();
	return (
		<div>
			<ReactCalendar
				view='month'
				calendarType='US'
				showNavigation={false}
				tileClassName={({ date }) => setClass(date, classes)}
				tileContent={({ date }) => setContent(date, classes)}
				tileDisabled={() => true}
			/>
			<ul className={classes.lista}>
				<li className={classes.linha}><strong>xx/xx/xxxx</strong> - Previsão de entrega de OS</li>
				<li className={classes.linha}><strong>xx/xx/xxxx</strong> - Vencimento de título 123456789</li>
				<li className={classes.linha}><strong>xx/xx/xxxx</strong> - Vencimento de título 987654321</li>
				<li className={classes.linha}><strong>xx/xx/xxxx</strong> - Faturamento do cliente Fulano</li>
			</ul>
		</div>
	);
};

const setClass = (date, classes) => {
	try {
		const dateobj = dateArray.find((x) => {
			return (
				date.getDay() === new Date(x.date).getDay() &&
				date.getMonth() === new Date(x.date).getMonth() &&
				date.getDate() === new Date(x.date).getDate()
			);
		});

		if (dateobj) {
			switch (dateobj.type) {
				case 'InvPilao':
					return clsx(classes.base, classes.invpilao);
				case 'DREI':
					return clsx(classes.base, classes.drei);
				case 'DREF':
					return clsx(classes.base, classes.dref);
				default:
					return classes.base;
			}
		} else {
			return classes.base;
		}
	} catch (err) {}
};

const setContent = (date, classes) => {
	try {
		const dateobj = dateArray.find((x) => {
			return (
				date.getDay() === new Date(x.date).getDay() &&
				date.getMonth() === new Date(x.date).getMonth() &&
				date.getDate() === new Date(x.date).getDate()
			);
		});

		if (dateobj) {
			switch (dateobj.type) {
				case 'OS':
					return <AssignmentIcon fontSize='small' />;
				case 'InvFranq':
					return <StoreIcon fontSize='small' />;
				case 'InvPilao':
					return <RemoveShoppingCartIcon fontSize='small' />;
				case 'compra':
					return <ReceiptIcon fontSize='small' />;
				case 'DREI':
					return <EventNoteIcon fontSize='small' />;
				case 'DREF':
					return <EventAvailableIcon fontSize='small' />;
				default:
					return <div style={{ opacity: '0' }}>⚪️</div>;
			}
		} else {
			return <div style={{ opacity: '0' }}>⚪️</div>;
		}
	} catch (err) {}
};

const useStyles = makeStyles(() => ({
	base: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#FFF !important',
		transition: 'all 200ms ease',
		// color: '#1b1b1b !important',
		borderRadius: '4px',

		'&:hover': {
			filter: 'brightness(0.9)',
		},
	},
	os: {
		fontWeight: 'bold',
		backgroundColor: `${ORANGE_SECONDARY} !important`,
	},
	invfranq: {
		fontWeight: 'bold',
		backgroundColor: `${GREEN_SECONDARY} !important`,
	},
	invpilao: {
		fontWeight: 'bold',
		backgroundColor: `${PRIMARY_YELLOW} !important`,
	},
	compra: {
		fontWeight: 'bold',
		backgroundColor: `${RED_SECONDARY} !important`,
	},
	drei: {
		fontWeight: 'bold',
		backgroundColor: `${GREY_PRIMARY} !important`,
	},
	dref: {
		fontWeight: 'bold',
		backgroundColor: `${GREY_SECONDARY} !important`,
	},
	lista: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginLeft: '8px',
	},
	linha: {
		width: '100%',
		lineHeight: '1rem',
		fontSize: '1rem',
		padding: '8px 0 0 0'
	}
}));
