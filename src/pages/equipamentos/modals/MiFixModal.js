import React from 'react';

import { Close } from '@material-ui/icons';
import {
	makeStyles,
	Dialog,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Slide,
} from '@material-ui/core';

import { GREY_SECONDARY } from '../../../misc/colors';
import Loading from '../../../components/loading_screen';

const FullScreenDialog = (props) => {
	const classes = useStyles();

	return (
		<Dialog
			fullScreen
			open={props.open}
			onClose={() => props.onClose()}
			TransitionComponent={Transition}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={() => props.onClose()}
						aria-label='close'
					>
						<Close />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						Chamados MiFix
					</Typography>
				</Toolbar>
			</AppBar>
			<Loading />
		</Dialog>
	);
};

export default FullScreenDialog;

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	appBar: {
		position: 'relative',
		backgroundColor: GREY_SECONDARY,
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	button: {
		marginLeft: '8px',
		marginBottom: '8px',
		color: GREY_SECONDARY,
		height: '54px',
		border: `1px solid ${GREY_SECONDARY}`,
		'&:hover': {
			border: `1px solid ${GREY_SECONDARY}`,
		},
	},
}));
