import moment from 'moment';
import React from 'react';

import {
	Button,
	FormControl,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Typography,
} from '@material-ui/core';
import {
	FilterList as FilterListIcon,
	Launch as LaunchIcon,
} from '@material-ui/icons';

import { useConsumo } from '../../hooks/useConsumo';
import { RED_PRIMARY } from '../../misc/colors';

export const Options = () => {
	const classes = useStyles();

	const {
		uiControl: { podeLancarInventario },
		data: {
			EquipList,
			selectedEquip,
			RefList,
			selectedRef,
			leituras1,
			selectedL1,
			leituras2,
			selectedL2,
			Zerada,
		},
		actions: {
			onChangeEquip,
			onChangeRef,
			onChangeL1,
			onChangeL2,
			onOpenLancamentoModal,
			onZerarMaquina,
		},
	} = useConsumo();

	return (
		<div className={classes.root}>
			<div className={classes.sec1}>
				<FormControl variant='outlined' className={classes.formControl}>
					<InputLabel id='select-eq-label'>Equipamento</InputLabel>
					<Select
						labelId='select-eq-label'
						id='select-eq'
						value={selectedEquip}
						onChange={(e) => onChangeEquip(e.target.value)}
						label='Equipamento'
					>
						<MenuItem value={null}>
							<em>Nenhum</em>
						</MenuItem>

						{EquipList.map((eq) => (
							<MenuItem value={eq.EquiCod}>
								{eq.EquiCod} - {eq.Nome_Fantasia}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl variant='outlined' className={classes.formControl}>
					<InputLabel id='select-ref-label'>Referencia</InputLabel>
					<Select
						labelId='select-ref-label'
						id='select-ref'
						value={selectedRef}
						onChange={(e) => onChangeRef(e.target.value)}
						label='Referencia'
					>
						<MenuItem value={null}>
							<em>Nenhuma</em>
						</MenuItem>

						{RefList.map((ref) => (
							<MenuItem value={ref.Refdt}>
								{moment(ref.Refdt).add(3, 'hours').format('MM/YYYY')}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{selectedRef !== null ? (
					<>
						<FormControl variant='outlined' className={classes.formControl}>
							<InputLabel id='select-l1-label'>Leitura inicial</InputLabel>
							<Select
								labelId='select-l1-label'
								id='select-l1'
								value={selectedL1}
								onChange={(e) => onChangeL1(e.target.value)}
								label='Leitura inicial'
								disabled={selectedRef === null}
							>
								<MenuItem value={null}>
									<em>Nenhuma</em>
								</MenuItem>

								{leituras1.map((ref) => (
									<MenuItem value={ref.LeituraId}>
										{moment(ref.DataLeitura).format('DD/MM/YYYY hh:mm:ss')}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl variant='outlined' className={classes.formControl}>
							<InputLabel id='select-l2-label'>Leitura final</InputLabel>
							<Select
								labelId='select-l2-label'
								id='select-l2'
								value={selectedL2}
								onChange={(e) => onChangeL2(e.target.value)}
								label='Leitura final'
								disabled={selectedRef === null}
							>
								<MenuItem value={null}>
									<em>Nenhuma</em>
								</MenuItem>

								{leituras2
									.slice()
									.reverse()
									.map((ref) => (
										<MenuItem value={ref.LeituraId}>
											{moment(ref.DataLeitura).format('DD/MM/YYYY hh:mm:ss')}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</>
				) : null}
			</div>

			<div className={classes.sec2}>
				<Button
					className={classes.button}
					onClick={onOpenLancamentoModal}
					disabled={!podeLancarInventario}
					variant='contained'
					color='primary'
					startIcon={<LaunchIcon />}
				>
					Gravar movimentação
				</Button>
				<div
					className={classes.infoBox}
					onClick={() => onZerarMaquina(!Zerada)}
					style={{
						backgroundColor: Zerada ? RED_PRIMARY : '#FFF',
						color: Zerada ? '#FFF' : RED_PRIMARY,
						cursor: 'pointer',
						border: Zerada ? 'none' : `1px solid ${RED_PRIMARY}`,
						flexDirection: 'row',
						justifyContent: 'space-around',
					}}
				>
					<FilterListIcon />
					<div className='YAlign'>
						<Typography className={classes.infoBoxText}>
							{Zerada ? 'Máquina zerada' : 'Zerar máquina'}
						</Typography>
						<Typography variant='subtitle2' className={classes.infoBoxText}>
							{Zerada ? 'Clique para reverter' : ''}
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		height: '120px',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		boxShadow:
			'0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)',
		padding: '0px 1%',

		'@media (max-width: 1080px)': {
			height: 'auto',
		},
		'@media (max-width: 500px)': {
			flexDirection: 'column',
		},
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: '150px',

		'@media (max-width: 1080px)': {
			width: '300px',
		},
		'@media (max-width: 500px)': {
			width: '100%',
			margin: '8px 0px',
		},
	},
	button: {
		padding: '16px',

		'@media (max-width: 1080px)': {
			height: 'auto',
		},
		'@media (max-width: 500px)': {
			width: '100%',
		},
	},
	infoBox: {
		display: 'flex',
		borderRadius: '5px',
		height: '40px',
		padding: '0px 20px',
		alignItems: 'center',
		margin: '8px 0px',
		width: '100%',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	infoBoxText: {
		width: '100%',
		textAlign: 'center',
	},
	sec1: {
		'@media (max-width: 500px)': {
			width: '100%',
		},
	},
	sec2: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: '100%',

		'@media (max-width: 1080px)': {
			margin: '8px 0 0 0',
			justifyContent: 'flex-start',
		},

		'@media (max-width: 500px)': {
			width: '100%',
		},
	},
}));
