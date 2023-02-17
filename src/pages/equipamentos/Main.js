import React from 'react';

import { Build, Sync, CropFree } from '@material-ui/icons';
import { Typography, Tooltip, Button, makeStyles } from '@material-ui/core';

import { GREY_PRIMARY } from '../../misc/colors';

function MainSection(props) {
	const classes = useStyles();

	return (
		<div
			className='YAlign'
			style={{
				flex: '1',
				width: '100%',
				border: `1px solid ${GREY_PRIMARY}`,
				maxHeight: '600px',
				overflow: 'auto',
				borderRadius: '0px 0px 8px 8px',
				alignItems: 'center',
				justifyContent: 'flex-start',
				flexWrap: 'noWrap',
			}}
		>
			{props.Ativos.map((item) => (
				<div className={classes.root} key={item.EquiCod}>
					<div className='YAlign'>
						<Typography variant='h6'>{item.Nome_Fantasia}</Typography>
						<Typography variant='subtitle1'>Modelo: {item.EquiDesc}</Typography>
						<Typography variant='subtitle1'>
							Matrícula: {item.EquiCod}
						</Typography>
					</div>

					<div
						className='XAlign'
						style={{
							flexWrap: 'nowrap',
							width: 'unset',
						}}
					>
						<div
							className={classes.QrCodeButton}
							onClick={() => props.onOpenQRModal(item.EquiCod)}
						>
							<CropFree fontSize='large' />
							QR CODE
						</div>
						<div
							className='YAlign'
							style={{
								alignItems: 'flex-end',
								flex: 'unset',
							}}
						>
							<Tooltip
								title={
									<label
										style={{
											fontSize: '14px',
											color: '#FFF',
											lineHeight: '20px',
										}}
									>
										Remanejar Ativo
									</label>
								}
								placement='left'
								arrow
							>
								<Button
									style={{ marginBottom: '8px' }}
									color='primary'
									variant='contained'
									disabled={false}
									onClick={() => props.onOpenLinkModal(item.EquiCod)}
								>
									<Build />
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
										Sincronizar TMT
									</label>
								}
								placement='left'
								arrow
							>
								<Button
									color={props.isInCooldown ? 'secondary' : 'primary'}
									variant='outlined'
									disabled={props.isInCooldown || item.Nome_Fantasia === null}
									onClick={() => props.onSync(item.EquiCod)}
								>
									{props.isInCooldown !== false ? props.isInCooldown : <Sync />}
								</Button>
							</Tooltip>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default MainSection;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		padding: '8px 16px',
		borderBottom: '1px solid #ccc',

		'&:last-child': {
			borderBottom: 'none',
		},
	},
	QrCodeButton: {
		height: '74px',
		width: '74px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		border: `1px dashed ${GREY_PRIMARY}`,
		marginRight: '8px',
		borderRadius: '4px',
		cursor: 'pointer',

		'&:hover': {
			transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
			backgroundColor: '#CCC',
		},
	},
}));
