import React from 'react';

import {
	Step,
	StepLabel,
	Stepper,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { Edit as EditIcon } from '@material-ui/icons';

export const FormStepper = ({ stepsName, section, formFinished }) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<div
			className='YAlign'
			style={{
				alignItems: 'center',
				justifyContent: 'flex-start',
				height: '100%',
				maxHeight: '500px',
				width: fullScreen ? '100%' : 'unset',
				overflowY: 'auto',
			}}
		>
			<div
				style={{
					borderRadius: '4px',
					marginTop: '16px',
					background: 'rgba(255, 255, 255, 0.2)',
					width: fullScreen ? '100%' : 'unset',
				}}
			>
				<Stepper
					activeStep={whichStepIsActive(
						fullScreen,
						section,
						stepsName,
						formFinished
					)}
					orientation='vertical'
					style={{
						background: 'transparent',
					}}
				>
					{whichStepDisplay(
						fullScreen,
						stepsName,
						section,
						formFinished,
						classes
					)}
				</Stepper>
			</div>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	StepLabelNumber: {
		'& > span.MuiStepLabel-iconContainer > svg > circle': {
			color: '#0056C7',
			backgroundColor: '#0056C7',
		},
		'& > span.MuiStepLabel-iconContainer > svg > path': {
			color: '#65e305',
			backgroundColor: '#65e305',
		},
	},
}));

const whichStepDisplay = (
	fullScreen,
	stepsName,
	section,
	formFinished,
	classes
) => {
	if (formFinished) {
		return (
			<Step>
				<StepLabel className={classes.StepLabelNumber}>Finalizado!</StepLabel>
			</Step>
		);
	} else if (fullScreen) {
		let a = stepsName.map((label, index) => {
			if (section === index || section === index + 1 || section === index - 1) {
				return (
					<Step key={label}>
						<StepLabel icon={index + 1} className={classes.StepLabelNumber}>
							{label}
							{section === index ? (
								<EditIcon
									fontSize='small'
									style={{
										marginLeft: '8px',
									}}
								/>
							) : null}
						</StepLabel>
					</Step>
				);
			} else {
				return null;
			}
		});

		a = a.filter((pos) => pos !== null);

		if (section - 1 > 0) {
			a.unshift(
				<Step key={stepsName[section - 2]}>
					<StepLabel icon={`?`} className={classes.StepLabelNumber}>
						...
					</StepLabel>
				</Step>
			);
		}

		if (section + 2 < stepsName.length) {
			a.push(
				<Step key={stepsName[section + 2]}>
					<StepLabel icon={`?`} className={classes.StepLabelNumber}>
						...
					</StepLabel>
				</Step>
			);
		}

		return a;
	} else {
		return stepsName.map((label, index) => (
			<Step key={label}>
				<StepLabel className={classes.StepLabelNumber}>
					{label}
					{section === index ? (
						<EditIcon
							fontSize='small'
							style={{
								marginLeft: '8px',
							}}
						/>
					) : null}
				</StepLabel>
			</Step>
		));
	}
};

const whichStepIsActive = (fullScreen, section, stepsName, formFinished) => {
	if (formFinished) {
		return 1;
	} else if (fullScreen) {
		if (section < 2) {
			return section;
		} else if (section + 2 > stepsName.length) {
			return section - stepsName.length + 3;
		} else {
			return 2;
		}
	} else {
		return section;
	}
};
