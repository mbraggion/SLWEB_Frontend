import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
	root: {
		minWidth: '400px',
		maxWidth: '400px',
		maxHeight: '300px',
		minHeight: '300px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
});

export default function SimpleCard(props) {
	const classes = useStyles();

	return (
		<Card className={classes.root} {...props}>
			<CardContent style={props.contentStyle}>{props.children}</CardContent>
			<CardActions>{props.action}</CardActions>
		</Card>
	);
}
