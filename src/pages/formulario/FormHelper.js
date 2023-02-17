import React from 'react';

import {
	LinearProgress,
	Typography,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import {
	CheckCircle as CheckCircleIcon,
	SyncDisabled as SyncDisabledIcon,
} from '@material-ui/icons';
import { CircularStatic } from './components/progressCircle';

export const FormHelper = ({
	loading,
	question,
	sectionLength,
	submitError,
	formFinished,
}) => {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<div
			className='YAlign'
			style={{
				alignItems: fullScreen ? 'center' : 'flex-end',
				justifyContent: fullScreen ? 'center' : 'flex-start',
				height: fullScreen ? 'unset' : '100%',
				width: fullScreen ? '100%' : 'unset',
				maxHeight: fullScreen ? 'unset' : '500px',
				padding: fullScreen ? '16px 0px 16px 0px' : '16px 32px 0px 0px',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: fullScreen ? 'row' : 'column',
					alignItems: fullScreen ? 'center' : 'flex-start',
					justifyContent: fullScreen ? 'space-between' : 'flex-start',
					padding: '8px 40px',
					borderRadius: '4px',
					background: 'rgba(255, 255, 255, 0.2)',
					width: fullScreen ? '100%' : 'unset',
				}}
			>
				{whichHelperDisplay(
					loading,
					question,
					sectionLength,
					submitError,
					fullScreen,
					formFinished
				)}
			</div>
		</div>
	);
};

const whichHelperDisplay = (
	loading,
	question,
	sectionLength,
	submitError,
	fullScreen,
	formFinished
) => {
	if (loading && !submitError && !formFinished) {
		return (
			<>
				<Typography variant='h6'>Salvando...</Typography>
				<LinearProgress
					style={{
						width: '100%',
						marginLeft: fullScreen ? '32px' : '0px',
					}}
				/>
			</>
		);
	} else if (loading && submitError && !formFinished) {
		return (
			<>
				<Typography variant='h6'>Falha</Typography>
				<SyncDisabledIcon fontSize='large' color='primary' />
			</>
		);
	} else if (!loading && !formFinished) {
		return (
			<>
				<Typography variant='h6'>Progresso</Typography>
				<CircularStatic progress={(question / sectionLength) * 100} />
			</>
		);
	} else {
		return (
			<>
				<Typography variant='h6'>CONCLUÍDO!</Typography>
				<CheckCircleIcon fontSize='large' color='primary' />
			</>
		);
	}
};
