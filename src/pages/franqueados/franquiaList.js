import React from 'react';

import { makeStyles } from '@material-ui/core';

import { FranquiaItem } from './franquiaItem';

export const FranquiaList = ({ Franquias, onOpenDetailsModal }) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			{Franquias.map((fr) => (
				<FranquiaItem
					key={fr.M0_CODFIL}
					Franquia={fr}
					onOpenDetailsModal={onOpenDetailsModal}
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
		alignItems: 'center',
		justifyContent: 'space-evenly',
		paddingTop: '8px',

		'@media (max-width: 800px)': {
			maxHeight: 'calc(100% - 150px)',
		},
	},
}));
