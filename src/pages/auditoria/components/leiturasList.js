import React, { useState } from 'react';
import { api } from '../../../services/api';
import moment from 'moment';
import { saveAs } from 'file-saver';

import {
	DateRange as DateRangeIcon,
	SyncAlt as SyncAltIcon,
} from '@material-ui/icons';
import {
	makeStyles,
	withStyles,
	List,
	ListItem,
	Button,
	ListItemText,
	ListSubheader,
	ListItemSecondaryAction,
	Checkbox,
	Typography,
} from '@material-ui/core';
import { Toast } from '../../../components/toasty';

export const LeiturasList = ({
	leituras,
	telemetriaId,
	uuid,
	anxid,
	pdvid,
	status,
}) => {
	const [cooldownSync, setCooldownSync] = useState(false);
	const [periodo, setPeriodo] = useState({ de: null, ate: null });

	const classes = useStyles();

	const getSection = (leit, sectionName) => {
		return (
			<li className={classes.listSection}>
				<ul className={classes.ul}>
					<ListSubheader
						style={{
							color: '#FFF',
							background: 'linear-gradient(160deg,#071441 13%,#25C998 100%)',
							boxShadow: '0px 3px 4px 0px rgb(0 0 0 / 14%)',
						}}
					>
						{sectionName}
					</ListSubheader>
					{leit.map((l) => (
						<ListItem
							button
							key={l.LeituraId}
							style={{ cursor: 'pointer' }}
							onClick={() => handleSelectLeitura(l.LeituraId)}
						>
							<ListItemText
								primary={moment(l.DataLeitura)
									.add(3, 'hours')
									.format('DD/MM/YYYY hh:mm:ss a')}
								secondary={`Contador: ${l.QuantidadeTotal}`}
							/>
							<ListItemSecondaryAction>
								<GreenCheckbox
									indeterminate={isBetween(l.LeituraId)}
									disabled={isBetween(l.LeituraId)}
									className={classes.checkbox}
									edge='end'
									onChange={() => handleSelectLeitura(l.LeituraId)}
									checked={
										periodo.de === l.LeituraId || periodo.ate === l.LeituraId
									}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</ul>
			</li>
		);
	};

	const isBetween = (leituraId) => {
		if (periodo.de !== null && periodo.ate !== null) {
			if (leituraId > periodo.de && leituraId < periodo.ate) {
				return true;
			}
			return false;
		}

		return false;
	};

	const handleRequestLeitura = async () => {
		//horário inicial e limite em MS(60 segundos de diferença)
		const eventTime = 1366547460;
		const currentTime = 1366547400;
		const diffTime = eventTime - currentTime;
		let duration = moment.duration(diffTime * 1000, 'milliseconds');
		const interval = 1000;

		let IntervalId;
		IntervalId = setInterval(() => {
			duration = moment.duration(duration - interval, 'milliseconds');
			if (duration.asSeconds() <= 0) {
				setCooldownSync(false);
				clearInterval(IntervalId);
			} else {
				setCooldownSync(duration.minutes() + ':' + duration.seconds());
			}
		}, interval);

		api.get(`/audit/leitura/${telemetriaId}`);
	};

	const handleRequestColeta = async () => {
		if (periodo.de === null || periodo.ate === null) {
			Toast('Selecione duas leituras para visualizar o consumo', 'warn');
			return;
		}

		let toastId = null;
		toastId = Toast('Exportando dados para excel...', 'wait');

		try {
			const response = await api.get(
				`/audit/excel/${uuid}/${anxid}/${pdvid}/${periodo.de}/${periodo.ate}`,
				{
					responseType: 'arraybuffer',
				}
			);

			Toast('Dados exportados com sucesso!', 'update', toastId, 'success');

			const blob = new Blob([response.data], {
				type: 'application/octet-stream',
			});

			saveAs(blob, `Relação de consumo de doses.xlsx`);
		} catch (err) {
			Toast('Falha ao exportar dados', 'update', toastId, 'error');
		}
	};

	const handleSelectLeitura = (leituraId) => {
		// se for uma leitura que já está no período, removo ela por null
		if (periodo.de === leituraId || periodo.ate === leituraId) {
			setPeriodo((oldState) => ({
				de: oldState.de === leituraId ? null : oldState.de,
				ate: oldState.ate === leituraId ? null : oldState.ate,
			}));

			return;
		}

		// se tentar preencher mais de duas leituras, mostrar um toast e retornar
		if (periodo.de !== null && periodo.ate !== null) {
			Toast('Você só deve selecionar duas datas');
			return;
		}

		// se ambas as leituras do periodo forem null, coloco essa em "um"
		if (periodo.de === null && periodo.ate === null) {
			setPeriodo({
				de: leituraId,
				ate: null,
			});

			return;
		}

		// se ambas a leitura selecionada for a segunda e for menor que a "um", inverto elas
		if (periodo.de !== null && periodo.ate === null) {
			setPeriodo((oldState) => ({
				de: oldState.de > leituraId ? leituraId : oldState.de,
				ate: oldState.de > leituraId ? oldState.de : leituraId,
			}));

			return;
		}

		// se ambas a leitura selecionada for a segunda e for menor que a "um", inverto elas
		if (periodo.de === null && periodo.ate !== null) {
			setPeriodo((oldState) => ({
				de: oldState.ate < leituraId ? oldState.ate : leituraId,
				ate: oldState.ate < leituraId ? leituraId : oldState.ate,
			}));

			return;
		}
	};

	return (
		<div className={classes.container}>
			<Typography variant='h5' className={classes.telemetriaHeader}>
				TELEMETRIA
			</Typography>
			<List className={classes.root} subheader={<li />}>
				{status === 'disponivel' ? (
					<>
						{leituras.filter((l) => wasToday(l)).length > 0
							? getSection(
									leituras.filter((l) => wasToday(l)),
									'Leituras de hoje'
							  )
							: null}
						{leituras.filter((l) => !wasToday(l) && wasThisWeek(l)).length > 0
							? getSection(
									leituras.filter((l) => !wasToday(l) && wasThisWeek(l)),
									'Leituras dos últimos 7d'
							  )
							: null}
						{leituras.filter((l) => !wasToday(l) && !wasThisWeek(l)).length > 0
							? getSection(
									leituras.filter((l) => !wasToday(l) && !wasThisWeek(l)),
									'Leituras anteriores'
							  )
							: null}
					</>
				) : status === 'desabilitado' ? (
					<Typography
						variant='h6'
						style={{
							textAlign: 'center',
							marginTop: '50%',
							padding: '0px 8px',
							color: '#CCC',
						}}
					>
						A apuração das leituras desse ativo está indisponível no momento
					</Typography>
				) : null}
			</List>
			<Button
				className={classes.Button}
				variant='contained'
				color='primary'
				onClick={handleRequestColeta}
				disabled={status === 'desabilitado'}
				startIcon={<DateRangeIcon />}
			>
				Consumo do período
			</Button>

			<Button
				className={classes.Button}
				variant='outlined'
				color='primary'
				onClick={handleRequestLeitura}
				disabled={!(cooldownSync === false) || status === 'desabilitado'}
				startIcon={<SyncAltIcon />}
			>
				Pedir leitura {cooldownSync !== false ? `(${cooldownSync})` : null}
			</Button>
		</div>
	);
};

const wasToday = (leitura) => {
	// return true

	const maxDtDiff = 1;
	const datediff = moment()
		.subtract(3, 'h')
		.diff(moment(leitura.DataLeitura), 'd');
	return datediff < maxDtDiff;
};

const wasThisWeek = (leitura) => {
	// return true

	const maxDtDiff = 7;
	const datediff = moment()
		.subtract(3, 'h')
		.diff(moment(leitura.DataLeitura), 'd');
	return datediff <= maxDtDiff;
};

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFF',
		flexDirection: 'column',
		width: '50%',
		height: '100%',
		padding: '30px 1% 1% 1%',

		'@media (max-width: 900px)': {
			width: '100%',
		},
	},
	root: {
		width: '100%',
		maxWidth: 360,
		position: 'relative',
		overflow: 'auto',
		height: '400px',
		boxShadow:
			'0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
	},
	listSection: {
		backgroundColor: '#FFF',
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0,
	},
	checkbox: {
		transform: 'scale(0.3)',
	},
	telemetriaHeader: {
		color: '#25C998',
		fontWeight: 'bold',
		paddingBottom: '10px',
		maxWidth: '360px',
		width: '100%',
		'@media (max-width: 900px)': {
			paddingLeft: '16px',
		},
	},
	Button: {
		marginTop: '8px',
		width: '100%',
		maxWidth: '360px',
	},
}));

const GreenCheckbox = withStyles({
	root: {
		color: '#25C998',
		'&$checked': {
			color: '#25C998',
		},
	},
	checked: {},
})((props) => <Checkbox color='default' {...props} />);
