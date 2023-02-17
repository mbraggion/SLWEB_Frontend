import React from 'react';

import { Close as CloseIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import {
	Dialog,
	AppBar,
	Toolbar,
	IconButton,
	Slide,
	Typography,
} from '@material-ui/core';

export const NovaColetaModal = (props) => {
	const classes = useStyles();

	return (
		<Dialog
			fullScreen
			TransitionComponent={Transition}
			open={props.open}
			onClose={props.onClose}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={props.onClose}
						aria-label='close'
					>
						<CloseIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						{props.title}
					</Typography>
				</Toolbar>
			</AppBar>
			<div className={classes.container}>{props.children}</div>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	container: {
		display: 'flex',
		overflowY: 'auto',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		height: '100%',
		width: '100%',
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});
