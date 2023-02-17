import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';

import {
	Dialog,
	DialogContent,
	DialogTitle as MuiDialogTitle,
	useMediaQuery,
	IconButton,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@material-ui/core/';
import { useTheme, withStyles, makeStyles } from '@material-ui/core/styles';
import {
	Close as CloseIcon,
	FolderSpecial as FolderSpecialIcon,
	Folder as FolderIcon,
	Description as DescriptionIcon,
	Help as HelpIcon,
	Delete as DeleteIcon,
	PermMedia as PermMediaIcon,
	FolderShared as FolderSharedIcon,
} from '@material-ui/icons';

export const SecurityModal = ({ open, onClose }) => {
	const theme = useTheme();
	const classes = useStyles();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [indexedFolders, setIndexedFolders] = useState([]);
	const [operType, setOperType] = useState([]);
	const [wait, setWait] = useState(false);

	const LoadData = async () => {
		try {
			const response = await api.get('/files/permissions/');

			setIndexedFolders(response.data.indexedFolders);
			setOperType(response.data.tipoOperadores);
		} catch (err) {}
	};

	useEffect(() => {
		if (open) LoadData();
	}, [open]);

	const handleClose = () => {
		if (wait) return;
		onClose();
		setWait(false);
		setIndexedFolders([]);
		setOperType([]);
	};

	const handleUpdateGroup = async (indexedFolder, newGroup) => {
		setWait(true);
		let oldGroup = null;

		setIndexedFolders((oldState) => {
			let aux = [...oldState];
			let index = null;

			aux.forEach((inf, i) => {
				if (inf.path === indexedFolder.path) {
					index = i;
				}
			});

			oldGroup = aux[index].AccessLevel;
			aux[index].AccessLevel = newGroup;

			return aux;
		});

		try {
			await api.put('/files/permissions/', {
				path: encodeURI(indexedFolder.path),
				newGroup: newGroup,
			});

			setWait(false);
		} catch (err) {
			setIndexedFolders((oldState) => {
				let aux = [...oldState];
				let index = null;

				aux.forEach((inf, i) => {
					if (inf.path === indexedFolder.path) {
						index = i;
					}
				});

				aux[index].AccessLevel = oldGroup;

				return aux;
			});
			setWait(false);
		}
	};

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={handleClose}
			aria-labelledby='responsive-dialog-title'
		>
			<DialogTitle id='customized-dialog-title' onClose={handleClose}>
				Permissões
			</DialogTitle>

			<DialogContent dividers>
				{indexedFolders.length > 0 ? (
					<List dense={true}>
						{indexedFolders.map((item) => (
							<ListItem key={item.path}>
								<ListItemAvatar>
									<Avatar>{whichIconShow(item.type)}</Avatar>
								</ListItemAvatar>
								<ListItemText primary={item.path_alias} secondary={item.path} />
								<FormControl className={classes.formControl}>
									<InputLabel id='demo-simple-select-label'>Grupo</InputLabel>
									<Select
										labelId='demo-simple-select-label'
										id='demo-simple-select'
										value={Number(item.AccessLevel)}
										onChange={(e) => handleUpdateGroup(item, e.target.value)}
										disabled={
											wait || (item.type !== 'file' && item.type !== 'folder')
										}
									>
										{operType.map((op) => (
											<MenuItem
												key={op.AccessLevel}
												value={Number(op.AccessLevel)}
											>
												{op.Group} - {op.Members}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</ListItem>
						))}
					</List>
				) : (
					<Typography variant='subtitle1'>Aguarde.</Typography>
				)}
			</DialogContent>
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		width: '120px',
		display: 'flex',
		flexShrink: 0,
	},
	inline: {
		display: 'inline',
	},
}));

const styles = (theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(2),
		minWidth: 500,
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

const whichIconShow = (type) => {
	switch (type) {
		case 'ROOT':
			return <FolderSpecialIcon color='primary' />;
		case 'FRANQUEADO_DUMP':
			return <FolderSharedIcon color='primary' />;
		case 'PRIVATE_DUMP':
			return <PermMediaIcon color='primary' />;
		case 'TRASH_DUMP':
			return <DeleteIcon color='primary' />;
		case 'file':
			return <DescriptionIcon color='secondary' />;
		case 'folder':
			return <FolderIcon color='secondary' />;
		default:
			return <HelpIcon />;
	}
};
