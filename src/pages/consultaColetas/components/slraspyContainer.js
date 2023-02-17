import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';

import {
	AppBar,
	Dialog,
	IconButton,
	makeStyles,
	Slide,
	Toolbar,
	Typography,
	useMediaQuery,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Toast } from '../../../components/toasty';

import { RaspyOptions } from './RaspyOptions';
import { RaspyList } from './RaspyList';

export const RaspyContainer = ({
	selectedAnx,
	onSelectAnx,
	selectedAnxName,
}) => {
	const classes = useStyles();
	const isMdUp = useMediaQuery('@media (min-width: 1080px)');

	const [fetching, setFetching] = useState(false);
	const [leituras, setLeituras] = useState([]);
	const [raspy, setRaspy] = useState([]);
	const [selectedMargem, setSelectedMargem] = useState({ de: null, ate: null });

	const handleClose = () => {
		onSelectAnx(null);
	};

	useEffect(() => {
		if (selectedMargem.de !== null && selectedMargem.ate !== null) {
			fetchRaspy();
		} else {
			setRaspy([]);
		}
		// eslint-disable-next-line
	}, [selectedMargem]);

	useEffect(() => {
		setRaspy([]);
		setSelectedMargem({ de: null, ate: null });
		setLeituras([]);
		if (selectedAnx !== null) {
			fetchLeituras();
		}
		// eslint-disable-next-line
	}, [selectedAnx]);

	const fetchLeituras = async () => {
		try {
			const response = await api.get(`/raspy/${selectedAnx}`);

			setLeituras(response.data.leituras);
		} catch (err) {
			setLeituras([]);
		}
	};

	const fetchRaspy = async () => {
		let toastId = null;
		toastId = Toast('Bucando vendas...', 'wait');

		setFetching(true);

		try {
			const response = await api.get(
				`/raspy/${selectedAnx}/${selectedMargem.de}/${selectedMargem.ate}`
			);

			Toast('Vendas encontradas', 'update', toastId, 'success');
			setRaspy(response.data.raspy);
			setFetching(false);
		} catch (err) {
			Toast(
				'Falha ao recuperar vendas do servidor',
				'update',
				toastId,
				'error'
			);
			setRaspy([]);
			setSelectedMargem({ de: null, ate: null });
			setFetching(false);
		}
	};

	const ContainerContent = () => (
		<div className={classes.root}>
			<RaspyOptions
				selectedAnx={selectedAnx}
				leiturasDisponiveis={leituras}
				onUpdateMargem={setSelectedMargem}
				margemSelecionada={selectedMargem}
			/>
			{raspy.map((r) => (
				<RaspyList
					selectedAnx={selectedAnx}
					selectedAnxName={selectedAnxName}
					margemSelecionada={selectedMargem}
					Equip={r}
					isFetching={fetching}
				/>
			))}
		</div>
	);

	return isMdUp ? (
		<ContainerContent />
	) : (
		<Dialog
			fullScreen
			TransitionComponent={Transition}
			open={selectedAnx}
			onClose={handleClose}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={handleClose}
						aria-label='close'
					>
						<CloseIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						Vendas em {selectedAnxName}
					</Typography>
				</Toolbar>
			</AppBar>
			<ContainerContent />
		</Dialog>
	);
};

const useStyles = makeStyles((theme) => ({
	root: {
		overflowY: 'auto',
		width: '100%',
		margin: '0px 0px 0px 8px',
		boxShadow:
			'0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%)',
	},
	appBar: {
		position: 'relative',
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction='up' ref={ref} {...props} />;
});
