import React, { useState } from 'react';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import {
	Dialog,
	IconButton,
	Typography,
	Button,
	Paper,
	MobileStepper,
	DialogTitle as MuiDialogTitle,
	DialogContent as MuiDialogContent,
} from '@material-ui/core';

import {
	Close as CloseIcon,
	KeyboardArrowLeft,
	KeyboardArrowRight,
} from '@material-ui/icons';

import { TableCell, TableRow, TableHeader } from '../Box/style';

export const DetailsModal = ({ open, onClose, title, TMT }) => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) =>
			prevActiveStep === 2 ? 0 : prevActiveStep + 1
		);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) =>
			prevActiveStep === 0 ? 2 : prevActiveStep - 1
		);
	};

	const handleClose = () => {
		onClose();
		setActiveStep(0);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle
				style={{
					minWidth: '300px',
				}}
				onClose={handleClose}
			>
				{title}
			</DialogTitle>
			<DialogContent dividers>
				<div className={classes.root}>
					<Paper square elevation={0} className={classes.header}>
						<Typography>{infoTitle[activeStep]}</Typography>
					</Paper>
					<table>
						<TableRow>
							<TableHeader>Periodo</TableHeader>
							<TableHeader>{tableHeader[activeStep]}</TableHeader>
						</TableRow>
						<TableRow>
							<TableCell>Esta Semana</TableCell>
							<TableCell
								style={{
									color:
										TMT[tableField[activeStep][0]] === null
											? 'rgb(217, 83, 79)'
											: '#000',
								}}
							>
								{TMT[tableField[activeStep][0]] !== null
									? TMT[tableField[activeStep][0]]
									: 'Desconhecido'}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Há uma Semana</TableCell>
							<TableCell
								style={{
									color:
										TMT[tableField[activeStep][1]] === null
											? 'rgb(217, 83, 79)'
											: '#000',
								}}
							>
								{TMT[tableField[activeStep][1]] !== null
									? TMT[tableField[activeStep][1]]
									: 'Desconhecido'}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Há duas Semana</TableCell>
							<TableCell
								style={{
									color:
										TMT[tableField[activeStep][2]] === null
											? 'rgb(217, 83, 79)'
											: '#000',
								}}
							>
								{TMT[tableField[activeStep][2]] !== null
									? TMT[tableField[activeStep][2]]
									: 'Desconhecido'}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Há três Semana</TableCell>
							<TableCell
								style={{
									color:
										TMT[tableField[activeStep][3]] === null
											? 'rgb(217, 83, 79)'
											: '#000',
								}}
							>
								{TMT[tableField[activeStep][3]] !== null
									? TMT[tableField[activeStep][3]]
									: 'Desconhecido'}
							</TableCell>
						</TableRow>
					</table>
					<MobileStepper
						steps={3}
						position='static'
						variant='text'
						activeStep={activeStep}
						nextButton={
							<Button size='small' onClick={handleNext} disabled={false}>
								<KeyboardArrowRight />
							</Button>
						}
						backButton={
							<Button size='small' onClick={handleBack} disabled={false}>
								<KeyboardArrowLeft />
							</Button>
						}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant='h6'>{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label='close'
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});

const DialogContent = withStyles((theme) => ({
	root: {
		padding: '0px 8px',
	},
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 400,
		flexGrow: 1,
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		height: 50,
		backgroundColor: theme.palette.background.default,
	},
	img: {
		height: 255,
		maxWidth: 400,
		overflow: 'hidden',
		display: 'block',
		width: '100%',
	},
}));

const infoTitle = ['CONTADOR GERAL', 'LEITURAS NA SEMANA', 'DOSES CONSUMIDAS'];
const tableHeader = ['Contador', 'Qtd. Leituras', 'Doses'];
const tableField = [
	['Con0', 'Con-1', 'Con-2', 'Con-3', 'Con-4'],
	['Ql0', 'Ql-1', 'Ql-2', 'Ql-3', 'Ql-4'],
	['Prd', 'Prd1', 'Prd2', 'Prd3'],
];
