import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveAs } from 'file-saver';
import { api } from '../services/api';

import { Toast } from '../components/toasty';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
	const [loaded, setLoaded] = useState(false);

	const [arquivos, setArquivos] = useState([]);
	const [pastas, setPastas] = useState([]);
	const [enviroment, setEnviroment] = useState('');
	const [folderPath, setFolderPath] = useState([]);
	const [markedItems, setMarkedItems] = useState([]);

	const [shouldShowModals, setShouldShowModals] = useState({
		shouldEnableNewFolderButton: false,
		shouldEnableDownloadButton: false,
		shouldEnableRenameButton: false,
		shouldEnableMoveButton: false,
		shouldEnableBlockButton: false,
		shouldEnableDeleteButton: false,
		shouldEnableUploadButton: false,
		shouldEnableSecurityButton: false,
	});

	const LoadData = async (folder) => {
		if (folder !== 'root') {
			setLoaded(false);
		}

		try {
			setMarkedItems([]);
			const response = await api.get(`/files/lookup/${folder}`);

			setArquivos(response.data.arquivos);
			setPastas(response.data.pastas);
			setFolderPath(response.data.pathSegments);
			setShouldShowModals({
				shouldEnableNewFolderButton: response.data.controlModals.createFolder,
				shouldEnableDownloadButton: response.data.controlModals.downloadContent,
				shouldEnableRenameButton: response.data.controlModals.renameContent,
				shouldEnableMoveButton: response.data.controlModals.moveContent,
				shouldEnableBlockButton: response.data.controlModals.blockContent,
				shouldEnableDeleteButton: response.data.controlModals.deleteContent,
				shouldEnableUploadButton: response.data.controlModals.upload,
				shouldEnableSecurityButton: response.data.controlModals.security,
			});
			setEnviroment(response.data.enviroment);

			setLoaded(true);
		} catch (err) {
			if (folder !== 'root') {
				Toast('Não foi possível acessar a pasta', 'error');
			}
		}
	};

	useEffect(() => {
		LoadData('root');
	}, []);

	const handleClickPath = async (folder) => {
		await LoadData(folder);
	};

	const handleGoBack = () => {
		let actualFolder = folderPath.map((path, i) => {
			if (folderPath.length - 2 === i) {
				return `${path}`;
			} else if (folderPath.length - 1 === i) {
				return ``;
			} else {
				return `${path}\\`;
			}
		});

		LoadData(encodeURI(actualFolder.toString().replace(/,/g, '')));
	};

	const handleBlockFileOrFolderMarked = async () => {
		if (markedItems.length === 0) {
			await BlockPathOrFile(
				'folder',
				folderPath.toString().replace(/,/g, '\\')
			);
		} else {
			let bloqueadoComSucesso = [];

			for (let i = 0; i < markedItems.length; i++) {
				let downloaded = await BlockPathOrFile('file', markedItems[i].path);

				if (downloaded) {
					bloqueadoComSucesso.push(markedItems[i].path);
				}
			}

			setMarkedItems((oldState) => {
				let aux = [...oldState].filter(
					(marked) => bloqueadoComSucesso.indexOf(marked.path) === -1
				);

				return aux;
			});
		}

		return true;
	};

	const handleMoveFileOrFolderMarked = async (OP, NP) => {
		if (markedItems.length === 0) {
			await Move(OP, NP, 'folder');
		} else {
			let movidoComSucesso = [];

			for (let i = 0; i < markedItems.length; i++) {
				let movido = await Move(
					markedItems[i].path,
					`${NP}\\${markedItems[i].filename}`,
					'file'
				);

				if (movido) {
					movidoComSucesso.push(markedItems[i].path);
				}
			}

			setMarkedItems((oldState) => {
				let aux = [...oldState].filter(
					(marked) => movidoComSucesso.indexOf(marked.path) === -1
				);

				return aux;
			});
		}

		await handleClickPath(
			markedItems.length > 0
				? encodeURI(String(folderPath).toString().replace(/,/g, '\\'))
				: encodeURI(
						String(folderPath.slice(0, folderPath.length - 1))
							.toString()
							.replace(/,/g, '\\')
				  )
		);
		return true;
	};

	const handleDeleteFileOrFolderMarked = async () => {
		if (markedItems.length === 0) {
			await Delete(folderPath.toString().replace(/,/g, '\\'));

			await handleClickPath(
				encodeURI(
					String(folderPath.slice(0, folderPath.length - 1))
						.toString()
						.replace(/,/g, '\\')
				)
			);
		} else {
			let excluidoComSucesso = [];

			for (let i = 0; i < markedItems.length; i++) {
				let downloaded = await Delete(markedItems[i].path);

				if (downloaded) {
					excluidoComSucesso.push(markedItems[i].path);
				}
			}

			setArquivos((oldState) => {
				let aux = [...oldState].filter(
					(marked) => excluidoComSucesso.indexOf(marked.path) === -1
				);

				return aux;
			});

			setMarkedItems((oldState) => {
				let aux = [...oldState].filter(
					(marked) => excluidoComSucesso.indexOf(marked.path) === -1
				);

				return aux;
			});
		}

		return true;
	};

	const handleCheckItem = (item) => {
		let foundIndex = null;
		if (
			markedItems.filter((it, i) => {
				if (it.filename === item.filename) {
					foundIndex = i;
					return true;
				} else {
					return false;
				}
			}).length > 0
		) {
			//remover
			setMarkedItems((oldState) => {
				let aux = [...oldState];
				aux.splice(foundIndex, 1);
				return aux;
			});
		} else {
			//add
			setMarkedItems((oldState) => {
				let aux = [...oldState];
				aux.push(item);
				return aux;
			});
		}
	};

	const handleMarkUnmarkAll = () => {
		if (markedItems.length === arquivos.length) {
			setMarkedItems([]);
		} else {
			setMarkedItems(arquivos);
		}
	};

	const handleDownloadMarked = async () => {
		if (markedItems.length === 0) {
			Toast('Selecione pelo menos um arquivo para ser baixado', 'warn');
			return;
		}

		let baixadosComSucesso = [];

		for (let i = 0; i < markedItems.length; i++) {
			let downloaded = await Download(markedItems[i].path);

			if (downloaded) {
				baixadosComSucesso.push(markedItems[i].path);
			}
		}

		setMarkedItems((oldState) => {
			let aux = [...oldState].filter(
				(marked) => baixadosComSucesso.indexOf(marked.path) === -1
			);

			return aux;
		});
	};

	const handleCreateFolder = async (newFolderName) => {
		if (
			pastas.filter(
				(f) => String(f.folder).trim() === String(newFolderName).trim()
			).length > 0
		) {
			Toast('Essa pasta já existe nesse diretório', 'warn');
			return;
		}

		if (String(newFolderName).trim() === '') {
			Toast('Informe o nome da pasta', 'warn');
			return;
		}

		let toastId = null;
		toastId = Toast('Criando...', 'wait');

		try {
			//fazer request
			await api.post('/files/create/folder', {
				dirName: encodeURI(
					String([...folderPath, String(newFolderName).trim()])
						.toString()
						.replace(/,/g, '\\')
				),
			});

			Toast('Pasta criada com sucesso', 'update', toastId, 'success');
			await handleClickPath(
				encodeURI(String(folderPath).toString().replace(/,/g, '\\'))
			);
			return true;
		} catch (err) {
			Toast(
				'Falha ao criar pasta, tente remover caractéres especiais',
				'update',
				toastId,
				'error'
			);
			return false;
		}
	};

	const handleRename = async (newName) => {
		if (String(newName).trim() === '') {
			Toast(
				`Informe o nome ${markedItems.length > 0 ? 'do arquivo' : 'da pasta'}`,
				'warn'
			);
			return;
		}

		if (
			markedItems.length > 0 &&
			arquivos.filter(
				(f) => String(f.filename).trim() === String(newName).trim()
			).length > 0
		) {
			Toast('Já existe um arquivo com esse nome', 'warn');
			return;
		}

		let toastId = null;
		toastId = Toast('Renomeando...', 'wait');

		try {
			//fazer request
			await api.put('/files/rename/', {
				currPath:
					markedItems.length > 0
						? encodeURI(markedItems[0].path)
						: encodeURI(String(folderPath).toString().replace(/,/g, '\\')),
				newPath:
					markedItems.length > 0
						? encodeURI(
								[
									...markedItems[0].path
										.split('\\')
										.slice(0, markedItems[0].path.split('\\').length - 1),
									newName,
								]
									.toString()
									.replace(/,/g, '\\')
						  )
						: encodeURI(
								String([...folderPath.slice(0, folderPath.length - 1), newName])
									.toString()
									.replace(/,/g, '\\')
						  ),
			});

			Toast(
				`${
					markedItems.length > 0 ? 'Arquivo renomeado' : 'Pasta renomeada'
				} com sucesso`,
				'update',
				toastId,
				'success'
			);
			await handleClickPath(
				markedItems.length > 0
					? encodeURI(String(folderPath).toString().replace(/,/g, '\\'))
					: encodeURI(
							String([...folderPath.slice(0, folderPath.length - 1), newName])
								.toString()
								.replace(/,/g, '\\')
					  )
			);
			return true;
		} catch (err) {
			Toast(
				`Falha ao renomear ${markedItems.length > 0 ? 'arquivo' : 'pasta'}`,
				'update',
				toastId,
				'error'
			);
			return false;
		}
	};

	const actualFolderFormated = (AF) => {
		return String(AF).toString().replace(/,/g, '\\');
	};

	const BlockPathOrFile = async (type, path) => {
		let toastId = null;
		toastId = Toast('Bloqueando...', 'wait');

		try {
			await api.post('/files/permissions/', {
				path: path,
				type: type,
			});

			Toast('Recurso bloqueado', 'update', toastId, 'success');
			return true;
		} catch (err) {
			Toast(
				'Recurso já bloqueado ou você não tem permissão para executar a ação',
				'update',
				toastId,
				'error'
			);
			return false;
		}
	};

	const Delete = async (filepath) => {
		let toastId = null;
		toastId = Toast('Excluindo...', 'wait');

		try {
			await api.get(`/files/delete/${encodeURI(filepath)}`);

			Toast('Recurso excluído', 'update', toastId, 'success');
			return true;
		} catch (err) {
			Toast(
				'Recurso já excluído ou você não tem permissão para executar a ação',
				'update',
				toastId,
				'error'
			);
			return false;
		}
	};

	const Download = async (filepath) => {
		let toastId = null;
		toastId = Toast('Baixando...', 'wait');

		try {
			const response = await api.get(`/files/download/${encodeURI(filepath)}`, {
				responseType: 'arraybuffer',
			});

			Toast('Download concluído', 'update', toastId, 'success');

			//Converto o PDF para BLOB
			const blob = new Blob([response.data], {
				type: response.headers['content-type'],
			});

			//Salvo em PDF junto com a data atual, só pra não sobreescrever nada
			saveAs(
				blob,
				String(filepath).split('\\')[String(filepath).split('\\').length - 1]
			);
			return true;
		} catch (err) {
			Toast('Falha no download', 'update', toastId, 'error');
			return false;
		}
	};

	const Move = async (oldPath, targetPath, type) => {
		let toastId = null;
		toastId = Toast('Movendo...', 'wait');

		try {
			await api.put('/files/move/', {
				currPath: oldPath,
				newPath: targetPath,
				type: type,
			});

			Toast('Movido com sucesso', 'update', toastId, 'success');
			return true;
		} catch (err) {
			Toast(
				'Recurso já movido ou você não tem permissão para executar a ação',
				'update',
				toastId,
				'error'
			);
			return false;
		}
	};

	return (
		<FilesContext.Provider
			value={{
				uiControl: {
					loaded,
				},
				data: {
					files: arquivos,
					folders: pastas,
					enviroment: enviroment,
					folderPath,
					markedItems,
					formatedFolderPath: actualFolderFormated(folderPath),
				},
				uiPermissions: shouldShowModals,
				actions: {
					onDownloadMarkedItems: handleDownloadMarked,
					onMarkItem: handleCheckItem,
					onMarkAllItems: handleMarkUnmarkAll,
					onDelete: handleDeleteFileOrFolderMarked,
					onBlock: handleBlockFileOrFolderMarked,
					onNavigateBackwards: handleGoBack,
					onNavigate: handleClickPath,
					onCreateFolder: handleCreateFolder,
					onRename: handleRename,
					onMove: handleMoveFileOrFolderMarked,
				},
			}}
		>
			{children}
		</FilesContext.Provider>
	);
};

export const useFiles = () => {
	const context = useContext(FilesContext);

	return context;
};
