import React from 'react';
import moment from 'moment';

import { makeStyles, Typography } from '@material-ui/core';
import { Face } from '@material-ui/icons';

import { RED_PRIMARY, GREY_SECONDARY } from '../../misc/colors';

export const ClientItem = ({ Cliente, i, onOpenModal }) => {
	const classes = useStyles({
		color: Cliente.ClienteStatus === 'A' ? RED_PRIMARY : GREY_SECONDARY,
		background: 'unset',
		border:
			Cliente.ClienteStatus === 'A'
				? `1px solid ${RED_PRIMARY}`
				: `1px solid ${GREY_SECONDARY}`,
	});

	return (
		<div className={classes.box} onClick={() => onOpenModal(i)}>
			<Face fontSize='large' />
			<div className={classes.infoContainer}>
				<Typography variant='body1' style={{ textAlign: 'right' }}>
					{String(Cliente.Nome_Fantasia).trim()}
				</Typography>
				<Typography variant='body2' style={{ textAlign: 'right' }}>
					{String(Cliente.CNPJss).trim()}
				</Typography>
				<Typography variant='body2' style={{ textAlign: 'right' }}>
					Cadastro:{' '}
					{Cliente.DtCadastro !== null
						? moment(Cliente.DtCadastro).format('DD/MM/YYYY')
						: 'Desconhecido'}
				</Typography>
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	box: (props) => ({
		display: 'flex',
		width: '300px',
		height: '100px',
		background: props.background,
		color: props.color,
		border: props.border,
		margin: '8px 0px',
		borderRadius: '8px',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '0px 8px 0px 8px',

		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			transform: 'scale(1.05)',
			cursor: 'pointer',
			background: props.color,
			color: '#FFF',
			border: 'none',
		},

		'&:not(hover)': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			transform: 'scale(1)',
		},
	}),
	infoContainer: {
		display: 'flex',
		flexDirection: 'column',
		margin: '8px 0px 0px 8px',
		height: '100%',
		justifyContent: 'flex-start',
	},
}));
