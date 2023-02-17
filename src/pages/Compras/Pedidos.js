import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

//Meio de comunicação
import { api } from '../../services/api';
//"Placeholder" da página enquanto dados são carregados no
import Loading from '../../components/loading_screen';

//import de elementos visuais
import { Toast } from '../../components/toasty';
import { ChangeTab } from '../../global/actions/ComprasAction';
import { Table } from '../../components/table';

import { withStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { DetalhesModal } from './modals/PedidosDetailsModal';

function Pedidos(props) {
	const TabIndex = 3;

	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [pedidosAberto, setPedidosAberto] = useState([]);
	const [pedidosAtendidos, setPedidosAtendidos] = useState([]);
	const [pedidoDet, setPedidoDet] = useState({});

	const { ChangeTab } = props;

	//componentDidMount
	useEffect(() => {
		async function LoadData() {
			try {
				ChangeTab(TabIndex);

				const response = await api.get('/compras/pedidos');
				setPedidosAberto(response.data.PedidosAbertos);
				setPedidosAtendidos(response.data.PedidosFaturados);
				setLoaded(true);
			} catch (err) {}
		}
		LoadData();
	}, [ChangeTab]);

	const handleLoadDet = async (pedido) => {
		setOpen(true);
		try {
			const response = await api.get(
				`/compras/pedidos/detalhes/${pedido.Pedido}/${pedido.Status}`
			);
			setPedidoDet(response.data);
		} catch (err) {
			setPedidoDet({});
		}
	};

	const handleCloseDialog = () => {
		setPedidoDet({});
		setOpen(false);
	};

	const handleCancel = async (ID, event) => {
		event.persist();
		event.target.disabled = true;
		let toastId = null;

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.delete(`/compras/pedidos/cancelar/${ID}`);

			setOpen(false);
			setPedidosAberto(
				pedidosAberto.filter((element) => String(element.Pedido) !== String(ID))
			);

			Toast('Pedido cancelado com sucesso!', 'update', toastId, 'success');
		} catch (err) {
			event.target.disabled = false;
			Toast('Falha ao cancelar pedido', 'update', toastId, 'error');
		}
	};

	return !loaded ? (
		<Loading />
	) : (
		<div
			className='XAlign'
			style={{
				width: '100%',
				height: '100%',
				flexWrap: 'wrap  ',
				alignItems: 'flex-start',
			}}
		>
			<DetalhesModal
				open={open}
				Detalhes={pedidoDet}
				onClose={handleCloseDialog}
				onCancel={handleCancel}
			/>
			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<StyledTableCell>Status</StyledTableCell>
							<StyledTableCell>Solicitado | Faturado</StyledTableCell>
							<StyledTableCell>Nº Pedido</StyledTableCell>
							<StyledTableCell>NF</StyledTableCell>
							<StyledTableCell>Série</StyledTableCell>
							<StyledTableCell>Qtd. Items</StyledTableCell>
							<StyledTableCell>Total</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pedidosAberto.map((pedido) => (
							<StyledTableRow onClick={() => handleLoadDet(pedido)}>
								<StyledTableCell>{pedido.Status}</StyledTableCell>
								<StyledTableCell>
									{moment(pedido.Solicitacao).format('L')}
								</StyledTableCell>
								<StyledTableCell>{pedido.Pedido}</StyledTableCell>
								<StyledTableCell>{pedido.NF}</StyledTableCell>
								<StyledTableCell>{pedido.Serie}</StyledTableCell>
								<StyledTableCell>{pedido.QtItems}</StyledTableCell>
								<StyledTableCell>
									{new Intl.NumberFormat('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									}).format(pedido.Total)}
								</StyledTableCell>
							</StyledTableRow>
						))}

						{pedidosAtendidos.map((pedido) => (
							<StyledTableRow onClick={() => handleLoadDet(pedido)}>
								<StyledTableCell>{pedido.Status}</StyledTableCell>
								<StyledTableCell>
									{moment(pedido.Faturado).format('L')}
								</StyledTableCell>
								<StyledTableCell>{pedido.Pedido}</StyledTableCell>
								<StyledTableCell>{pedido.NF}</StyledTableCell>
								<StyledTableCell>{pedido.Serie}</StyledTableCell>
								<StyledTableCell>{pedido.QtItems}</StyledTableCell>
								<StyledTableCell>
									{new Intl.NumberFormat('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									}).format(pedido.Total)}
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

const mapStateToProps = (store) => ({
	State: store.CompraReducer,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			ChangeTab,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(Pedidos);
//estilo célula

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);

//estilo linha
const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},

		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			backgroundColor: '#CCC',
			cursor: 'pointer',
		},
	},
}))(TableRow);
