import React from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import clsx from 'clsx';
import 'react-calendar/dist/Calendar.css';

import {
	Assignment as AssignmentIcon,
	Receipt as ReceiptIcon,
	RecordVoiceOver as RecordVoiceOverIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import {
	RED_SECONDARY,
	ORANGE_SECONDARY,
	PRIMARY_YELLOW,
} from '../../misc/colors';

export const Calendar = ({ dates }) => {
	const classes = useStyles();

	const setClass = (date) => {
		try {
			const dateobj = dates.find((x) => {
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
					default:
						return classes.base;
				}
			} else {
				return classes.base;
			}
		} catch (err) {}
	};

	const setContent = (date) => {
		const retorno = [];
		const dateobj = dates.filter(
			(x) =>
				date.getDay() === new Date(x.date).getDay() &&
				date.getMonth() === new Date(x.date).getMonth() &&
				date.getDate() === new Date(x.date).getDate()
		);

		dateobj.forEach((o) => {
			switch (o.type) {
				case 'OS':
					retorno.push(<AssignmentIcon fontSize='small' />);
					break;
				case 'compra':
					retorno.push(<ReceiptIcon fontSize='small' />);
					break;
				case 'cliente':
					retorno.push(<RecordVoiceOverIcon fontSize='small' />);
					break;
				default:
					retorno.push(<div style={{ opacity: '0' }}>⚪️</div>);
					break;
			}
		});

		if (retorno.length === 0) {
			return <div style={{ opacity: '0' }}>⚪️</div>;
		} else {
			return retorno;
		}
	};

	return (
		<div>
			<h4 className={classes.title}>calendário</h4>
			<ReactCalendar
				view='month'
				calendarType='US'
				showNavigation={false}
				className={classes.calendar}
				tileClassName={({ date }) => setClass(date, classes)}
				tileContent={({ date }) => setContent(date, classes)}
				tileDisabled={() => true}
			/>
			<ul className={classes.lista}>
				{dates.map((d) => (
					<li className={classes.linha}>
						<strong>{d.date}</strong> - {d.type}
					</li>
				))}
			</ul>
		</div>
	);
};

const useStyles = makeStyles(() => ({
	title: {
		marginLeft: '1rem',
	},
	calendar: {
		boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
		border: 'none',
		borderRadius: '4px',
	},
	base: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#FFF !important',
		transition: 'all 200ms ease',
		borderRadius: '4px',

		'&:hover': {
			filter: 'brightness(0.9)',
		},
	},
	os: {
		fontWeight: 'bold',
		backgroundColor: `${ORANGE_SECONDARY} !important`,
	},
	invpilao: {
		fontWeight: 'bold',
		backgroundColor: `${PRIMARY_YELLOW} !important`,
	},
	compra: {
		fontWeight: 'bold',
		backgroundColor: `${RED_SECONDARY} !important`,
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
		padding: '8px 0 0 0',
	},
}));
