import React from 'react';

import { ClientItem } from './clientItem';
import { makeStyles } from '@material-ui/core';

export const ClientList = ({ Clientes, onOpenModal }) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			{Clientes.map((cliente, index) => (
				<ClientItem
					key={`${String(cliente.A1_COD).trim()}${String(
						cliente.A1_LOJA
					).trim()}`}
					Cliente={cliente}
					i={index}
					onOpenModal={onOpenModal}
				/>
			))}
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%',
		maxHeight: 'calc(100% - 100px)',
		background: 'unset',
		overflowY: 'auto',
		overflowX: 'hidden',
		alignItems: 'flex-start',
		justifyContent: 'space-evenly',
		borderRadius: '0px 0px 4px 4px',
		borderBottom: `5px solid #000`,
		borderLeft: `1px solid #000`,
		borderRight: `1px solid #000`,
		borderTop: `1px solid #CCC`,
		paddingTop: '8px',

		'@media (max-width: 800px)': {
			maxHeight: 'calc(100% - 150px)',
		},
	},
}));
