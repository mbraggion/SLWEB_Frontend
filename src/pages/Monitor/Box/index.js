import React, { useState } from 'react';
import { api } from '../../../services/api';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import {
	Typography,
	Button,
	IconButton,
	Tooltip,
	Badge,
	withStyles,
} from '@material-ui/core';

import {
	StoreMallDirectory as StoreMallDirectoryIcon,
	EmojiFoodBeverage as EmojiFoodBeverageIcon,
	MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons';

import {
	Card,
	TopInfoLabel,
	FirstHalf,
	StateInfoText,
	SecondHalf,
	TelemetryInfo,
	Footer,
	CabContainer,
	ButtonContainer,
	TableCell,
	TableRow,
	TableHeader,
} from './style';
import { Toast } from '../../../components/toasty';

export const MachineCard = ({
	Telemetria,
	onUpdateTelemetrias,
	onOpenChamadoComponent,
	onOpenDetailsComponent,
}) => {
	const history = useHistory();
	const [hover, setHover] = useState(false);

	const handleFecharChamado = async (ativo) => {
		const confirm = window.confirm(
			'Confirmar que o chamado foi atendido e fecha-lo?'
		);
		if (confirm) {
			let toastId = null;
			toastId = Toast('Aguarde...', 'wait');

			try {
				await api.put('/monitor/telemetrias/chamado', {
					ID: ativo.Id,
				});

				Toast('Chamado fechado com sucesso!', 'update', toastId, 'success');

				onUpdateTelemetrias((oldState) => {
					let aux = [...oldState];

					aux.forEach((tel, index) => {
						if (tel.Id === ativo.Id) {
							aux[index].UltChamado = null;
						}
					});

					return aux;
				});
			} catch (er) {
				Toast(
					'Falha ao fechar chamado, tente novamente.',
					'update',
					toastId,
					'error'
				);
			}
		}
	};

	return (
		<StyledBadge
			color='primary'
			badgeContent={
				Telemetria.UltChamado !== null &&
				String(Telemetria.LeitOk).trim() !== 'OK' ? (
					<Typography
						variant='subtitle2'
						onClick={() => handleFecharChamado(Telemetria)}
						onMouseEnter={() => setHover(true)}
						onMouseLeave={() => setHover(false)}
					>
						{hover ? 'FECHAR CHAMADO' : 'CHAMADO ABERTO'}
					</Typography>
				) : null
			}
			variant='standard'
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
		>
			<Card>
				<TopInfoLabel state={String(Telemetria.LeitOk).trim()} />
				<FirstHalf>
					<CabContainer>
						<Typography
							variant='body1'
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							<strong>{Telemetria.AnxDesc}</strong>
						</Typography>
						<Typography variant='subtitle1'>
							Ativo: {String(Telemetria.EquiCod).trim()}
						</Typography>
					</CabContainer>
					<ButtonContainer>
						<Tooltip
							title={
								<label
									style={{
										fontSize: '14px',
										color: '#FFF',
										lineHeight: '20px',
									}}
								>
									{' '}
									Ponto de Venda{' '}
								</label>
							}
							placement='top'
							arrow={true}
						>
							<Button
								style={{ margin: '4px 0px 0px 0px' }}
								variant='outlined'
								color='primary'
								disabled={false}
								onClick={() =>
									history.push(`/pontodevenda/${Telemetria.EquiCod}`)
								}
								size='small'
							>
								<StoreMallDirectoryIcon />
							</Button>
						</Tooltip>
						<Tooltip
							title={
								<label
									style={{
										fontSize: '14px',
										color: '#FFF',
										lineHeight: '20px',
									}}
								>
									{' '}
									Consulta Coletas{' '}
								</label>
							}
							placement='top'
							arrow={true}
						>
							<Button
								style={{ margin: '4px 0px 0px 0px' }}
								variant='outlined'
								color='primary'
								disabled={false}
								onClick={() => history.push(`/leituras/${Telemetria.EquiCod}`)}
								size='small'
							>
								<EmojiFoodBeverageIcon />
							</Button>
						</Tooltip>
					</ButtonContainer>
				</FirstHalf>
				<StateInfoText state={String(Telemetria.LeitOk).trim()}>
					<i>
						{String(Telemetria.LeitOk).trim() === 'OK'
							? 'Online'
							: Telemetria.MáxDeDataLeitura !== null
							? `Última leitura em ${moment(Telemetria.MáxDeDataLeitura).format(
									'DD/MM/YYYY HH:mm:ss'
							  )}`
							: 'Nenhuma leitura recebida'}
					</i>
				</StateInfoText>
				<SecondHalf>
					<TelemetryInfo>
						<table>
							<TableRow>
								<TableHeader>Periodo</TableHeader>
								<TableHeader>Doses</TableHeader>
							</TableRow>
							<TableRow>
								<TableCell>Esta semana</TableCell>
								<TableCell>
									{Telemetria.Prd !== null ? Telemetria.Prd : '-'}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Uma semana</TableCell>
								<TableCell>
									{Telemetria.Prd1 !== null ? Telemetria.Prd1 : '-'}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Duas semanas</TableCell>
								<TableCell>
									{Telemetria.Prd2 !== null ? Telemetria.Prd2 : '-'}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Três semanas</TableCell>
								<TableCell>
									{Telemetria.Prd3 !== null ? Telemetria.Prd3 : '-'}
								</TableCell>
							</TableRow>
						</table>
					</TelemetryInfo>
					<Button
						onClick={() => onOpenChamadoComponent(Telemetria)}
						variant='contained'
						color='primary'
						disabled={String(Telemetria.LeitOk).trim() !== 'KO'}
						size='small'
						style={{
							margin: '8px 0px 0px 8px',
							width: '100px',
						}}
					>
						ABRIR CHAMADO TELEMETRIA
					</Button>
				</SecondHalf>
				<Footer>
					<IconButton onClick={() => onOpenDetailsComponent(Telemetria)}>
						<MoreHorizIcon />
					</IconButton>
				</Footer>
			</Card>
		</StyledBadge>
	);
};

const StyledBadge = withStyles((theme) => ({
	badge: {
		border: `1px dashed #000`,
		background: '#f5f57f',
		padding: '14px 8px',
		color: '#000',
		fontWeight: 'bold',
		bottom: '10px',
		right: '50px',
		transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			background: '#87f786',
			color: '#000',
			border: `1px dashed green`,
			cursor: 'pointer',
		},
	},
}))(Badge);
