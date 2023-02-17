import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { api } from '../../services/api';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';

import { Table } from '../../components/table';
import Loading from '../../components/loading_screen';

import { PedidoDetailsModal } from './modals/PedidosDetailsModal';
import { SwitchTab } from '../../global/actions/VendasAction';

function Pedidos(props) {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [pedidos, setPedidos] = useState([]);
	const [pedidoDet, setPedidoDet] = useState([]);
	const [actualPedidoInfo, setActualPedidoInfo] = useState({});

	const { SwitchTab } = props;

	useEffect(() => {
		async function LoadData() {
			SwitchTab(1);
			try {
				const response = await api.get('/vendas/pedidos');
				setPedidos(response.data.Pedidos);
				setLoaded(true);
			} catch (err) {}
		}
		LoadData();
	}, [SwitchTab]);

	async function handleLoadDet(pedido) {
		setOpen(true);
		setActualPedidoInfo(pedido);
		try {
			const response = await api.get(
				`/vendas/pedidos/detalhes/${pedido.Serie_Pvc}/${pedido.Pvc_ID}`
			);

			setPedidoDet(response.data);
		} catch (err) {}
	}

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
			<PedidoDetailsModal
				setActualPedidoInfo={setActualPedidoInfo}
				setPedidoDet={setPedidoDet}
				setOpen={setOpen}
				pedidoDet={pedidoDet}
				open={open}
				actualPedidoInfo={actualPedidoInfo}
				setPedidos={setPedidos}
			/>

			<TableContainer component={Paper}>
				<Table size='small'>
					<TableHead>
						<TableRow>
							<StyledTableCell>Status</StyledTableCell>
							<StyledTableCell>Emissão</StyledTableCell>
							<StyledTableCell>Cliente</StyledTableCell>
							<StyledTableCell>Série</StyledTableCell>
							<StyledTableCell>NF</StyledTableCell>
							<StyledTableCell>Tipo</StyledTableCell>
							<StyledTableCell>CNPJ</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{pedidos.map((pedido) => (
							<StyledTableRow
								onClick={() => handleLoadDet(pedido)}
								key={pedido.DOC ? pedido.DOC : pedido.Pvc_ID}
							>
								<StyledTableCell>{pedido.ST}</StyledTableCell>
								<StyledTableCell>
									{moment(pedido.Emissao).format('l')}
								</StyledTableCell>
								<StyledTableCell>{pedido['Nome Fantasia']}</StyledTableCell>
								<StyledTableCell>
									{pedido.Serie_DOC ? pedido.Serie_DOC : pedido.Serie_Pvc}
								</StyledTableCell>
								<StyledTableCell>
									{pedido.DOC ? pedido.DOC : pedido.Pvc_ID}
								</StyledTableCell>
								<StyledTableCell>{pedido.PVSDesc}</StyledTableCell>
								<StyledTableCell>{pedido.CNPJ}</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			SwitchTab,
		},
		dispatch
	);

const mapStateToProps = (store) => ({
	State: store.VendaState,
});

export default connect(mapStateToProps, mapDispatchToProps)(Pedidos);

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
