import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import { DataGrid } from '@material-ui/data-grid';
import { RED_PRIMARY } from '../../../misc/colors';

import Input from 'react-number-format';

import {
	clickRemove,
	ChangeBebidaDetailsManually,
} from '../../../global/actions/SolicitacaoAction';

//component
function CustomizedTable(props) {
	const classes = useStyles();

	const { Configuracao } = props.State;

	const { clickRemove, ChangeBebidaDetailsManually } = props;

	return (
		<DataGrid
			className={classes.datagrid}
			rows={Configuracao}
			columns={returnColunsDef(clickRemove)}
			disableSelectionOnClick={true}
			disableColumnMenu={true}
			checkboxSelection={false}
			pageSize={Configuracao.length}
			hideFooter={true}
			onCellEditCommit={(params, event) => {
				ChangeBebidaDetailsManually(params);
			}}
		/>
	);
}

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			clickRemove,
			ChangeBebidaDetailsManually,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(CustomizedTable);

const useStyles = makeStyles({
	table: {
		marginTop: '8px',
		minWidth: 700,
	},
	datagrid: {
		width: '100%',
		height: '100%',
		'&>div.MuiDataGrid-main>div>div.MuiDataGrid-windowContainer>div.MuiDataGrid-window':
			{
				overflowX: 'hidden',
			},
	},
});

const returnColunsDef = (onRemoveDrink) => {
	const columns = [
		{
			field: 'selecao',
			headerName: 'Seleção',
			type: 'number',
			hasFocus: true,
			width: 80,
			sortable: false,
			editable: true,
			align: 'center',
			renderCell: (params) => (
				<div
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
				>
					{params.value}
				</div>
			),
			renderEditCell: (params) => (
				<Input
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
					autoFocus={true}
					decimalScale={0}
					fixedDecimalScale={false}
					isNumericString
					prefix=''
					allowNegative={false}
					onChange={(e) => {
						params.api.setEditCellValue(
							{
								id: params.id,
								field: params.field,
								value: Number(e.target.value),
							},
							e
						);
					}}
					value={params.value}
				/>
			),
		},
		{
			field: 'bebida',
			headerName: 'Bebida',
			flex: 1,
			sortable: false,
			editable: false,
		},
		{
			field: 'medida',
			headerName: 'Medida',
			width: 80,
			type: 'number',
			editable: false,
			sortable: false,
			renderCell: (params) => `${params.value}ML`,
		},
		{
			field: 'valor',
			headerName: 'Vlr. Real',
			type: 'number',
			hasFocus: true,
			width: 90,
			sortable: false,
			editable: true,
			renderCell: (params) => (
				<div
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
				>
					{new Intl.NumberFormat('pt-BR', {
						style: 'currency',
						currency: 'BRL',
					}).format(params.value)}
				</div>
			),
			renderEditCell: (params) => (
				<Input
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
					autoFocus={true}
					decimalScale={4}
					fixedDecimalScale={false}
					isNumericString
					decimalSeparator=','
					thousandSeparator='.'
					prefix='R$ '
					allowNegative={false}
					onChange={(e) => {
						params.api.setEditCellValue(
							{
								id: params.id,
								field: params.field,
								value: Number.parseFloat(
									String(e.target.value)
										.replace('R$ ', '')
										.replace('.', '')
										.replace(',', '.')
								).toFixed(4),
							},
							e
						);
					}}
					value={params.value}
				/>
			),
		},
		{
			field: 'valor2',
			headerName: 'Vlr. Complementar',
			type: 'number',
			hasFocus: true,
			width: 150,
			sortable: false,
			editable: true,
			renderCell: (params) => (
				<div
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
				>
					{new Intl.NumberFormat('pt-BR', {
						style: 'currency',
						currency: 'BRL',
					}).format(params.value)}
				</div>
			),
			renderEditCell: (params) => (
				<Input
					style={{
						fontWeight: 'bold',
						color: RED_PRIMARY,
					}}
					autoFocus={true}
					decimalScale={4}
					fixedDecimalScale={false}
					isNumericString
					decimalSeparator=','
					thousandSeparator='.'
					prefix='R$ '
					allowNegative={false}
					onChange={(e) => {
						params.api.setEditCellValue(
							{
								id: params.id,
								field: params.field,
								value: Number.parseFloat(
									String(e.target.value)
										.replace('R$ ', '')
										.replace('.', '')
										.replace(',', '.')
								).toFixed(4),
							},
							e
						);
					}}
					value={params.value}
				/>
			),
		},
		{
			field: 'tipo',
			headerName: 'Tipo',
			width: 70,
			align: 'center',
			editable: false,
			sortable: false,
		},
		{
			field: 'configura',
			headerName: 'Ativa',
			width: 70,
			align: 'center',
			editable: false,
			sortable: false,
			renderCell: (params) => (params.value ? 'Sim' : 'Não'),
		},
		{
			field: 'id',
			headerName: 'Remover',
			editable: false,
			width: 170,
			align: 'center',
			sortable: false,
			renderHeader: () => <div />,
			renderCell: (params) => (
				<Button
					variant='outlined'
					color='default'
					size='medium'
					startIcon={<Close />}
					onClick={() => onRemoveDrink(params.value)}
				>
					Remover
				</Button>
			),
		},
	];

	return columns;
};
