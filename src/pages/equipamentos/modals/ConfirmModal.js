import React from 'react';
import Draggable from 'react-draggable';

import { ExpandMore } from '@material-ui/icons';
import {
	Typography,
	makeStyles,
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
} from '@material-ui/core';

function ModalPersonalizado(props) {
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	return (
		<div>
			<Dialog
				open={props.open}
				onClose={props.onClose}
				PaperComponent={PaperComponent}
				aria-labelledby='draggable-dialog-title'
			>
				<DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
					{props.title}
				</DialogTitle>

				<DialogContent>
					{props.enderecos.map((endereco, index) => (
						<Accordion
							key={endereco.EquiCod}
							expanded={expanded === endereco.EquiCod}
							onChange={handleChange(endereco.EquiCod)}
						>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls={`${endereco.EquiCod}-content`}
								id={`${endereco.EquiCod}-header`}
							>
								<Typography className={classes.heading}>
									{endereco.EquiCod}
								</Typography>
								<Typography className={classes.secondaryHeading}>
									{endereco.AnxDesc}
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Typography>{makeAddressString(endereco)}</Typography>
							</AccordionDetails>
						</Accordion>
					))}
				</DialogContent>
				<DialogActions style={{ padding: '8px 24px' }}>
					{props.action}
					<Button onClick={props.onClose} color='primary'>
						Fechar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ModalPersonalizado;

function PaperComponent(props) {
	return (
		<Draggable
			{...props}
			handle='#draggable-dialog-title'
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} style={{ maxHeight: '600px' }} />
		</Draggable>
	);
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: '33.33%',
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

const makeAddressString = (PdvData) => {
	let address = '';

	if (
		PdvData.PdvLogradouroPV !== null &&
		String(PdvData.PdvLogradouroPV).trim() !== ''
	) {
		address += String(PdvData.PdvLogradouroPV).trim();
	}

	if (
		PdvData.PdvNumeroPV !== null &&
		String(PdvData.PdvNumeroPV).trim() !== ''
	) {
		address += ', ' + String(PdvData.PdvNumeroPV).trim();
	}

	if (
		PdvData.PdvBairroPV !== null &&
		String(PdvData.PdvBairroPV).trim() !== ''
	) {
		address += ', ' + String(PdvData.PdvBairroPV).trim();
	}

	if (
		PdvData.PdvCidadePV !== null &&
		String(PdvData.PdvCidadePV).trim() !== ''
	) {
		address += ', ' + String(PdvData.PdvCidadePV).trim();
	}

	if (PdvData.PdvUfPV !== null && String(PdvData.PdvUfPV).trim() !== '') {
		address += ' - ' + String(PdvData.PdvUfPV).trim();
	}

	if (PdvData.PdvCEP !== null && String(PdvData.PdvCEP).trim() !== '') {
		address += ', ' + String(PdvData.PdvCEP).trim();
	}

	if (
		PdvData.PdvComplementoPV !== null &&
		String(PdvData.PdvComplementoPV).trim() !== ''
	) {
		address += ' (' + String(PdvData.PdvComplementoPV).trim() + ')';
	}

	return address;
};
