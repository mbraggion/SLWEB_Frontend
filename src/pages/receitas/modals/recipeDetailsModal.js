import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { api } from '../../../services/api';

import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
} from '@material-ui/core/';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
	Add as AddIcon,
	Close as CloseIcon,
	Delete as DeleteIcon,
	Save as SaveIcon,
	ThumbDownAlt as ThumbDownAltIcon,
	ThumbUpAlt as ThumbUpAltIcon,
} from '@material-ui/icons';

import { Toast } from '../../../components/toasty';

export const RecipeDetailsModal = ({
	open,
	onClose,
	onUpdateRecipesArray,
	GrupoInsumo,
	RecId,
}) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [recipeName, setRecipeName] = useState('');
	const [newRecipe, setNewRecipe] = useState([]);
	const [recipeStatus, setRecipeStatus] = useState('A');
	const [wait, setWait] = useState(false);

	useEffect(() => {
		if (RecId !== null) {
			loadReceita();
		}
		// eslint-disable-next-line
	}, [RecId]);

	const loadReceita = async () => {
		let toastId = null;

		setWait(true);

		toastId = Toast('Buscando detalhes da receita', 'wait');

		try {
			const response = await api.get(`/receita/${RecId}`);

			Toast('Receita encontrada', 'update', toastId, 'success');
			setWait(false);

			setRecipeStatus(response.data.Receita.RecStatus);
			setNewRecipe(response.data.Receita.Insumos);
			setRecipeName(response.data.Receita.RecNome);
		} catch (err) {
			Toast('Falha ao buscar detalhes da receita', 'update', toastId, 'error');
			setWait(false);
			setNewRecipe([]);
		}
	};

	const handleClose = () => {
		if (wait) return;
		onClose();
		setNewRecipe([]);
		setRecipeName('');
	};

	const handleUpdate = async () => {
		if (recipeName.trim() === '') {
			Toast('De um nome para a receita', 'warn');
			return;
		}

		let filteredRec = newRecipe.filter(
			(d) => d.GrupoProduto !== null && d.Qtd > 0
		);

		if (filteredRec.length === 0) {
			Toast('A receita deve ter pelo menos um insumo na fórmula', 'warn');
			return;
		}

		setWait(true);
		setNewRecipe(filteredRec);

		let toastId = null;

		toastId = Toast('Atualizando receita...', 'wait');

		try {
			await api.put('/receita', {
				RecId: RecId,
				recipeName: recipeName,
				recipeDetails: filteredRec,
			});

			Toast('Receita atualizada com sucesso', 'update', toastId, 'success');
			setWait(false);

			onUpdateRecipesArray((oldState) => {
				let aux = [...oldState];
				let index = null;

				aux.forEach((rec, i) => {
					if (rec.RecId === RecId) {
						index = i;
					}
				});

				aux[index].RecDesc = recipeName;

				return aux;
			});
		} catch (err) {
			Toast('Falha ao atualizar receita', 'update', toastId, 'error');
			setWait(false);
		}
	};

	const handleAddInsumo = () => {
		setNewRecipe((oldState) => [
			...oldState,
			{
				GrupoProduto: null,
				Qtd: 0,
			},
		]);
	};

	const handleRemoveInsumo = (index) => {
		if (newRecipe.length <= 1) {
			Toast('A receita precisa ter pelo menos um item!', 'info');
			return;
		}

		setNewRecipe((oldState) => {
			let aux = [...oldState];

			aux.splice(index, 1);

			return aux;
		});
	};

	const handleInativar = async () => {
		setWait(true);

		let toastId = null;

		toastId = Toast('Inativando receita...', 'wait');

		try {
			const response = await api.put('/receita/inativar', {
				RecId: RecId,
				RecStatus: recipeStatus,
			});

			Toast('Receita inativada com sucesso', 'update', toastId, 'success');
			setWait(false);

			onUpdateRecipesArray((oldState) => {
				let aux = [...oldState];
				let index = null;

				aux.forEach((rec, i) => {
					if (rec.RecId === RecId) {
						index = i;
					}
				});

				aux[index].RecStatus = response.data.updStatus;

				return aux;
			});
			setRecipeStatus(response.data.updStatus);
		} catch (err) {
			Toast('Falha ao atualizar receita', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return (
		<Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
			<DialogTitle onClose={handleClose}>Detalhes da receita</DialogTitle>

			<DialogContent dividers>
				<TextField
					className={classes.recipeName}
					label='Nome da receita'
					variant='standard'
					disabled={wait}
					value={recipeName}
					onChange={(e) => setRecipeName(e.target.value)}
				/>
				<section className={classes.detContainer}>
					{newRecipe.length === 0
						? null
						: newRecipe.map((det, i) => (
								<div className={classes.detLine}>
									<IconButton
										className={classes.delIcon}
										onClick={() => handleRemoveInsumo(i)}
									>
										<DeleteIcon />
									</IconButton>
									<FormControl
										variant='standard'
										className={classes.formControl}
									>
										<InputLabel
											id={`demo-simple-select-outlined-label-${det.RecId}`}
										>
											Insumo
										</InputLabel>
										<Select
											labelId={`demo-simple-select-outlined-label-${det.RecId}`}
											id={`demo-simple-select-outlined-${det.RecId}`}
											value={det.GrupoProduto}
											onChange={(e) =>
												setNewRecipe((oldState) => {
													let aux = [...oldState];

													aux[i].GrupoProduto = e.target.value;

													return aux;
												})
											}
											label='Insumo'
											disabled={wait}
										>
											<MenuItem value={null}>
												<em>Selecione...</em>
											</MenuItem>
											{GrupoInsumo.map((GI) => (
												<MenuItem value={GI.GprdId}>{GI.GprdDesc}</MenuItem>
											))}
										</Select>
									</FormControl>
									<NumberFormat
										className={classes.qtdInput}
										value={det.Qtd}
										placeholder='Qtd'
										type='text'
										prefix={
											GrupoInsumo.filter((GI) => GI.GprdId === det.GrupoProduto)
												.length > 0
												? String(
														GrupoInsumo.filter(
															(GI) => GI.GprdId === det.GrupoProduto
														)[0].GprdUn
												  ).trim() + ' '
												: ''
										}
										isNumericString
										allowNegative={false}
										allowLeadingZeros={true}
										decimalScale={4}
										decimalSeparator=','
										thousandSeparator='.'
										onValueChange={(e) =>
											setNewRecipe((oldState) => {
												let aux = [...oldState];

												aux[i].Qtd = e.value;

												return aux;
											})
										}
										disabled={wait}
										style={{
											fontWeight: 'bold',
										}}
									/>
								</div>
						  ))}
				</section>
				<Button
					className={classes.addButton}
					disabled={wait}
					onClick={handleAddInsumo}
					color='primary'
					variant='contained'
					startIcon={<AddIcon />}
				>
					Adicionar insumo
				</Button>
			</DialogContent>

			<DialogActions>
				<Button
					disabled={wait}
					onClick={handleInativar}
					color='secondary'
					startIcon={
						recipeStatus === 'A' ? <ThumbDownAltIcon /> : <ThumbUpAltIcon />
					}
				>
					{recipeStatus === 'A' ? 'Inativar' : 'Ativar'}
				</Button>
				<Button
					disabled={wait}
					onClick={handleUpdate}
					color='primary'
					startIcon={<SaveIcon />}
				>
					Salvar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	recipeName: {
		width: '100%',
		marginBottom: '16px',

		'&:nth-child(1) > div > input': {
			marginLeft: '8px',
		},
	},
	detContainer: {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	detLine: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		borderBottom: '1px solid #CCC',
		padding: '0px 0px 8px 0px',
		margin: '8px 0px 0px 0px',
	},
	formControl: {
		minWidth: '200px',
	},
	select: {},
	qtdInput: {
		width: '80px !important',
		height: '25px !important',
		textAlign: 'end',
		fontSize: '16px !important',
		marginLeft: '8px !important',
		borderBottom: '1px solid #333 !important',
	},
	addButton: {
		width: '100%',
	},
	delIcon: {
		margin: '0px 8px 0px 0px',
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
