import React, { useState } from 'react';

import { CircularProgress, makeStyles, Typography } from '@material-ui/core';

import { InvListItem } from './invListItem';

export const InventarioList = ({
	Inventario,
	updateInventory,
	isFetching,
	selectedDepId,
	selectedRef,
	isRefSelected,
}) => {
	const [expandedProdId, setExpandedProdId] = useState(null);
	const classes = useStyles();

	const handleExpandProd = (expandedId) => {
		setExpandedProdId((oldState) => {
			if (expandedId === oldState) {
				return null;
			} else {
				return expandedId;
			}
		});
	};

	const whichContentShow = () => {
		if (isFetching) {
			return (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						width: '100%',
					}}
				>
					<CircularProgress />
				</div>
			);
		} else if (
			isRefSelected &&
			Inventario !== null &&
			Array.isArray(Inventario.InvDetalhes)
		) {
			return (
				<section className={classes.root}>
					{Inventario.InvDetalhes.map((inv) => (
						<InvListItem
							InvItem={inv}
							isInventoryClosed={Inventario.status === 'fechado'}
							updateInventory={updateInventory}
							expandedId={expandedProdId}
							onExpandProd={handleExpandProd}
							selectedDepId={selectedDepId}
							selectedRef={selectedRef}
						/>
					))}
				</section>
			);
		} else if (
			isRefSelected &&
			Inventario !== null &&
			Inventario.InvDetalhes === null
		) {
			return (
				<section
					className={classes.root}
					style={{
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant='h6'>Inventário ainda não lançado.</Typography>
				</section>
			);
		} else {
			return null;
		}
	};

	return whichContentShow();
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		overflowY: 'auto',
		background: 'rgba(0,0,0,0.08)',
	},
}));
