import React from 'react';
import moment from 'moment';

import { Typography, makeStyles, Divider } from '@material-ui/core';
import {
	Sync as SyncIcon,
	SyncProblem as SyncProblemIcon,
} from '@material-ui/icons';

import LEISA from '../../../assets/maquinas/Maquina_Pilao Lei Sa.png';
import { RED_SECONDARY, GREEN_SECONDARY } from '../../../misc/colors';

export const AtivoInfo = ({ pdv, leituraMaisRecente, franqueado, status }) => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<div className={classes.imgContainer}>
				<img className={classes.img} src={LEISA} alt='IMAGEM DA LEI SA' />
			</div>
			<div className={classes.infoContainer}>
				<Typography variant='h6'>
					Modelo <strong>"{pdv.EquiDesc}"</strong>
				</Typography>
				<Typography variant='subtitle1'>
					Código <strong>{pdv.EquiCod}</strong>
				</Typography>

				{status === 'desabilitado' ? null : (
					<Typography
						variant='overline'
						gutterBottom
						style={{
							color:
								statusDaTelemetria(leituraMaisRecente) === 'online'
									? GREEN_SECONDARY
									: RED_SECONDARY,
						}}
					>
						<strong style={{ verticalAlign: 'top' }}>
							Telemetria {statusDaTelemetria(leituraMaisRecente)}
						</strong>{' '}
						{statusDaTelemetria(leituraMaisRecente) === 'online' ? (
							<SyncIcon />
						) : (
							<SyncProblemIcon />
						)}
					</Typography>
				)}

				<Divider className={classes.divider} />

				<Typography
					variant='subtitle1'
					style={{ textDecoration: 'underline', color: RED_SECONDARY }}
				>
					<strong>{franqueado.Nome_Fantasia ?? '???'}</strong>
				</Typography>
				<Typography variant='caption' gutterBottom>
					Responsável pela franquia
				</Typography>
				<Typography variant='overline'>
					<strong>{franqueado.Email ?? '???'}</strong>
				</Typography>
				<Typography variant='overline'>
					<strong>
						({franqueado.DDD ?? '??'}) {franqueado.Fone ?? '? ????-????'}
					</strong>
				</Typography>

				{/* <Typography>{pdv.AnxDesc}</Typography> */}
			</div>
		</div>
	);
};

const statusDaTelemetria = (lr) => {
	if (lr === null) {
		return 'offline';
	}

	// TESTAR MÁQUINA QUE NÃO TEM NENHUMA LEITURA

	const maxDtDiffOk = 24;
	const datediff = moment().subtract(3, 'h').diff(moment(lr.DataLeitura), 'h');
	return datediff < maxDtDiffOk ? 'online' : 'offline';
};

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		width: '50%',
		height: '100%',
		backgroundColor: '#FFF',
		padding: '1% 1% 0px 1%',

		'@media (max-width: 900px)': {
			width: '100%',
		},
	},
	imgContainer: {
		display: 'flex',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
		maxWidth: '300px',
		marginBottom: '8px',
		maxHeight: '300px',
		padding: '2rem',
		borderRadius: '4px',
		boxShadow:
			'0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
	},
	img: {
		height: '100%',
	},
	infoContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '300px',
	},
	divider: {
		width: '100%',

		'@media (max-width: 900px)': {
			width: '200px',
		},
	},
}));
