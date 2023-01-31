import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { api } from '../../services/api';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
	makeStyles,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
} from '@material-ui/core';

import Loading from '../../components/loading_screen';
import { Toast } from '../../components/toasty';
import { Panel } from '../../components/commom_in';
import { dateCheck } from '../../misc/commom_functions';
// import {
//   RED_PRIMARY,
//   GREEN_SECONDARY,
//   BLUE_SECONDARY,
//   ORANGE_SECONDARY,
// } from "../../misc/colors";

import SolList from './SolList';

import { SolicitacoesOptions } from './options';

const Management = () => {
	const [OSS, setOSS] = useState([]);
	// const [stages, setStages] = useState({
	// 	Total: 0,
	// 	Ativas: 0,
	// 	Concluidas: 0,
	// 	Canceladas: 0,
	// 	Supervisao: 0,
	// 	Comercial: 0,
	// 	Tecnica: 0,
	// 	Montagem: 0,
	// 	Expedicao: 0,
	// 	Entregando: 0,
	// });
	const [loaded, setLoaded] = useState(false);
	const [expanded, setExpanded] = useState('panel1');
	const [filtro, setFiltro] = useState('');
	const [mostrarPendencias, setMostrarPendencias] = useState(true);

	const classes = useStyles();
	const status = ['Ativo', 'Cancelado', 'Concluido'];

	useEffect(() => {
		LoadData();
	}, []);

	async function LoadData() {
		setLoaded(false);
		try {
			const response = await api.get('/equip/requests/all');

			setOSS(response.data.oss);
			// setStages(response.data.status);
			setLoaded(true);
		} catch (err) {}
	}

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const handleRetrivePDF = async (OSID) => {
		let toastId = null;

		try {
			toastId = Toast('Buscando...', 'wait');

			const response = await api.get(`/equip/requests/retrive/${OSID}`, {
				responseType: 'arraybuffer',
			});

			Toast('Encontrado!', 'update', toastId, 'success');
			//Converto a String do PDF para BLOB (Necessario pra salvar em pdf)
			const blob = new Blob([response.data], { type: 'application/pdf' });

			//Salvo em PDF junto com a data atual, só pra não sobreescrever nada
			saveAs(blob, `OS_${dateCheck()}.pdf`);
		} catch (err) {
			Toast('Falha ao recuperar PDF do servidor', 'update', toastId, 'error');
		}
	};

	return !loaded ? (
		<Loading />
	) : (
		<Panel
			style={{
				justifyContent: 'flex-start',
				alignItems: 'center',
			}}
		>
			<SolicitacoesOptions
				onChangeFiltro={setFiltro}
				mostrarPendencias={mostrarPendencias}
				switchPendencias={setMostrarPendencias}
			/>
			{/* <div className={classes.outerContainer}>
        <div className={classes.firstContainer}>
          <label style={{ backgroundColor: RED_PRIMARY }} className={classes.label}>TOTAL: {stages.Total}</label>
        </div>
        <div className={classes.secondContainer}>
          <label style={{ backgroundColor: BLUE_SECONDARY }} className={classes.label}>ATIVAS: {stages.Ativas}</label>
          <label style={{ backgroundColor: GREEN_SECONDARY }} className={classes.label}>CONCLUÍDAS: {stages.Concluidas}</label>
          <label style={{ backgroundColor: ORANGE_SECONDARY }} className={classes.label}>CANCELADAS: {stages.Canceladas}</label>
        </div>
        <div className={classes.thirtyContainer}>
          <label style={{ backgroundColor: '#c9868c' }} className={classes.label}>SUPERVISÃO: {stages.Supervisao}</label>
          <label style={{ backgroundColor: '#be6e74' }} className={classes.label}>COMERCIAL: {stages.Comercial}</label>
          <label style={{ backgroundColor: '#b3565d' }} className={classes.label}>TÉCNICA: {stages.Tecnica}</label>
          <label style={{ backgroundColor: '#a93d46' }} className={classes.label}>MONTAGEM: {stages.Montagem}</label>
          <label style={{ backgroundColor: '#9e252f' }} className={classes.label}>EXPEDIÇÃO: {stages.Expedicao}</label>
          <label style={{ backgroundColor: '#930d18' }} className={classes.label}>ENTREGA: {stages.Entregando}</label>
        </div>
      </div> */}

			<div className={classes.root}>
				{status.map((s) => (
					<Accordion
						expanded={expanded === s}
						onChange={handleChange(s)}
						disabled={
							returnOSsFiltered(
								OSS.filter((OS) => OS.OSCStatus === s),
								mostrarPendencias,
								filtro
							).length === 0
						}
					>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls={`${s}-content`}
							id={`${s}-header`}
						>
							<Typography
								variant='h6'
								style={{
									color: returnCorrectBorderColor(s),
								}}
							>
								{s === 'Ativo'
									? 'Solicitações em Andamento'
									: s === 'Cancelado'
									? 'Solicitações Canceladas'
									: s === 'Concluido'
									? 'Solicitações Concluídas'
									: '???'}
								({OSS.filter((OS) => OS.OSCStatus === s).length})
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<SolList
								OS={returnOSsFiltered(
									OSS.filter((OS) => OS.OSCStatus === s),
									mostrarPendencias,
									filtro
								)}
								onRequestPDF={handleRetrivePDF}
								onRefresh={LoadData}
							/>
						</AccordionDetails>
					</Accordion>
				))}
			</div>
		</Panel>
	);
};

export default Management;

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		height: 'calc(100% - 100px)',
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},

	outerContainer: {
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		height: 'auto',
	},
	firstContainer: {
		display: 'flex',
		width: '100%',
		height: 'auto',
		justifyContent: 'center',
	},
	secondContainer: {
		display: 'flex',
		width: '100%',
		height: 'auto',
		justifyContent: 'space-evenly',
	},
	thirtyContainer: {
		display: 'flex',
		width: '100%',
		height: 'auto',
		justifyContent: 'space-evenly',
		margin: '1rem 0 0 0',
		// flexWrap: 'wrap'
	},
	label: {
		fontSize: '1rem',
		padding: '1rem 0px',
		width: '100%',
		textAlign: 'center',
		color: '#FFF',
		fontWeight: 'bolder',

		cursor: 'pointer',
	},
}));

const returnOSsFiltered = (oss, shouldShowPending, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return oss
		.filter((os) => {
			if (!shouldShowPending) {
				return true;
			} else if (
				shouldShowPending &&
				os.Responsavel.includes(window.sessionStorage.getItem('role'))
			) {
				return true;
			} else {
				return false;
			}
		})
		.filter((os) => {
			if (filterString.trim() === '') {
				return true;
			} else if (
				filterString.trim() !== '' &&
				(String(os.OSCId).trim().toLowerCase().match(re) ||
					String(os.M0_CODFIL).trim().toLowerCase().match(re))
			) {
				return true;
			} else {
				return false;
			}
		});
};

const returnCorrectBorderColor = (status) => {
	switch (status) {
		case 'Cancelado':
			return '#f5814c';

		case 'Ativo':
			return '#4f9eff';

		case 'Concluido':
			return '#29ff8d';
		default:
			return '#8403fc';
	}
};
