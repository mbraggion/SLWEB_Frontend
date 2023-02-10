import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { makeStyles } from '@material-ui/core';
import Loading from '../../components/loading_screen';
import Logo from '../../assets/Logo/logo_fhd.jpg';
import Fundo from '../../assets/background/black-white-wall.jpg';
import Image from '../../assets/svg/undraw_Current_location.svg';

import { AtivoInfo } from './components/ativoInfo';
// import { ConfiguracaoList } from './components/configuracaoList'
import { LeiturasList } from './components/leiturasList';

const Auditoria = ({ match }) => {
	const [loading, setLoading] = useState(true);
	const [audit, setAudit] = useState({
		acesso: null,
		data: {
			leituras: [],
			pdf: {},
			config: [],
			franqueado: {},
			telemetriaId: null,
		},
	});

	const classes = useStyles();

	useEffect(() => {
		loadData(match.params.uuid);
		// eslint-disable-next-line
	}, []);

	const loadData = async (uuid) => {
		try {
			const response = await api.get(`/audit/show/${uuid}`);

			setLoading(false);
			setAudit(response.data);
		} catch (err) {
			setLoading(false);
		}
	};

	const getContent = ({ acesso, data }) => {
		switch (acesso) {
			case 'disponivel':
				return (
					<>
						{/* <ConfiguracaoList configuracao={data.config} /> */}
						<LeiturasList
							leituras={data.leituras}
							telemetriaId={data.telemetriaId}
							uuid={match.params.uuid}
							anxid={data.pdv.AnxId}
							pdvid={data.pdv.PdvId}
							status={audit.acesso}
						/>
						<AtivoInfo
							pdv={data.pdv}
							leituraMaisRecente={data.leituras[0] ?? null}
							franqueado={data.franqueado}
						/>
					</>
				);
			case 'desabilitado':
				return (
					<>
						<LeiturasList
							leituras={[]}
							telemetriaId={null}
							uuid={match.params.uuid}
							anxid={data.pdv.AnxId}
							pdvid={data.pdv.PdvId}
							status={audit.acesso}
						/>
						<AtivoInfo
							pdv={data.pdv}
							leituraMaisRecente={data.leituras[0] ?? null}
							franqueado={data.franqueado}
							status={audit.acesso}
						/>
					</>
				);
			case 'movido':
				return (
					<div className='not_found'>
						<img src={Image} alt='Pagina de erro - Perdido' />
						<div className='not_found_lost'>
							<h1>Ops!</h1>
							<h5>O link que está tentando acessar não está mais disponível</h5>
						</div>
					</div>
				);
			default:
				return (
					<div className='not_found'>
						<img src={Image} alt='Pagina de erro - Perdido' />
						<div className='not_found_lost'>
							<h1>Ops!</h1>
							<h5>O link que está tentando acessar está quebrado</h5>
						</div>
					</div>
				);
		}
	};

	return loading ? (
		<Loading />
	) : (
		<div className={classes.container}>
			<header className={classes.header}>
				<a
					href='https://www.pilaoprofessional.com.br'
					target='_blank'
					rel='noopener noreferrer'
				>
					<img
						className={classes.headerImg}
						src={Logo}
						alt='Logo Pilão Professional'
					/>
				</a>
			</header>
			<div className={classes.content}>{getContent(audit)}</div>
		</div>
	);
};

export default Auditoria;

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		height: '100vh',
		width: '100vw',
		flexDirection: 'column',
		backgroundImage: `url(${Fundo})`,
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		// backgroundColor: '#1b1b1b',
	},
	header: {
		display: 'flex',
		justifyContent: 'flex-start',
		width: '100%',
		height: '70px',
		backgroundColor: '#cf0b2c',
		padding: '0px 0px 0px 10%',
	},
	headerImg: {
		height: '70px',
	},
	content: {
		display: 'flex',
		flexDirection: 'row',
		height: '100%',
		margin: '5% 10%',
		boxShadow:
			'0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
		overflowY: 'auto',
		overflowX: 'hidden',
		backgroundColor: '#FFF',
		borderRadius: '4px',

		'@media (max-width: 900px)': {
			flexDirection: 'column-reverse',
			height: 'auto',
			margin: '0px',
		},
	},
}));
