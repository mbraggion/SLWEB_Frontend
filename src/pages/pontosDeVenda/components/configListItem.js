import React from 'react';

import { makeStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import NumberFormat from 'react-number-format';
import { RED_PRIMARY } from '../../../misc/colors';

import { Toast } from '../../../components/toasty';

export const ConfigListItem = ({
	Sel,
	Produtos,
	ProdCod,
	TiposDeVenda,
	TVendaId,
	V1,
	V2,
	Receitas,
	RecId,
	Linha,
	onUpdateConfig,
	onRemoveConfig,
	Editing,
}) => {
	const classes = useStyles();

	return (
		<div className={classes.line}>
			<NumberFormat
				className={classes.Sel}
				value={Sel}
				placeholder='Sel.'
				type='text'
				allowNegative={false}
				allowLeadingZeros={false}
				decimalScale={0}
				onValueChange={(e) => onUpdateConfig('Sel', e.value, Linha)}
				disabled={Editing}
			/>
			<select
				disabled={Editing}
				value={ProdCod}
				onChange={(e) => onUpdateConfig('ProdId', e.target.value, Linha)}
				className={classes.Prod}
			>
				<option
					className={classes.Opt}
					value={null}
					selected={true}
					disabled={true}
				>
					Selecione...
				</option>
				{Produtos.map((prod) => (
					<option className={classes.Opt} value={prod.ProdId}>
						{prod.Produto}
					</option>
				))}
			</select>
			<select
				disabled={Editing}
				value={TVendaId}
				onChange={(e) => onUpdateConfig('TipoVenda', e.target.value, Linha)}
				className={classes.TV}
			>
				<option
					className={classes.Opt}
					value={null}
					selected={true}
					disabled={true}
				>
					Selecione...
				</option>
				{TiposDeVenda.map((Tv) => (
					<option className={classes.Opt} value={Tv.TveId}>
						{Tv.TveDesc}
					</option>
				))}
			</select>
			<NumberFormat
				className={classes.Val}
				value={V1}
				placeholder='Valor 1'
				type='text'
				allowNegative={false}
				allowLeadingZeros={false}
				allowEmptyFormatting
				decimalSeparator=','
				decimalScale={2}
				fixedDecimalScale
				onValueChange={(e) => onUpdateConfig('Valor_1', e.floatValue, Linha)}
				disabled={Editing}
			/>
			<NumberFormat
				className={classes.Val}
				value={V2}
				placeholder='Valor 2'
				type='text'
				allowNegative={false}
				allowLeadingZeros={false}
				allowEmptyFormatting
				decimalSeparator=','
				decimalScale={2}
				fixedDecimalScale
				onValueChange={(e) => onUpdateConfig('Valor_2', e.floatValue, Linha)}
				disabled={Editing}
			/>
			<select
				disabled={Editing}
				value={RecId}
				onChange={(e) => onUpdateConfig('RecId', e.target.value, Linha)}
				className={classes.Rec}
			>
				<option
					className={classes.Opt}
					value={null}
					selected={true}
					disabled={true}
				>
					Selecione...
				</option>
				{Receitas.map((rec) => (
					<option
						className={classes.Opt}
						value={rec.RecId}
						title={rec.det.map(
							(d) =>
								`${String(d.GprdDesc).trim()} ${String(
									d.RdetQtd
								).trim()}${String(d.GprdUn).trim()}`
						)}
					>
						{rec.RecDesc}
					</option>
				))}
			</select>
			<div
				className={classes.ButtonContainer}
				onClick={() => {
					if (Editing) {
						Toast(
							'Ative a edição para remover bebidas da configuração',
							'warn'
						);
					} else {
						onRemoveConfig(Linha);
					}
				}}
			>
				<CloseIcon />
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	line: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		minWidth: '500px',
		height: '40px',
		borderRadius: '20px',
		margin: '0px 0px 4px 0px',
		border: '1px solid #CCC',

		'@media (max-width: 850px)': {
			border: 'none',
		},
	},
	Sel: {
		width: '100% !important',
		minWidth: '30px !important',
		maxWidth: '50px !important',
		textAlign: 'center',
		height: '100% !important',
		borderRadius: '18px 0px 0px 18px !important',
		borderBottom: 'none !important',
	},
	Prod: {
		display: 'block',
		cursor: 'pointer',
		width: '300px',
		height: '100%',
		borderRadius: '0px',
		border: 'none',
	},
	Opt: {
		cursor: 'pointer',
	},
	TV: {
		display: 'block',
		cursor: 'pointer',
		width: '200px',
		height: '100%',
		borderRadius: '0px',
		border: 'none',
	},
	Val: {
		width: '100% !important',
		minWidth: '40px !important',
		maxWidth: '70px !important',
		height: '100% !important',
		borderRadius: '0px !important',
		padding: '0px 0px 0px 8px !important',
		borderBottom: 'none !important',
	},
	Rec: {
		display: 'block',
		cursor: 'pointer',
		width: '200px',
		height: '100%',
		border: 'none',
	},
	ButtonContainer: {
		width: '40px',
		height: '40px',
		borderRadius: '0px 18px 18px 0px !important',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: RED_PRIMARY,
		cursor: 'pointer',
	},
}));
