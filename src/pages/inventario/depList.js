import React from 'react';

import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Typography,
	useMediaQuery,
} from '@material-ui/core';
import { AllInbox as AllInboxIcon } from '@material-ui/icons';

import { GREY_PRIMARY, RED_PRIMARY } from '../../misc/colors';

export const DepositosList = ({
	Depositos,
	onSelectDeposito,
	SelectedDepId,
}) => {
	const isMdUp = useMediaQuery('@media (min-width: 1080px)');

	const classes = useStyles({ isMdUp });

	const handleListItemClick = (DepId, index) => {
		onSelectDeposito(DepId);
	};

	return (
		<div className={classes.root}>
			<Typography className={classes.subheader}>Depósitos</Typography>

			<List
				className={classes.list}
				component='nav'
				aria-label='main mailbox folders'
			>
				{Depositos.map((dep, i) => (
					<ListItem
						style={{
							borderLeft: `4px solid ${
								SelectedDepId === dep.DepId ? RED_PRIMARY : GREY_PRIMARY
							}`,
						}}
						divider
						key={dep.DepId}
						button
						selected={SelectedDepId === dep.DepId}
						onClick={() => handleListItemClick(dep.DepId)}
					>
						<ListItemIcon>
							<AllInboxIcon
								color={SelectedDepId === dep.DepId ? 'primary' : 'secondary'}
							/>
						</ListItemIcon>
						<ListItemText primary={dep.DepNome} />
					</ListItem>
				))}
			</List>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	root: (props) => ({
		height: 'calc(100% - 63px)',
		width: props.isMdUp ? '360px' : '100%',
		color: '#000',
		margin: props.isMdUp ? '0px 8px 0px 0px' : '0px 8px',
	}),
	subheader: {
		padding: '16px 0px 16px 16px',
		fontSize: '20px',
		borderBottom: '1px solid #CCC',
	},
	list: (props) => ({
		height: '100%',
		width: props.isMdUp ? '360px' : '100%',
		color: '#000',
		overflow: 'auto',
		padding: '0px',
	}),
}));
