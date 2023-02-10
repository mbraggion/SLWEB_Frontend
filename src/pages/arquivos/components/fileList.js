import React from 'react';

import { makeStyles } from '@material-ui/styles';
import { List, Button, Typography } from '@material-ui/core';
import {
	DoneAll as DoneAllIcon,
	ClearAll as ClearAllIcon,
} from '@material-ui/icons';

import { File } from './file';

import { useFiles } from '../../../hooks/useFiles';

export const FileList = () => {
	const classes = useStyles();
	const {
		data: { files, markedItems },
		actions: { onMarkAllItems },
	} = useFiles();

	return (
		<section className={classes.container}>
			{files.length === 0 ? (
				<>
					<Typography
						align='center'
						variant='h6'
						style={{
							padding: '16px 0px',
						}}
					>
						Nenhum arquivo nesta pasta
					</Typography>
				</>
			) : (
				<List dense className={classes.root}>
					{files.map((f) => (
						<File file={f} key={f.path} />
					))}
				</List>
			)}

			{files.length > 0 ? (
				<Button
					className={classes.buttonRight}
					disabled={files.length === 0}
					onClick={onMarkAllItems}
					startIcon={
						markedItems.length === files.length ? (
							<ClearAllIcon />
						) : (
							<DoneAllIcon />
						)
					}
				>
					{markedItems.length === files.length
						? 'Desmarcar todos'
						: 'Marcar todos'}
				</Button>
			) : null}
		</section>
	);
};

const useStyles = makeStyles((theme) => ({
	container: {
		width: '100%',
		height: 'calc(100% - 133px)',
		backgroundColor: theme.palette.background.paper,
	},
	root: {
		overflowY: 'auto',
		height: 'calc(100% - 43px)',
	},
	buttonRight: {
		width: '100%',
	},
}));
