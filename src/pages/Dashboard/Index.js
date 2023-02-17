import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { Fab, Grow } from '@material-ui/core';
import { Add, Close, Delete, Menu } from '@material-ui/icons';
import { Panel } from '../../components/commom_in';

import { RED_PRIMARY } from '../../misc/colors';
import { roleLevel } from '../../misc/commom_functions';
import { REACT_APP_FRANQUEADO_ROLE_LEVEL } from '../../misc/role_levels';

import { CreateNewsDialog } from './dialogs/CreateNewsDialog';
import { DeleteNewsDialog } from './dialogs/DeleteNewsDialog';
import { NewsDetailsDialog } from './dialogs/NewsDialog';

import { News } from './News';
import { Calendar } from './Calendar';
import { Desempenho } from './Desempenho';
import { Titulos } from './Titulos';

const Dashboard = () => {
	const [newsModalOpen, setNewsModalOpen] = useState(false);
	const [createNewsModalOpen, setCreateNewsModalOpen] = useState(false);
	const [deleteNewsModalOpen, setDeleteNewsModalOpen] = useState(false);
	const [moreOptions, setMoreOptions] = useState(false);
	const [displayedNews, setDisplayedNews] = useState(null);
	const [news, setNews] = useState([]);
	const [performance, setPerformance] = useState([]);
	const [titulos, setTitulos] = useState([]);
	const [datas, setDatas] = useState([]);

	useEffect(() => {
		LoadNews();
	}, []);

	async function LoadNews() {
		try {
			const response = await api.get('/dashboard/news');

			setNews(response.data.News);
			setPerformance(response.data.Performance);
			setTitulos(response.data.Titulos);
			setDatas(response.data.Datas);
		} catch (err) {
			setNews([]);
			setPerformance([]);
			setTitulos([]);
			setDatas([]);
		}
	}

	useEffect(() => {
		for (let i = 0; i < news.length; i++) {
			if (news[i].ModalPrompt === true && news[i].DtConfirmacao === null) {
				handleOpenNewsModal(news[i]);
				break;
			}
		}
	}, [news]);

	const handleOpenCreateNewsModal = () => {
		setCreateNewsModalOpen(true);
	};

	const handleCloseCreateNewsModal = () => {
		setCreateNewsModalOpen(false);
	};

	const handleOpenDeleteNewsModal = () => {
		setDeleteNewsModalOpen(true);
	};

	const handleCloseDeleteNewsModal = () => {
		setDeleteNewsModalOpen(false);
	};

	const handleMoreOptions = () => {
		setMoreOptions((oldState) => !oldState);
	};

	const handleOpenNewsModal = (news) => {
		setNewsModalOpen(true);
		setDisplayedNews(news);
	};

	const handleCloseNewsModal = async () => {
		//da um check que a noticia foi vizualizada
		if (
			displayedNews.ReadConfirm === true &&
			displayedNews.DtConfirmacao === null
		) {
			api
				.post('/dashboard/news/check', {
					newsId: displayedNews.NewsId,
				})
				.then((res) => {
					setNews((oldState) => {
						let aux = [...oldState];

						aux.forEach((nw, i) => {
							if (nw.NewsId === displayedNews.NewsId) {
								aux[i].DtConfirmacao = new Date();
							}
						});

						return aux;
					});
				})
				.catch((err) => {});
		}

		setNewsModalOpen(false);
		// setDisplayedNews(null)
	};

	return (
		<>
			<NewsDetailsDialog
				open={newsModalOpen}
				onClose={handleCloseNewsModal}
				title={displayedNews === null ? '' : displayedNews.ModalHeaderTitle}
				content={displayedNews === null ? '' : displayedNews.ModalContent}
			/>
			<CreateNewsDialog
				open={createNewsModalOpen}
				onClose={handleCloseCreateNewsModal}
			/>
			<DeleteNewsDialog
				open={deleteNewsModalOpen}
				onClose={handleCloseDeleteNewsModal}
				News={news}
				onHandleNews={setNews}
			/>
			<Panel>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
					}}
				>
					<News onOpenModal={handleOpenNewsModal} News={news} />

					{/* <div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '100%',
						}}
					>
						<Calendar dates={datas} />
						<Titulos duplicatas={titulos} />
					</div> */}
					{/* <Desempenho performances={performance} /> */}
				</div>

				{roleLevel() <= REACT_APP_FRANQUEADO_ROLE_LEVEL ? null : (
					<div
						className='YAlign'
						style={{
							position: 'absolute',
							right: '16px',
							bottom: '16px',
							alignItems: 'flex-end',
							zIndex: '999',
						}}
					>
						<Grow
							in={moreOptions}
							style={{ transformOrigin: '0 0 0' }}
							{...(moreOptions ? { timeout: 1000 } : {})}
						>
							<Fab
								onClick={handleOpenDeleteNewsModal}
								variant='extended'
								style={{
									backgroundColor: '#FFF',
									margin: '0px 0px 8px 0px',
									color: RED_PRIMARY,
									width: '100%',
									display: 'flex',
									justifyContent: 'flex-start',
								}}
							>
								<Delete />
								Apagar Notícia
							</Fab>
						</Grow>
						<Grow
							in={moreOptions}
							style={{ transformOrigin: '0 0 0' }}
							{...(moreOptions ? { timeout: 500 } : {})}
						>
							<Fab
								onClick={handleOpenCreateNewsModal}
								variant='extended'
								style={{
									backgroundColor: '#FFF',
									margin: '0px 0px 8px 0px',
									color: '#0062ff',
									width: '100%',
									display: 'flex',
									justifyContent: 'flex-start',
								}}
							>
								<Add />
								Nova Notícia
							</Fab>
						</Grow>
						<Fab
							color={moreOptions ? 'primary' : 'secondary'}
							onClick={handleMoreOptions}
						>
							{moreOptions ? <Close /> : <Menu />}
						</Fab>
					</div>
				)}
			</Panel>
		</>
	);
};

export default Dashboard;
