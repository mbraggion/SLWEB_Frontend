import React from 'react';
import { Chart } from 'react-google-charts';

import {
	Dialog,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
} from '@material-ui/core/';
import {
	useTheme,
	withStyles,
	// makeStyles
} from '@material-ui/core/styles';
import { Close as CloseIcon } from '@material-ui/icons';
import {
	GREEN_SECONDARY,
	BLUE_SECONDARY,
	ORANGE_SECONDARY,
} from '../../../misc/colors';

export const StatsModal = ({ open, onClose, statsGeral, statsResponsavel }) => {
	const theme = useTheme();
	// const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Estatísticas
			</DialogTitle>

			<DialogContent dividers style={{ padding: 0 }}>
				<Chart
					chartType='PieChart'
					data={statsGeral}
					options={{
						title: "Disposição das OS's",
						colors: [BLUE_SECONDARY, GREEN_SECONDARY, ORANGE_SECONDARY],
						pieHole: 0.4,
						is3D: false,
					}}
					width={'350px'}
					height={'200px'}
				/>
				<Chart
					chartType='PieChart'
					data={statsResponsavel}
					options={{
						title: "Pendências das OS's",
						pieHole: 0.4,
						is3D: false,
					}}
					width={'350px'}
					height={'200px'}
				/>
			</DialogContent>
		</Dialog>
	);
};

// const useStyles = makeStyles((theme) => ({
// 	line: {
// 		display: 'flex',
// 		flexDirection: 'row',
// 		justifyContent: 'flex-start',
// 		alignItems: 'flex-end',
// 		flexWrap: 'nowrap',
// 		minWidth: '400px',
// 	},
// 	infoBox: {
// 		padding: '4px',
// 		border: '1px solid #ccc',
// 	},
// 	formControl: {
// 		minWidth: 120,
// 	},
// }));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		minWidth: 300,
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
