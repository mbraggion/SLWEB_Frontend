import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { api } from '../../../services/api';

import Draggable from 'react-draggable';
import { Close, Block, ListAlt, FeaturedPlayList } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { DataGrid } from '@material-ui/data-grid';
import IconButton from '@material-ui/core/IconButton';

import { Toast } from '../../../components/toasty';

export const DetalhesModal = ({ open, Detalhes, onClose, onCancel }) => {
	const [wait, setWait] = useState(false);

	const handleRequestPDF = async (pedidoInfo) => {
		setWait(true);
		let toastId = null;

		try {
			toastId = Toast('Gerando PDF...', 'wait');

			const response = await api.get(
				`/compras/pedidos/PDF/detalhes/${pedidoInfo.PedidoId}/${pedidoInfo.Status}`,
				{
					responseType: 'arraybuffer',
				}
			);

			Toast('PDF pronto!', 'update', toastId, 'success');
			setWait(false);

			const blob = new Blob([response.data], { type: 'application/pdf' });

			saveAs(blob, `Demonstrativo de Compra - ${pedidoInfo.PedidoId}.pdf`);
		} catch (err) {
			Toast('Falha ao gerar PDF', 'update', toastId, 'error');
			setWait(false);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperComponent={PaperComponent}
			TransitionComponent={Transition}
			aria-labelledby='draggable-dialog-title'
		>
			<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
				<div
					className='XAlign'
					style={{ justifyContent: 'flex-start', alignItems: 'center' }}
				>
					<ListAlt />
					Detalhes do Pedido
				</div>
			</DialogTitle>
			<DialogContent>
				<div className='XAlign' style={{ justifyContent: 'space-between' }}>
					<div className='YAlign'>
						<Typography gutterBottom variant='subtitle1'>
							<strong>
								{Detalhes.Status === 'Faturado' ? 'Emissão' : 'Solicitação'}
							</strong>
							:{' '}
							{typeof Detalhes.Data != 'undefined'
								? moment(Detalhes.Data).format('L')
								: ''}
						</Typography>
						<Typography gutterBottom variant='subtitle1'>
							<strong>Transportadora:</strong>{' '}
							{Detalhes.Transportadora === null ? '?' : Detalhes.Transportadora}
						</Typography>
					</div>
					<Tooltip
						title={
							<label
								style={{ fontSize: '14px', color: '#FFF', lineHeight: '20px' }}
							>
								Gerar PDF
							</label>
						}
						placement='top'
						arrow
					>
						<IconButton
							disabled={wait}
							onClick={() => handleRequestPDF(Detalhes)}
							color='secondary'
						>
							<FeaturedPlayList />
						</IconButton>
					</Tooltip>
				</div>
				<div style={{ height: 400, width: '100%' }}>
					<DataGrid
						rows={
							typeof Detalhes.Detalhes != 'undefined' ? Detalhes.Detalhes : []
						}
						columns={columns}
						pageSize={5}
						hideFooter={Detalhes.Detalhes?.length > 5 ? false : true}
						disableSelectionOnClick
						disableColumnMenu
						loading={typeof Detalhes.Detalhes == 'undefined'}
					/>
				</div>
			</DialogContent>
			<DialogActions style={{ padding: '8px 24px' }}>
				<div
					className='XAlign'
					style={{ justifyContent: 'space-between', alignItems: 'center' }}
				>
					<Typography gutterBottom variant='subtitle1'>
						Total: <strong>R$ {calcTotalCompra(Detalhes)}</strong>
					</Typography>
					<div>
						{Detalhes.Status === 'Processando' ? (
							<Button
								color='primary'
								onClick={(e) => onCancel(Detalhes.PedidoId, e)}
								startIcon={<Block />}
							>
								Cancelar Pedido
							</Button>
						) : null}

						<Button color='primary' onClick={onClose} startIcon={<Close />}>
							Fechar
						</Button>
					</div>
				</div>
			</DialogActions>
		</Dialog>
	);
};

const calcTotalCompra = (compra) => {
	let total = 0;

	if (Array.isArray(compra.Detalhes)) {
		compra.Detalhes.forEach((c) => {
			total = total + c.VlrTotal;
		});
	}

	return Number(total).toFixed(2);
};

function PaperComponent(props) {
	return (
		<Draggable
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} style={{ width: '100%', maxWidth: '900px' }} />
		</Draggable>
	);
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Grow {...props} />;
});

const columns = [
	{ field: 'id', headerName: 'Código', width: 100, editable: false },
	{
		field: 'Produto',
		headerName: 'Produto',
		flex: 1,
		editable: false,
	},
	{
		field: 'UN',
		headerName: 'Un',
		width: 50,
		editable: false,
		sortable: false,
	},
	{
		field: 'Quantidade',
		headerName: 'Quantidade',
		type: 'number',
		width: 125,
		editable: false,
	},
	{
		field: 'VlrUn',
		headerName: 'Valor Unitário',
		type: 'number',
		sortable: false,
		width: 130,
	},
	{
		field: 'VlrTotal',
		headerName: 'Valor Total',
		type: 'number',
		description: 'Cálculo do Valor Unitário x Quantidade',
		width: 130,
		valueGetter: (params) =>
			params.getValue(params.id, 'Quantidade') *
			params.getValue(params.id, 'VlrUn'),
	},
];
