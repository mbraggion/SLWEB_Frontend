import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';

import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Button,
	Divider,
	ListItemText,
	makeStyles,
	TextField,
} from '@material-ui/core';
import {
	ExpandMore as ExpandMoreIcon,
	Save as Saveicon,
} from '@material-ui/icons';

import { Toast } from '../../../components/toasty';
import { RED_SECONDARY } from '../../../misc/colors';
import { AjusteInput } from './ajusteInput';
import { InvListMovItem } from './invListMovItem';
import { InvListMovList } from './invListMovList';

export const InvListItem = ({
	InvItem,
	isInventoryClosed,
	expandedId,
	updateInventory,
	selectedDepId,
	selectedRef,
	onExpandProd,
}) => {
	const classes = useStyles();
	const [ajusteQtd, setAjusteQtd] = useState(null);
	const [ajusteMotivo, setAjusteMotivo] = useState('');
	const [wait, setWait] = useState(false);

	useEffect(() => {
		setAjusteQtd(InvItem.InvAjQ);
		setAjusteMotivo(InvItem.InvJust);
	}, [InvItem.InvAjQ, InvItem.InvJust]);

	const handleSaveAjuste = async () => {
		setWait(true);
		let toastId = null;

		toastId = Toast('Aguarde...', 'wait');

		try {
			await api.put(
				`/inventario/${selectedDepId}/${encodeURI(selectedRef)}/${
					InvItem.ProdId
				}`,
				{
					InvAjQ: ajusteQtd,
					InvJust: ajusteMotivo,
				}
			);

			Toast('Ajuste gravado!', 'update', toastId, 'success');

			await updateInventory();
			setWait(false);
		} catch (err) {
			Toast('Falha ao gravar ajuste', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return (
		<Accordion
			expanded={expandedId === InvItem.ProdId}
			TransitionProps={{ unmountOnExit: true }}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				onClick={() => onExpandProd(InvItem.ProdId)}
			>
				<ListItemText
					primary={`[${InvItem.ProdId}] ${InvItem.Produto}`}
					secondary={
						<>
							Em estoque:{' '}
							<strong style={{ color: RED_SECONDARY }}>{InvItem.InvQtd}</strong>
						</>
					}
				/>
			</AccordionSummary>
			<AccordionDetails className={classes.details}>
				<InvListMovList>
					{InvItem.Mov.map((mov) => (
						<InvListMovItem Mov={mov} />
					))}
				</InvListMovList>
			</AccordionDetails>
			<Divider />
			<AccordionActions>
				<div className={classes.actionsContainer}>
					<div>
						<AjusteInput
							ajuste={ajusteQtd}
							onChangeAjuste={(e) => {
								setAjusteQtd(e.value);
							}}
							wait={wait || isInventoryClosed}
						/>
						<TextField
							value={ajusteMotivo}
							onChange={(e) => setAjusteMotivo(e.target.value)}
							variant='outlined'
							disabled={wait || isInventoryClosed}
							placeholder='Justificativa'
							className={classes.jusInput}
						/>
					</div>

					<Button
						size='small'
						color='primary'
						startIcon={<Saveicon />}
						disabled={wait || isInventoryClosed}
						onClick={handleSaveAjuste}
					>
						Salvar
					</Button>
				</div>
			</AccordionActions>
		</Accordion>
	);
};

const useStyles = makeStyles((theme) => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
	},
	details: {
		alignItems: 'center',
	},
	jusInput: {
		width: '100%',
		maxWidth: '400px',
		marginLeft: '8px',

		'&:nth-child(2) > div > input': {
			marginLeft: '8px',
		},
	},
	actionsContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',

		'& > div': {
			display: 'flex',
			flexDirection: 'row',
			width: '100%',
		},
	},
}));
