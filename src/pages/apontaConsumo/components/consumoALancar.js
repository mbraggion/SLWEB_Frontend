import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import {
	GREY_PRIMARY,
	GREY_SECONDARY,
	RED_PRIMARY,
} from '../../../misc/colors';

export const ConsumoALancar = ({ Consumo, Zerada }) => {
	const classes = useStyles();
	return (
		<div className={classes.historyBox}>
			<Typography className={classes.periodo}>
				<strong>Novo lançamento</strong>
			</Typography>
			<table className={classes.table}>
				<thead>
					<tr>
						<th className={classes.header}>Código</th>
						<th>Produto</th>
						<th>Qtd.</th>
					</tr>
				</thead>
				<tbody>
					{Array.isArray(Consumo)
						? Consumo.map((C) => (
								<tr>
									<td className={classes.cell} style={{ padding: '1rem 2rem' }}>
										{C.ProdId}
									</td>
									<td className={classes.cell} style={{ color: '#000' }}>
										{C.Produto}
									</td>
									<td
										className={classes.cell}
										style={{
											color: RED_PRIMARY,
											fontWeight: 'bold',
											textAlign: 'end',
										}}
									>
										- {Zerada ? C.TotalConsumo : C.Con}
									</td>
								</tr>
						  ))
						: null}
				</tbody>
			</table>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	table: {
		width: '100%',
		borderSpacing: '0 0.5rem',
		border: `1px solid ${GREY_PRIMARY}`,
	},
	header: {
		color: '#333',
		fontWeight: '400',
		padding: '1rem 2rem',
		textAlign: 'left',
		lineHeight: '1.5rem',
	},
	cell: {
		padding: '0px 1rem',
		border: '0',
		background: '#fff',
		color: '#969CB3',
		borderRadius: '0.25rem',
	},
	historyBox: {
		borderBottom: `1px solid ${GREY_PRIMARY}`,
		fontSize: '0.7rem',
		borderRadius: '0.25rem',
		margin: '0 0 1rem 0',
		width: '100%',
	},
	periodo: {
		textAlign: 'center',
		width: '100%',
		background: GREY_PRIMARY,
		color: '#FFF',
		borderRadius: '0.25rem 0.25rem 0 0',
	},
	reverter: {
		textAlign: 'center',
		width: '100%',
		background: GREY_SECONDARY,
		color: '#FFF',
		borderRadius: '0 0 0.25rem 0.25rem',
		cursor: 'pointer',
		padding: '0.2rem 0',
	},
}));
