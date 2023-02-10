import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { saveAs } from 'file-saver';

import FindInPage from '@material-ui/icons/FindInPage';

import Loading from '../../components/loading_screen';
import { Table } from '../../components/table';
import { Toast } from '../../components/toasty';
import { dateCheck, convertData } from '../../misc/commom_functions';
import Button from '../../components/materialComponents/Button';
import { RED_SECONDARY } from '../../misc/colors';

import AdmDialog from '../gerenciarSolicitacoes/modals/admDialog';
import HistoryDialog from '../gerenciarSolicitacoes/modals/historyDialog';

export const Logs = () => {
	const [logs, setLogs] = useState([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		LoadData();
	}, []);

	const LoadData = async () => {
		try {
			const response = await api.get('/equip/requests/own');

			setLogs(response.data);
			setLoaded(true);
		} catch (err) {
			setLogs([]);
			setLoaded(false);
		}
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
			saveAs(blob, `OS${OSID}_${dateCheck()}.pdf`);
		} catch (err) {
			Toast('Falha ao recuperar PDF do servidor', 'update', toastId, 'error');
		}
	};

	return !loaded ? (
		<Loading />
	) : logs.length > 0 ? ( //Se nao tiver nenhum log, nem mostra a estrutura da tabela
		<Table hoverable={true} responsive={true} centered>
			<thead>
				<tr>
					<th>Solicitação Nº</th>
					<th>Status</th>
					<th>Pendência</th>
					<th>Data de solicitação</th>
					<th>Data pretendida</th>
					<th>Data prevista</th>
					<th>Gerenciar</th>
					<th>Histórico</th>
					<th>PDF</th>
				</tr>
			</thead>
			<tbody>
				{logs.map((log, i) => (
					<tr>
						<td align='center'>{log.OSCId}</td>
						<td align='center'>{log.OSCStatus}</td>
						<td align='center'>
							<strong>{log.Stage}</strong>
						</td>
						<td align='center'>{convertData(log.Datas.OSCDtSolicita)}</td>
						<td align='center'>{convertData(log.Datas.OSCDtPretendida)}</td>
						<td align='center'>
							{log.Assinaturas.OSCExpDtPrevisao !== ''
								? convertData(log.Assinaturas.OSCExpDtPrevisao)
								: ''}
						</td>
						<td align='center' style={{ padding: '0', textAlign: 'center' }}>
							<AdmDialog Req={log} />
						</td>
						<td align='center' style={{ padding: '0', textAlign: 'center' }}>
							<HistoryDialog Req={log} />
						</td>
						<td align='center' style={{ padding: '0', textAlign: 'center' }}>
							<Button
								style={{
									color: '#FFFFFF',
									backgroundColor: RED_SECONDARY,
								}}
								onClick={() => handleRetrivePDF(log.OSCId)}
							>
								<FindInPage />
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	) : (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignContent: 'center',
			}}
		>
			<h5>Você ainda não fez nenhuma solicitação!</h5>
		</div>
	);
};
