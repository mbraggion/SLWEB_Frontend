import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { RED_PRIMARY, RED_SECONDARY } from '../../../misc/colors';

export const ConsumoLancado = ({ Consumo, onDeleteLancamento }) => {
	const classes = useStyles();
	return (
		<div className={classes.historyBox}>
			<Typography className={classes.periodo}>
				<strong>{Consumo.DtIni} </strong> &#x2192;{' '}
				<strong>{Consumo.DtFim}</strong>
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
					{Array.isArray(Consumo.Det)
						? Consumo.Det.map((D) => (
								<tr>
									<td className={classes.cell} style={{ padding: '1rem 2rem' }}>
										{D.ProdId}
									</td>
									<td className={classes.cell} style={{ color: '#000' }}>
										{D.Produto}
									</td>
									<td
										className={classes.cell}
										style={{
											color: RED_PRIMARY,
											fontWeight: 'bold',
											textAlign: 'end',
										}}
									>
										- {D.D_QUANT}
									</td>
								</tr>
						  ))
						: null}
				</tbody>
			</table>
			<Typography
				className={classes.reverter}
				onClick={() => onDeleteLancamento(Consumo.DOC)}
			>
				<strong>Reverter lançamento</strong>
			</Typography>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	table: {
		width: '100%',
		borderSpacing: '0 0.5rem',
		border: `1px solid ${RED_PRIMARY}`,
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
		fontSize: '0.7rem',
		borderRadius: '0.25rem',
		margin: '0px 0px 1rem 0px',
		width: '100%',
	},
	periodo: {
		textAlign: 'center',
		width: '100%',
		background: RED_PRIMARY,
		color: '#FFF',
		borderRadius: '0.25rem 0.25rem 0 0',
	},
	reverter: {
		textAlign: 'center',
		width: '100%',
		background: RED_SECONDARY,
		color: '#FFF',
		borderRadius: '0 0 0.25rem 0.25rem',
		cursor: 'pointer',
		padding: '0.2rem 0',
	},
}));
