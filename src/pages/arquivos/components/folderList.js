import React from 'react';

import { makeStyles } from '@material-ui/styles';

import { Folder } from './folder';

import { useFiles } from '../../../hooks/useFiles';

export const FolderList = () => {
	const classes = useStyles();
	const {
		data: { folders, folderPath },
	} = useFiles();

	return (
		<section className={classes.folders}>
			{folderPath.length > 1 ? (
				<Folder folder={{ folder: 'VOLTAR', path: '' }} type='empty' />
			) : null}

			{folders.map((f) => (
				<Folder key={f.path} folder={f} type='folder' />
			))}
		</section>
	);
};

const useStyles = makeStyles((theme) => ({
	folders: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		overflowY: 'auto',
		height: '133px',
		flexShrink: 0,
	},
}));
