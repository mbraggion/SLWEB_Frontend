import { saveAs } from 'file-saver';
import React from 'react';
import { api } from '../../../services/api';

import {
	AppBar,
	Button,
	Dialog,
	IconButton,
	makeStyles,
	Slide,
	Toolbar,
	Typography,
} from '@material-ui/core/';
import {
	Close,
	AttachFile as AttachFileIcon,
	Description as DescriptionIcon,
} from '@material-ui/icons';

import moment from 'moment/moment';
import { Toast } from '../../../components/toasty';
import { GREY_SECONDARY } from '../../../misc/colors';

export const DetailsModal = ({ Form, isModalOpen, onClose, modalTitle }) => {
	const classes = useStyles();

	const handleDownloadPDF = async () => {
		let toastId = null;
		toastId = Toast('Buscando...', 'wait');

		try {
			const response = await api.get(`/form/pdf/${Form.Cod}`, {
				responseType: 'arraybuffer',
			});

			Toast('Encontrado!', 'update', toastId, 'success');

			//Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
			const blob = new Blob([response.data], { type: 'application/pdf' });

			//Salvo em PDF junto com a data atual, só pra não sobreescrever nada
			saveAs(blob, `Form_${Form.Cod}_${new Date().getTime()}.pdf`);
		} catch (err) {
			Toast('Falha ao recuperar PDF do servidor', 'update', toastId, 'error');
		}
	};

	const handleDownloadZIP = async () => {
		let toastId = null;
		toastId = Toast('Buscando...', 'wait');

		try {
			const response = await api.get(`/form/zip/${Form.Cod}`, {
				responseType: 'arraybuffer',
			});

			Toast('Encontrado!', 'update', toastId, 'success');

			const blob = new Blob([response.data], { type: 'application/zip' });

			saveAs(blob, `Arquivos_${Form.Cod}_${new Date().getTime()}.zip`);
		} catch (err) {
			Toast('Falha ao recuperar ZIP do servidor', 'update', toastId, 'error');
		}
	};

	return (
		<Dialog
			fullScreen
			open={isModalOpen}
			onClose={onClose}
			TransitionComponent={Transition}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge='start'
						color='inherit'
						onClick={onClose}
						aria-label='close'
					>
						<Close />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						{modalTitle}
					</Typography>
					<Button color='inherit' onClick={() => handleDownloadZIP()}>
						<AttachFileIcon />
						Arquivos
					</Button>
					<Button color='inherit' onClick={() => handleDownloadPDF()}>
						<DescriptionIcon />
						PDF
					</Button>
				</Toolbar>
			</AppBar>
			<div className='YAlign'>
				<div style={divAlinha}>
					<div style={divColuna}>
						{Form !== null
							? Object.keys(Form.Questions).map((s, i) => {
									if (i % 2 === 0 && s !== 'Encerramento') {
										return (
											<div style={divMetade}>
												<h5>{s}</h5>

												{Form.Questions[s].map((q) => {
													if (
														q.QuestionAnswer !== null &&
														q.QuestionAnswer !== ''
													) {
														return (
															<div style={divLinha}>
																<Typography gutterBottom>
																	{q.QuestionSlug}:{' '}
																	<strong style={{ color: 'red' }}>
																		{q.QuestionType === 'date'
																			? moment(q.QuestionAnswer).format('L')
																			: q.QuestionAnswer}
																	</strong>
																</Typography>
															</div>
														);
													} else {
														return null;
													}
												})}
											</div>
										);
									} else {
										return null;
									}
							  })
							: null}
					</div>
					<div style={divColuna}>
						{Form !== null
							? Object.keys(Form.Questions).map((s, i) => {
									if (i % 2 !== 0 && s !== 'Encerramento') {
										return (
											<div style={divMetade}>
												<h5>{s}</h5>

												{Form.Questions[s].map((q) => {
													if (
														q.QuestionAnswer !== null &&
														q.QuestionAnswer !== ''
													) {
														return (
															<div style={divLinha}>
																<Typography gutterBottom>
																	{q.QuestionSlug}:{' '}
																	<strong style={{ color: 'red' }}>
																		{q.QuestionType === 'date'
																			? moment(q.QuestionAnswer).format('L')
																			: q.QuestionAnswer}
																	</strong>
																</Typography>
															</div>
														);
													} else {
														return null;
													}
												})}
											</div>
										);
									} else {
										return null;
									}
							  })
							: null}
					</div>
				</div>
			</div>
		</Dialog>
	);
};

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
		height: '54px',
	},
}));

const divLinha = {
	display: 'flex',
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
};

const divAlinha = {
	display: 'flex',
	flex: 1,
	width: '100%',
	flexDirection: 'row',
	flexWrap: 'wrap',
	justifyContent: 'center',
	alignItems: 'fle-start',
};

const divMetade = {
	display: 'flex',
	width: '100%',
	padding: '1vw',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'flex-start',
	border: '1px solid #c1c1c1',
};

const divColuna = {
	display: 'flex',
	width: '50%',
	minWidth: '400px',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignContent: 'flex-start',
};
