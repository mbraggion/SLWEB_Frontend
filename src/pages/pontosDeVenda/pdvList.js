import React from 'react';

import { PdvItem } from './pdvItem';
import { makeStyles } from '@material-ui/core';

export const PdvList = ({ PDVs, onOpenModal }) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			{PDVs.map((pdv, index) => (
				<PdvItem
					// key={`${pdv.PdvId}${pdv.AnxId}`}
					PDV={pdv}
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
		alignItems: 'center',
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
