import React from 'react';
import moment from 'moment';

import { makeStyles } from '@material-ui/styles';

export const Titulos = ({ duplicatas }) => {
	const classes = useStyles();

	return duplicatas.length > 0 ? (
		<div>
			<h4 className={classes.title}>títulos</h4>
			<div className={classes.tableContainer}>
				<table className={classes.table}>
					<thead>
						<tr>
							<th className={classes.tableHeader}></th>
							<th className={classes.tableHeader}>descrição</th>
							<th className={classes.tableHeader}>valor</th>
							<th className={classes.tableHeader}>vencimento</th>
						</tr>
					</thead>
					<tbody>
						{duplicatas.map((duplicata) => (
							<tr>
								<td className={classes.tableCell}>{duplicata.E1_NUM}</td>
								<td className={classes.tableCell}>{duplicata.E1Desc}</td>
								<td className={classes.tableCell}>
									{new Intl.NumberFormat('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									}).format(duplicata.E1_SALDO)}
								</td>
								<td className={classes.tableCell}>
									{moment(duplicata.DtVenc).format('DD/MM/YYYY')}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	) : null;
};

const useStyles = makeStyles(() => ({
	tableContainer: {
		boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.2)',
		borderRadius: '4px'
	},
	title: {
		marginLeft: '1rem'
	},
	table: {
		all: 'unset',
		borderSpacing: '0 0.5rem',
	},
	tableHeader: {
		color: '#949494',
		fontWeight: '400',
		padding: '1rem 2rem',
		textAlign: 'left',
		lineHeight: '1.5rem',
		fontSize: '1.3rem',
	},
	tableCell: {
		padding: '.5rem 2rem .5rem 2rem',
		border: '0',
		color: '#333',
		borderRadius: '0.25rem',

		'&:first-child': {
			color: '#333',
		},
		'&:nth-child(2)': {
			color: '#FF2525',
			fontWeight: 'bold',
			textTransform: 'uppercase',
		},
		'&:nth-child(4)': {
			color: '#000',
			fontWeight: 'bold',
			fontSize: '1rem',
		},
	},
}));
