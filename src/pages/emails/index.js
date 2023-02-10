import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

import { Panel } from '../../components/commom_in';

import Loading from '../../components/loading_screen';

import { DispatchEmailsModal } from './modals/DispararEmailsModal';
import { EmailsListOptions } from './options';
import { MailHistory } from './mailHistory';

const CentralEmails = () => {
	const [emailHistory, setEmailHistory] = useState([]);

	const [filterWord, setFilterWord] = useState('');
	const [loaded, setLoaded] = useState(false);
	const [dispararEmailsModalOpen, setDispararEmailsModalOpen] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		try {
			const response = await api.get('/emails/history');

			setLoaded(true);
			setEmailHistory(response.data.History);
		} catch (err) {}
	}

	const handleOpenDispararEmailsModal = () => {
		setDispararEmailsModalOpen(true);
	};

	const handleCloseDispararEmailsModal = () => {
		setDispararEmailsModalOpen(false);
	};

	return !loaded ? (
		<Loading />
	) : (
		<Panel>
			<DispatchEmailsModal
				open={dispararEmailsModalOpen}
				onClose={handleCloseDispararEmailsModal}
			/>
			<EmailsListOptions
				onChangeFiltro={setFilterWord}
				onOpenEmailsModal={handleOpenDispararEmailsModal}
			/>
			<MailHistory history={filteredHistory(emailHistory, filterWord)} />
		</Panel>
	);
};

export default CentralEmails;

const filteredHistory = (history, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	if (filterString.trim() === '') {
		return history;
	} else {
		return history.filter(
			(hist) =>
				String(hist.Email).trim().toLowerCase().match(re) ||
				String(hist.M0_CODFIL).trim().toLowerCase().match(re) ||
				String(hist.msg).trim().toLowerCase().match(re) ||
				String(hist.origem).trim().toLowerCase().match(re)
		);
	}
};
