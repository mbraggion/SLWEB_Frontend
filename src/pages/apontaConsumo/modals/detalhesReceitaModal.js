import React from 'react';

import {
	Dialog,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	IconButton,
	Typography,
	useMediaQuery,
} from '@material-ui/core/';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';

import { useConsumo } from '../../../hooks/useConsumo';

export const ReceitaModal = () => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const {
		uiControl: { isRecipeModalOpen },
		actions: { onCloseReceitaModal },
		data: { Receita },
	} = useConsumo();

	const handleClose = () => {
		onCloseReceitaModal();
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={isRecipeModalOpen}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				{Receita !== null
					? `"${String(Receita.RecNome).trim()}"`
					: 'Detalhes da receita'}
			</DialogTitle>

			<DialogContent dividers>
				{Receita !== null && Array.isArray(Receita.Insumos) ? (
					<table className={classes.table}>
						<thead>
							<tr>
								<th className={classes.header}>Item</th>
								<th>Insumo</th>
								<th>Un.</th>
								<th>Qtd.</th>
							</tr>
						</thead>
						<tbody>
							{Receita.Insumos.map((RI, i) => (
								<tr>
									<td className={classes.cell} style={{ padding: '1rem 2rem' }}>
										{i + 1}
									</td>
									<td className={classes.cell} style={{ color: '#000' }}>
										{RI.Insumo}
									</td>
									<td className={classes.cell} style={{ color: '#000' }}>
										{RI.Un}
									</td>
									<td className={classes.cell} style={{ color: '#000' }}>
										{RI.Qtd}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<Typography variant='body1'>Sem detalhes para exibir</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	table: {
		width: '100%',
		borderSpacing: '0 0.5rem',
	},
	header: {
		color: '#333',
		fontWeight: '400',
		padding: '1rem 2rem',
		textAlign: 'left',
		lineHeight: '1.5rem',
	},
	cell: {
		padding: '1rem 1rem',
		border: '0',
		background: '#fff',
		color: '#969CB3',
		borderRadius: '0.25rem',
	},
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		minWidth: '300px',
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant='h6'>{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label='close'
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});
