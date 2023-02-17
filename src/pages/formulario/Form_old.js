import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { api } from '../../services/api';

import {
	TextField,
	makeStyles,
	Typography,
	Stepper,
	Step,
	StepLabel,
	MenuItem,
	LinearProgress,
	Button,
	useMediaQuery,
	useTheme,
} from '@material-ui/core';

import DatePicker from '../../components/materialComponents/datePicker';
import { InputTelCelular } from './components/inputTelCelular';
import { InputTelFixo } from './components/inputTelFixo';
import { InputRG } from './components/inputRG';
import { InputCPF } from './components/inputCPF';
import { InputCEP } from './components/inputCEP';
import Select from './components/select';
import NewFileInput from '../../components/FileInput';

import {
	Edit as EditIcon,
	Replay as ReplayIcon,
	SyncDisabled as SyncDisabledIcon,
	CheckCircle as CheckCircleIcon,
} from '@material-ui/icons';
import { Icon } from 'react-materialize';

import { QuestionBox } from './components/questionBox';
import { CircularStatic } from './components/progressCircle';
import { Toast } from '../../components/toasty';
import { ModalCOF } from './modals/modalCOF';

export const Form = ({ Form, onChangeForm, COD, lastFormSection }) => {
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [section, setSection] = useState(0);
	const [question, setQuestion] = useState(0);
	const [loading, setLoading] = useState(false);
	const [modalCOFOpen, setModalCOFOpen] = useState(false);
	const [submitError, setSubmitError] = useState(false);
	const [fileNames, setFileNames] = useState([]);
	const stepsName = [
		'Dados Pessoais',
		'Estado civil',
		'Dependentes',
		'Bens',
		'Renda',
		'Experiência',
		'Sócio',
		'Franquia',
		'Prioridades',
		'Finalização',
	];

	useEffect(() => {
		setSection(lastFormSection);
	}, [lastFormSection]);

	const handleSubmit = async () => {
		let toastId = null;
		toastId = Toast('Salvando...', 'wait');

		try {
			//envia o formulario
			await api.post(`/form/upload/form/${COD}`, {
				form: Form,
				secao: section + 1,
			});

			Toast('Etapa salva', 'update', toastId, 'success');
		} catch (err) {
			Toast(
				'Falha ao salvar dados, tente novamente',
				'update',
				toastId,
				'error'
			);
			throw new Error();
		}
	};

	const handleRequestAdvance = async () => {
		if (question === matriz[section].length) {
			Toast('Aguarde...', 'info');
		} else if (question + 1 === matriz[section].length) {
			setLoading(true);
			setSubmitError(false);

			try {
				await handleSubmit();

				//avança a section
				setSection((oldState) => oldState + 1);

				//volta o question para 0
				setQuestion(0);

				setLoading(false);
				setSubmitError(false);
			} catch (err) {
				setSubmitError(true);
			}
		} else {
			setQuestion((oldState) => oldState + 1);
		}
	};

	const handleRequestRetreat = async () => {
		if (question === 0 && section === 0) {
			Toast('Você já está na primeira pergunta', 'info');
		} else if (question > 0) {
			setQuestion(question - 1);
		} else if (question === 0 && section > 0) {
			setQuestion(matriz[section - 1].length - 1);
			setSection(section - 1);
		} else {
		}
	};

	const handleUploadFile = async (documento) => {
		const arquivos = getFiles();
		const formData = makeFormData(arquivos);

		let qtdArquivos = formData.getAll('formData').length;

		if (qtdArquivos === 0) {
			return true;
		}

		let toastId = null;

		formData.append('multiple', qtdArquivos > 1 ? 'S' : 'N');
		formData.append('cod', COD);
		formData.append('doc', documento);

		try {
			toastId = Toast('Salvando arquivo...', 'wait');

			await api.post(`/form/upload/files`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			Toast('Arquivo(s) salvo(s)', 'update', toastId, 'success');
			setFileNames([]);
			return true;
		} catch (err) {
			Toast('Falha ao salvar arquivo(s)', 'update', toastId, 'error');
			return false;
		}
	};

	const marcaCheckbox = (valueMarcado, value) => {
		if (
			(valueMarcado !== 'Casado(Comunhão Universal)' ||
				valueMarcado !== 'Casado(Comunhão Parcial)' ||
				valueMarcado !== 'Casado(Separação Total)') &&
			value === true
		) {
			onChangeForm({
				...Form,
				Est_Civil: valueMarcado,
				Conj_Nome: null,
				Conj_DtNascimento: null,
				Conj_CPF: null,
				Conj_RG: null,
				TUnião: null,
				Conj_RendMensal: null,
			});
		} else if (value === false) {
			onChangeForm({
				...Form,
				Est_Civil: null,
				Conj_Nome: null,
				Conj_DtNascimento: null,
				Conj_CPF: null,
				Conj_RG: null,
				TUnião: null,
				Conj_RendMensal: null,
			});
		} else {
			onChangeForm({
				...Form,
				Est_Civil: valueMarcado,
			});
		}
	};

	const handleDefinePrioidade = (opcao, prioridade, event) => {
		let aux = [];

		if (!Number.isSafeInteger(Number(prioridade)) || Number(prioridade) > 11) {
			event.target.value = prioridade.slice(0, prioridade.length - 1);
			return;
		}

		aux = [...Form.Prioridade];

		aux[opcao] = prioridade;

		onChangeForm({
			...Form,
			Prioridade: aux,
		});
	};

	const getFiles = () => {
		//Pega todos inputs do tipo arquivos
		const arquivos = document.getElementsByClassName('files');

		return arquivos;
	};

	const makeFormData = (htmlFileCollection) => {
		//cria um objeto do tipo formulario
		const formData = new FormData();

		//poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
		for (let j = 0; j < htmlFileCollection.length; j++) {
			for (let i = 0; i < htmlFileCollection[j].files.length; i++) {
				formData.append(`formData`, htmlFileCollection[j].files[i]);
			}
		}

		return formData;
	};

	const getFileNames = (FormData) => {
		let aux = [];
		for (let i = 0; i < FormData.getAll('formData').length; i++) {
			aux.push(FormData.getAll('formData')[i].name);
		}
		setFileNames(aux);
	};

	const rawDateToMomentValidObject = (rawDate) => {
		if (
			rawDate === null ||
			typeof rawDate === 'undefined' ||
			String(rawDate).trim === ''
		) {
			return null;
		}

		if (moment(rawDate).isValid()) {
			return moment(rawDate);
		} else {
			const MomentValidObj = moment();
			const destructecRawDate = String(rawDate).split('/');

			MomentValidObj.date(destructecRawDate[0]);
			MomentValidObj.month(destructecRawDate[1] - 1);
			MomentValidObj.year(destructecRawDate[2]);

			return MomentValidObj;
		}
	};

	/* 
  MUITA LOUCURA FAZER O QUE EU FIZ ABAIXO,
  MAS TENTEI ISOLAR EM UMA FUNÇÃO(DENTRO DO COMPONENTE) E NÃO DEU CERTO, 
  TAMBEM TENTEI ISOLAR FORA DO COMPONENTE E NÃO FUNCIONOU... 
  POSSO(E DEVO) VOLTAR AQUI COM UM POUCO MAIS DE EXPERIENCIA PARA FAZER AS COISAS DO JEITO CERTO 
  */

	//dados pessoais
	let dadosPessoais = [
		{
			question: 'Para começar, por favor nos informe seu nome completo',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Seu nome completo aqui'
					value={Form.Nome_Completo}
				/>
			),
			validationTest: () =>
				Form.Nome_Completo !== null &&
				String(Form.Nome_Completo).trim() !== '' &&
				typeof Form.Nome_Completo != 'undefined',
			validationErrorFunction: () => {
				Toast('O campo do nome é obrigatório', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Nome_Completo: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Sua data de nascimento',
			answerComponent: (
				<DatePicker
					min={false}
					label='Data de nascimento'
					defaultValue={rawDateToMomentValidObject(Form.DtNascimento)}
				/>
			),
			validationTest: () =>
				Form.DtNascimento !== null &&
				String(Form.DtNascimento).trim() !== '' &&
				typeof Form.DtNascimento != 'undefined',
			validationErrorFunction: () => {
				Toast('O campo da data de nascimento é obrigatório', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					DtNascimento: e._d,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Seu número de RG',
			answerComponent: <InputRG value={Form.RG} />,
			validationTest: () =>
				Form.RG !== null &&
				String(Form.RG).trim() !== '' &&
				typeof Form.RG != 'undefined',
			validationErrorFunction: () => {
				Toast('O campo do RG é obrigatório', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					RG: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Seu número de CPF',
			answerComponent: <InputCPF value={Form.CPF} />,
			validationTest: () =>
				Form.CPF !== null &&
				String(Form.CPF).trim() !== '' &&
				typeof Form.CPF != 'undefined',
			validationErrorFunction: () => {
				Toast('O campo do CPF é obrigatório', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					CPF: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Informe seu email principal',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Email'
					value={Form.Email}
				/>
			),
			validationTest: () =>
				Form.Email !== null &&
				String(Form.Email).trim() !== '' &&
				typeof Form.Email != 'undefined',
			validationErrorFunction: () => {
				Toast('O campo do Email é obrigatório', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Email: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Telefone Celular(opcional caso use telefone fixo)',
			answerComponent: (
				<InputTelCelular value={Form.Celular} disabled={false} />
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Celular: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Telefone Fixo(Obrigatório caso não tenha informado um número de celular)',
			answerComponent: (
				<InputTelFixo value={Form.Tel_Residencial} disabled={false} />
			),
			validationTest: () =>
				(Form.Celular !== null &&
					String(Form.Celular).trim() !== '' &&
					typeof Form.Celular != 'undefined') ||
				(Form.Tel_Residencial !== null &&
					String(Form.Tel_Residencial).trim() !== '' &&
					typeof Form.Tel_Residencial != 'undefined'),
			validationErrorFunction: () => {
				Toast(
					'Como você não informou um telefone celular, precisamos pelo menos de um número de telefone fixo.',
					'warn'
				);
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Tel_Residencial: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Logradouro',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Logradouro'
					value={Form.Logradouro}
				/>
			),
			validationTest: () =>
				Form.Logradouro !== null &&
				String(Form.Logradouro).trim() !== '' &&
				typeof Form.Logradouro != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o logradouro do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Logradouro: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Número',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Número'
					value={Form.Número}
				/>
			),
			validationTest: () =>
				Form.Número !== null &&
				String(Form.Número).trim() !== '' &&
				typeof Form.Número != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o número do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Número: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Complemento(opcional)',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Complemento'
					value={Form.Complemento}
				/>
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Complemento: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Bairro',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Bairro'
					value={Form.Bairro}
				/>
			),
			validationTest: () =>
				Form.Bairro !== null &&
				String(Form.Bairro).trim() !== '' &&
				typeof Form.Bairro != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o bairro do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Bairro: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Município',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Município'
					value={Form.Municipio}
				/>
			),
			validationTest: () =>
				Form.Municipio !== null &&
				String(Form.Municipio).trim() !== '' &&
				typeof Form.Municipio != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o município do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Municipio: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: Estado',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Estado'
					value={Form.Estado}
				/>
			),
			validationTest: () =>
				Form.Estado !== null &&
				String(Form.Estado).trim() !== '' &&
				typeof Form.Estado != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o estado do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Estado: e.currentTarget.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Endereço: CEP',
			answerComponent: <InputCEP value={Form.CEP} />,
			validationTest: () =>
				Form.CEP !== null &&
				String(Form.CEP).trim() !== '' &&
				typeof Form.CEP != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe o CEP do seu endereço', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					CEP: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//estado civil e dependentes
	let estadoCivil = [
		{
			question: 'Estado Civil',
			answerComponent: (
				<div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Casado(Comunhão Universal)'
							checked={'Casado(Comunhão Universal)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>
							Casado(a) em regime de comunhão universal de bens
						</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Casado(Comunhão Parcial)'
							checked={'Casado(Comunhão Parcial)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>
							Casado(a) em regime de comunhão parcial de bens
						</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Casado(Separação Total)'
							checked={'Casado(Separação Total)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>
							Casado(a) em regime de separação de bens
						</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Solteiro(a)'
							checked={'Solteiro(a)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>Solteiro (a)</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Divorciado(a)'
							checked={'Divorciado(a)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>Divorciado(a)</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Separado Judicialmente'
							checked={'Separado Judicialmente' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>
							Separado(a) judicialmente
						</Typography>
					</div>
					<div style={divStyle}>
						<input
							type='checkbox'
							onClick={(e) => marcaCheckbox(e.target.value, e.target.checked)}
							value='Viúvo(a)'
							checked={'Viúvo(a)' === Form.Est_Civil}
						/>
						<Typography variant='subtitle1'>Viúvo (a)</Typography>
					</div>
				</div>
			),
			validationTest: () =>
				Form.Est_Civil !== '' &&
				Form.Est_Civil !== null &&
				typeof Form.Est_Civil !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe qual o seu estado civil', 'warn');
			},
			changeAnswerFunction: (e) => {},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
			alignArrow: 'flex-end',
		},
	];

	//adiciona questoes conjuge
	if (
		(Form.Est_Civil === 'Casado(Comunhão Universal)' ||
			Form.Est_Civil === 'Casado(Comunhão Parcial)' ||
			Form.Est_Civil === 'Casado(Separação Total)') &&
		Form.Est_Civil !== null
	) {
		estadoCivil = [
			...estadoCivil,
			{
				question: 'Nome do(a) cônjuge',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='nome do(a) cônjuge aqui'
						value={Form.Conj_Nome}
					/>
				),
				validationTest: () =>
					Form.Conj_Nome !== null &&
					String(Form.Conj_Nome).trim() !== '' &&
					typeof Form.Conj_Nome != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o nome do(a) cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Conj_Nome: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Data de nascimento do(a) cônjuge',
				answerComponent: (
					<DatePicker
						min={false}
						label='Data de nascimento cônjuge'
						defaultValue={rawDateToMomentValidObject(Form.Conj_DtNascimento)}
					/>
				),
				validationTest: () =>
					Form.Conj_DtNascimento !== null &&
					String(Form.Conj_DtNascimento).trim() !== '' &&
					typeof Form.Conj_DtNascimento != 'undefined' &&
					moment(Form.Conj_DtNascimento).isValid(),
				validationErrorFunction: () => {
					Toast('Informe a data de nascimento do(a) cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Conj_DtNascimento: e._d,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'RG do(a) cônjuge',
				answerComponent: <InputRG value={Form.Conj_RG} />,
				validationTest: () =>
					Form.Conj_RG !== null &&
					String(Form.Conj_RG).trim() !== '' &&
					typeof Form.Conj_RG != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o RG do(a) cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Conj_RG: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'CPF do(a) cônjuge',
				answerComponent: <InputCPF value={Form.Conj_CPF} />,
				validationTest: () =>
					Form.Conj_CPF !== null &&
					String(Form.Conj_CPF).trim() !== '' &&
					typeof Form.Conj_CPF != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o CPF do(a) cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Conj_CPF: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Tempo de união',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='tempo de união com o(a) cônjuge'
						value={Form.TUnião}
					/>
				),
				validationTest: () =>
					Form.TUnião !== null &&
					String(Form.TUnião).trim() !== '' &&
					typeof Form.TUnião != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o tempo de união com o(a) cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						TUnião: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Redimento mensal do(a) cônjuge',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='rendimento mensal do(a) cônjuge'
						value={Form.Conj_RendMensal}
					/>
				),
				validationTest: () =>
					Form.Conj_RendMensal !== null &&
					String(Form.Conj_RendMensal).trim() !== '' &&
					typeof Form.Conj_RendMensal != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o rendimento mensal do seu/sua cônjuge', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Conj_RendMensal: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//Dependentes
	let dependentes = [
		{
			question: 'Possui filhos?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Tem_filhos}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Tem_filhos !== null &&
				String(Form.Tem_filhos).trim() !== '' &&
				typeof Form.Tem_filhos != 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se você possui filhos', 'warn');
			},
			changeAnswerFunction: (e) => {
				onChangeForm({
					...Form,
					Tem_filhos: e.target.value,
				});
			},
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciona questoes filhos
	if (Form.Tem_filhos === 'Sim') {
		dependentes = [
			...dependentes,
			{
				question: 'Quantos filhos?',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Quantos filhos possui'
						value={Form.Qtd_filhos}
					/>
				),
				validationTest: () =>
					Form.Qtd_filhos !== null &&
					String(Form.Qtd_filhos).trim() !== '' &&
					typeof Form.Qtd_filhos != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe quantos filhos você possui', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Qtd_filhos: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Idade dos filhos',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Idade dos filhos'
						value={Form.Idd_filhos}
					/>
				),
				validationTest: () =>
					Form.Idd_filhos !== null &&
					String(Form.Idd_filhos).trim() !== '' &&
					typeof Form.Idd_filhos != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe a idade do(s) filho(s) que você possui', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Idd_filhos: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//bens
	let Bens = [
		{
			question: 'Residencia',
			answerComponent: (
				<Select label='Selecione...' value={Form.T_Residencia}>
					<MenuItem value='Própria'>Própria</MenuItem>
					<MenuItem value='Alugada'>Alugada</MenuItem>
					<MenuItem value='Financiada'>Financiada</MenuItem>
					<MenuItem value='Emprestada'>Emprestada</MenuItem>
					<MenuItem value='Outros'>Outros</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.T_Residencia !== '' &&
				Form.T_Residencia !== null &&
				typeof Form.T_Residencia !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se o tipo da sua residência', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					T_Residencia: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//Adiciono perguntas sobre residencia
	if (Form.T_Residencia === 'Alugada' || Form.T_Residencia === 'Financiada') {
		Bens = [
			...Bens,
			{
				question: 'Custo mensal',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Custo mensal da sua redidencia'
						value={Form.Residencia_Mensal}
					/>
				),
				validationTest: () =>
					Form.Residencia_Mensal !== null &&
					String(Form.Residencia_Mensal).trim() !== '' &&
					typeof Form.Residencia_Mensal != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o custo mensal aproximado com sua residencia', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Residencia_Mensal: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//continuando questionario de Bens
	Bens = [
		...Bens,
		{
			question: 'Possui veículo?',
			answerComponent: (
				<Select label='Selecione...' value={Form.P_Veiculo}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.P_Veiculo !== '' &&
				Form.P_Veiculo !== null &&
				typeof Form.P_Veiculo !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se possui veiculo', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					P_Veiculo: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Possui imóvel?',
			answerComponent: (
				<Select label='Selecione...' value={Form.P_Imovel}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.P_Imovel !== '' &&
				Form.P_Imovel !== null &&
				typeof Form.P_Imovel !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se possui imóvel', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					P_Imovel: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//Rendimento
	let Rend = [
		{
			question: 'Nos conte qual sua profissão',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Sua ocupação'
					value={Form.Profissao}
				/>
			),
			validationTest: () =>
				Form.Profissao !== '' &&
				Form.Profissao !== null &&
				typeof Form.Profissao !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe qual sua profissão principal', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Profissao: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Exerce atividades com carteira assinada?',
			answerComponent: (
				<Select label='Selecione...' value={Form.CLT}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.CLT !== '' && Form.CLT !== null && typeof Form.CLT !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se trabalha com carteira assinada', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					CLT: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciona questao de redimento CLT
	if (Form.CLT === 'Sim') {
		Rend = [
			...Rend,
			{
				question: 'Rendimento mensal',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Seu rendimento mensal'
						value={Form.Rend_Mensal}
					/>
				),
				validationTest: () =>
					Form.Rend_Mensal !== null &&
					String(Form.Rend_Mensal).trim() !== '' &&
					typeof Form.Rend_Mensal != 'undefined',
				validationErrorFunction: () => {
					Toast('Informe seu rendimento mensal aproximado', 'warn');
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Rend_Mensal: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//Continuando rendimento
	Rend = [
		...Rend,
		{
			question: 'Teve recolhimento de imposto de renda no ultimo ano?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Recolhimento}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Recolhimento !== '' &&
				Form.Recolhimento !== null &&
				typeof Form.Recolhimento !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe se teve recolhimento de imposto de renda no último ano',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Recolhimento: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciono pergunta sobre recolhimento de IR
	if (Form.Recolhimento === 'Sim') {
		Rend = [
			...Rend,
			{
				question:
					'Quantia recolhida pelo IR(Sem considerar eventual valor restituído)',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Valor recolhido'
						value={Form.Recolhimento_QTD}
					/>
				),
				validationTest: () =>
					Form.Recolhimento_QTD !== null &&
					String(Form.Recolhimento_QTD).trim() !== '' &&
					typeof Form.Recolhimento_QTD != 'undefined',
				validationErrorFunction: () => {
					Toast(
						'Informe a quantia recolhida do imposto de renda do último ano',
						'warn'
					);
				},
				changeAnswerFunction: (e) => {
					onChangeForm({
						...Form,
						Recolhimento_QTD: e.target.value,
					});
				},
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//Continuando rendimento
	Rend = [
		...Rend,
		{
			question: 'Qual sua renda familiar mensal?',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Rendimento mensal'
					value={Form.Renda_Familiar}
				/>
			),
			validationTest: () =>
				Form.Renda_Familiar !== '' &&
				Form.Renda_Familiar !== null &&
				typeof Form.Renda_Familiar !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe seu rendimento mensal aproximado', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Renda_Familiar: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Como é composta sua renda familiar?',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Composição da renda'
					value={Form.Renda_Composta}
				/>
			),
			validationTest: () =>
				Form.Renda_Composta !== '' &&
				Form.Renda_Composta !== null &&
				typeof Form.Renda_Composta !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe como é composta sua renda mensal', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Renda_Composta: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Qual sua expectativa de retorno para esse investimento?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Expect}>
					<MenuItem value='10/20'>10 a 20 meses</MenuItem>
					<MenuItem value='20/30'>20 a 30 meses</MenuItem>
					<MenuItem value='30+'>30+ meses</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Expect !== '' &&
				Form.Expect !== null &&
				typeof Form.Expect !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe qual é sua expectativa de retorno para esse investimento',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Expect: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Qual a origem do capital disponível para a abertura do negócio com a Pilão Professional?',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='origem do capital'
					value={Form.Origem_Capital}
				/>
			),
			validationTest: () =>
				Form.Origem_Capital !== '' &&
				Form.Origem_Capital !== null &&
				typeof Form.Origem_Capital !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe qual é a origem do capital disponível para a abertura do negócio com a Pilão Professional',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Origem_Capital: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Qual a disponibilidade para investimento na franquia, em dinheiro, sem considerar empréstimos ou linhas de crédito?',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Capital disponível'
					value={Form.Disp_Invest}
				/>
			),
			validationTest: () =>
				Form.Disp_Invest !== '' &&
				Form.Disp_Invest !== null &&
				typeof Form.Disp_Invest !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe o capital disponível para investimento na franquia',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Disp_Invest: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//Experiencia
	let Exp = [
		{
			question:
				'Tem/Teve empresa própria e/ou tem experiencia como profissional autônomo?',
			answerComponent: (
				<Select label='Selecione...' value={Form.T_Empresa}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.T_Empresa !== '' &&
				Form.T_Empresa !== null &&
				typeof Form.T_Empresa !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe se já teve uma empresa ou atuou como profissional autônomo',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					T_Empresa: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciono pergunta caso já haja experiencia
	if (Form.T_Empresa === 'Sim') {
		Exp = [
			...Exp,
			{
				question:
					'Especifique detalhadamente qual a atividade, se existiam sócios, quais os rendimentos mensais, qual a quantidade de horas de trabalho por dia em média e qual o capital social: No caso do negócio não mais existir, especificar detalhadamente quais os motivos que ocasionaram o encerramento, se na ocasião houve prejuízo ou lucro e se houve a ocorrência de dívidas pendentes',
				answerComponent: (
					<TextField
						multiline
						rowsMax={4}
						className={classes.TextInput}
						variant='outlined'
						label='Sua experiência'
						value={Form.Detalhes_Atividade}
					/>
				),
				validationTest: () =>
					Form.Detalhes_Atividade !== '' &&
					Form.Detalhes_Atividade !== null &&
					typeof Form.Detalhes_Atividade !== 'undefined',
				validationErrorFunction: () => {
					Toast(
						'Nos conte um pouco da sua experiência mencionada anteriormente',
						'warn'
					);
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Detalhes_Atividade: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//continuo perguntas sobre experiencia
	Exp = [
		...Exp,
		{
			question:
				'Qual a sua formação escolar/acadêmica?(especificar grau e área se houver)',
			answerComponent: (
				<TextField
					className={classes.TextInput}
					variant='outlined'
					label='Formação escolar/acadêmica'
					value={Form.Form_Escolar}
					multiline
				/>
			),
			validationTest: () =>
				Form.Form_Escolar !== '' &&
				Form.Form_Escolar !== null &&
				typeof Form.Form_Escolar !== 'undefined',
			validationErrorFunction: () => {
				Toast('Nos conte sobre sua formação escolar/acadêmica', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Form_Escolar: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'De forma simplificada, nos conte sobre suas últimas experiências profissionais.',
			answerComponent: (
				<TextField
					multiline
					rowsMax={4}
					className={classes.TextInput}
					variant='outlined'
					label='Últimas experiencias profissionais'
					value={Form.Ult_exp}
				/>
			),
			validationTest: () =>
				Form.Ult_exp !== '' &&
				Form.Ult_exp !== null &&
				typeof Form.Ult_exp !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Nos conte sobre suas últimas experiências profissionais',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Ult_exp: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//Socio(s)
	let Socios = [
		{
			question: 'Haverá sociedade neste negócio?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Sociedade}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Sociedade !== '' &&
				Form.Sociedade !== null &&
				typeof Form.Sociedade !== 'undefined',
			validationErrorFunction: () => {
				Toast('Informe se haverá sociedade neste negócio', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Sociedade: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciono perguntas sobre socio
	if (Form.Sociedade === 'Sim') {
		Socios = [
			...Socios,
			{
				question: 'Nome do sócio',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Nome do sócio'
						value={Form.Nome_Socio}
					/>
				),
				validationTest: () =>
					Form.Nome_Socio !== '' &&
					Form.Nome_Socio !== null &&
					typeof Form.Nome_Socio !== 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o nome do seu sócio nesse negócio', 'warn');
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Nome_Socio: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Qual é o seu tipo de vinculo com o sócio',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Tipo de vinculo'
						value={Form.Socio_Vinculo}
					/>
				),
				validationTest: () =>
					Form.Socio_Vinculo !== '' &&
					Form.Socio_Vinculo !== null &&
					typeof Form.Socio_Vinculo !== 'undefined',
				validationErrorFunction: () => {
					Toast('Informe o tipo de vinculo que você tem com seu sócio', 'warn');
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Socio_Vinculo: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Há quanto tempo você e seu sócio se conhecem?',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Quanto tempo se conhecem'
						value={Form.Tempo_ConheceSocio}
					/>
				),
				validationTest: () =>
					Form.Tempo_ConheceSocio !== '' &&
					Form.Tempo_ConheceSocio !== null &&
					typeof Form.Tempo_ConheceSocio !== 'undefined',
				validationErrorFunction: () => {
					Toast('Informe a quanto tempo conhece seu sócio', 'warn');
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Tempo_ConheceSocio: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'O que já realizaram juntos?',
				answerComponent: (
					<TextField
						multiline
						rowsMax={4}
						className={classes.TextInput}
						variant='outlined'
						label='Realizações em conjunto'
						value={Form.Realizou_Socio}
					/>
				),
				validationTest: () =>
					Form.Realizou_Socio !== '' &&
					Form.Realizou_Socio !== null &&
					typeof Form.Realizou_Socio !== 'undefined',
				validationErrorFunction: () => {
					Toast('Cite feitos realizados em conjunto com seu sócio', 'warn');
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Realizou_Socio: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question:
					'Essa pessoa vai ser sócia no contrato de concessão da franquia ou apenas vai participar no contrato da empresa (pessoa jurídica) que vai operar a franquia? Especificar em que condições e em qual proporção',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Tipo de sociedade'
						value={Form.Cond_Socio}
					/>
				),
				validationTest: () =>
					Form.Cond_Socio !== '' &&
					Form.Cond_Socio !== null &&
					typeof Form.Cond_Socio !== 'undefined',
				validationErrorFunction: () => {
					Toast(
						'Nos conte melhor como será a relação societária entre vocês',
						'warn'
					);
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Cond_Socio: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
			{
				question: 'Essa pessoa participará do investimento?',
				answerComponent: (
					<Select label='Selecione...' value={Form.Part_invest}>
						<MenuItem value='Sim'>Sim</MenuItem>
						<MenuItem value='Não'>Não</MenuItem>
					</Select>
				),
				validationTest: () =>
					Form.Part_invest !== '' &&
					Form.Part_invest !== null &&
					typeof Form.Part_invest !== 'undefined',
				validationErrorFunction: () => {
					Toast('Informe se seu sócio participará do investimento', 'warn');
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Part_invest: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];

		if (Form.Part_invest === 'Sim') {
			Socios = [
				...Socios,
				{
					question:
						'A participação do seu sócio no investimento será em qual proporção?',
					answerComponent: (
						<TextField
							className={classes.TextInput}
							variant='outlined'
							label='Proporção'
							value={Form.Prop_Invest}
						/>
					),
					validationTest: () =>
						Form.Prop_Invest !== '' &&
						Form.Prop_Invest !== null &&
						typeof Form.Prop_Invest !== 'undefined',
					validationErrorFunction: () => {
						Toast('Informe a proporção de investimento do seu sócio', 'warn');
					},
					changeAnswerFunction: (e) =>
						onChangeForm({
							...Form,
							Prop_Invest: e.target.value,
						}),
					onRequestAdvanceStep: handleRequestAdvance,
					onRequestRetreatStep: handleRequestRetreat,
				},
			];
		}
	}

	//continuo perguntas sobre socios
	Socios = [
		...Socios,
		{
			question: 'Você já teve algum empreendimento em sociedade com alguém?',
			answerComponent: (
				<Select label='Selecione...' value={Form.T_Empreendimento}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.T_Empreendimento !== '' &&
				Form.T_Empreendimento !== null &&
				typeof Form.T_Empreendimento !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Informe se constituiu sociedade com alguém anteriormente',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					T_Empreendimento: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//adiciono perguntas sobre empreendimento anterior
	if (Form.T_Empreendimento === 'Sim') {
		Socios = [
			...Socios,
			{
				question: 'Como foi a experiência?',
				answerComponent: (
					<TextField
						className={classes.TextInput}
						variant='outlined'
						label='Experiencia com sociedade'
						value={Form.Exp_Sociedade}
					/>
				),
				validationTest: () =>
					Form.Exp_Sociedade !== '' &&
					Form.Exp_Sociedade !== null &&
					typeof Form.Exp_Sociedade !== 'undefined',
				validationErrorFunction: () => {
					Toast(
						'Nos conte sobre sua expêriencia anterior em sociedade',
						'warn'
					);
				},
				changeAnswerFunction: (e) =>
					onChangeForm({
						...Form,
						Exp_Sociedade: e.target.value,
					}),
				onRequestAdvanceStep: handleRequestAdvance,
				onRequestRetreatStep: handleRequestRetreat,
			},
		];
	}

	//Franquia
	let Franquia = [
		{
			question:
				'Na fase inicial, eventualmente, faz-se necessária uma cobertura dos custos fixos da franquia, por motivo do negócio ainda não atingir uma maturidade suficiente. Nesse caso, existe disponibilidade de capital para um eventual investimento parcial mensal que complemente as despesas da franquia?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Cob_Desp}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Cob_Desp !== '' &&
				Form.Cob_Desp !== null &&
				typeof Form.Cob_Desp !== 'undefined',
			validationErrorFunction: () => {
				Toast('Nos informe sua posição quanto a questão apresentada', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Cob_Desp: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: 'Como você conheceu a Pilão Professional?',
			answerComponent: (
				<TextField
					multiline
					rowsMax={4}
					className={classes.TextInput}
					variant='outlined'
					label='Como conheceu a Pilão Professional'
					value={Form.Conhece_Pilao}
				/>
			),
			validationTest: () =>
				Form.Conhece_Pilao !== '' &&
				Form.Conhece_Pilao !== null &&
				typeof Form.Conhece_Pilao !== 'undefined',
			validationErrorFunction: () => {
				Toast('Nos conte como conheceu a Pilão Professional', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Conhece_Pilao: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Qual foi a característica do negócio que mais pesou na escolha da Pilão Professional?',
			answerComponent: (
				<TextField
					multiline
					rowsMax={4}
					className={classes.TextInput}
					variant='outlined'
					label='Caracteristica'
					value={Form.Caracteristica_Peso}
				/>
			),
			validationTest: () =>
				Form.Caracteristica_Peso !== '' &&
				Form.Caracteristica_Peso !== null &&
				typeof Form.Caracteristica_Peso !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Nos conte qual característica mais lhe atraiu na Pilão Professional',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Caracteristica_Peso: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Numa franquia, a padronização é algo muito importante. Acrescenta-se ainda que a franqueadora tem sob sua responsabilidade a organização da rede em geral, bem como o cuidado com a manutenção da competitividade do negócio. Por esse motivo, trata-se de uma relação pautada por muitas regras, estabelecidas no dia a dia pela franqueadora, com base nos objetivos descritos. Você está ciente disso e disposto(a) a cumprir as regras estabelecidas pela franqueadora.',
			answerComponent: (
				<Select label='Selecione...' value={Form.Com_Regra}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Com_Regra !== '' &&
				Form.Com_Regra !== null &&
				typeof Form.Com_Regra !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Confirme se está disposto a cumprir as regras da franqueadora',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Com_Regra: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'No que se refere ao lucro líquido que uma franquia pode oferecer, por mês em média (ao final de um ano, o lucro médio por mês), no total (no caso de existirem sócios, o lucro total, não a parte de cada sócio), existem alguns casos em que nos primeiros meses a média mensal fica sendo inferior a R$500,00. Caso na sua franquia exista esse nível de lucro, assim mesmo é possível para você iniciar o negócio?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Com_Med}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Com_Med !== '' &&
				Form.Com_Med !== null &&
				typeof Form.Com_Med !== 'undefined',
			validationErrorFunction: () => {
				Toast('Confirme se está preparado para a cenário apresentado', 'warn');
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Com_Med: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Devido à natureza da relação, rotineiramente a franquia deve fornecer as mais diversas informações para a franqueadora. Por exemplo, no que se refere aos resultados financeiros, existe o acompanhamento do desempenho de todas as máquinas, isso com o objetivo de planejar as políticas estratégicas da rede como um todo, e também para detectar eventuais problemas de gestão e potencial na unidade. São diversas informações, sobre diversos campos do negócio. Você se compromete a informar a franqueadora sobre o que for solicitado, desde que pertinente ao negócio?',
			answerComponent: (
				<Select label='Selecione...' value={Form.Com_Inf}>
					<MenuItem value='Sim'>Sim</MenuItem>
					<MenuItem value='Não'>Não</MenuItem>
				</Select>
			),
			validationTest: () =>
				Form.Com_Inf !== '' &&
				Form.Com_Inf !== null &&
				typeof Form.Com_Inf !== 'undefined',
			validationErrorFunction: () => {
				Toast(
					'Confirme se comprometer a fornecer as informações solicitadas pela franqueadora',
					'warn'
				);
			},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Com_Inf: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question:
				'Indique se você recebeu assistência de um de nossos consultores para entender melhor a proposta da franquia(opcional)',
			answerComponent: (
				<Select label='Selecione...' value={Form.Consultor}>
					<MenuItem value='Alessandro'>Alessandro</MenuItem>
					<MenuItem value='Kauê'>Kauê</MenuItem>
					<MenuItem value='Priscila'>Priscila</MenuItem>
					<MenuItem value='Richard'>Richard</MenuItem>
					<MenuItem value='Tatiane'>Tatiane</MenuItem>
					<MenuItem value='Outros'>Outros</MenuItem>
				</Select>
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: (e) =>
				onChangeForm({
					...Form,
					Consultor: e.target.value,
				}),
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
	];

	//Prioridades
	let Prioridades = [
		{
			question:
				'Seguindo a sua opinião pessoal, por favor, numere por ordem de sua preferência, os motivos que o fizeram decidir pela franquia Pilão Professional (colocando o número 01 para o mais importante – primeiro - e respectivamente numerando até o 11 para o menos importante - último). Leia todas as alternativas antes de começar a responder',
			answerComponent: null,
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: null,
			onRequestAdvanceStep: handleRequestAdvance,
			onRequestRetreatStep: handleRequestRetreat,
		},
		{
			question: null,
			answerComponent: afirmacoes.map((afirmacao, index) => (
				<div
					style={{
						display: 'Flex',
						width: '100%',
						flexDirection: 'row',
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						marginBottom: '2%',
					}}
					key={index}
				>
					<input
						onChange={(e) => {
							e.persist();
							handleDefinePrioidade(e.target.id, e.target.value, e);
						}}
						id={index}
						value={Form.Prioridade[index]}
						style={inputStyle}
						placeholder={0}
						maxLength={2}
						type='text'
					/>
					<Typography variant='body1'>{afirmacao}</Typography>
				</div>
			)),
			validationTest: () => {
				let test = true;
				// for (let i = 0; i < Form.Prioridade.length; i++) {
				//   if (typeof Form.Prioridade[i] == "undefined" || String(Form.Prioridade[i]).trim() === '' || String(Form.Prioridade[i]).trim() === '0' || Form.Prioridade[i] === null) {
				//     test = false;
				//   }
				// }
				return test;
			},
			validationErrorFunction: () => {
				Toast(
					'Avalie as afirmações com base no seu entendimento do nivel de importancia de cada uma delas(1 a 11)',
					'warn'
				);
			},
			changeAnswerFunction: null,
			onRequestAdvanceStep: () => {
				setModalCOFOpen(true);
				handleRequestAdvance();
			},
			onRequestRetreatStep: handleRequestRetreat,
			alignArrow: 'flex-end',
			answerOnly: true,
		},
	];

	//Encerramento
	let Encerramento = [
		{
			question: 'Comprovante de disponibilidade do capital declarado(opcional)',
			answerComponent: (
				<div
					className='YAlign'
					style={{
						width: '100%',
						flex: 'unset',
						maxWidth: '250px',
					}}
				>
					<Typography variant='body1'>
						<strong>Selecione o comprovante</strong>
					</Typography>
					<NewFileInput
						ContainerStyle={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							width: '80%',
						}}
						onChange={() => getFileNames(makeFormData(getFiles()))}
						multiple={false}
						name='upload'
						accept='application/pdf,image/png, image/jpeg'
						label={
							<div className='XAlign'>
								<Icon>attach_file</Icon>
								ANEXAR
							</div>
						}
					/>
					{fileNames.length > 0 ? (
						<ul
							style={{
								listStyleType: 'disclosure-closed',
								paddingLeft: '16px',
							}}
						>
							{fileNames.map((filename) => (
								<li
									key={filename}
									style={{ listStyleType: 'disclosure-closed' }}
								>
									<Typography variant='subtitle1'>{filename}</Typography>
								</li>
							))}
						</ul>
					) : null}
				</div>
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: null,
			onRequestAdvanceStep: async () => {
				const enviou = await handleUploadFile('CAPITAL');
				if (enviou) {
					handleRequestAdvance();
				}
			},
			onRequestRetreatStep: handleRequestRetreat,
			alignArrow: 'flex-end',
		},
		{
			question:
				'Cópias do CPF e RG de quem está apresentando o questionário(opcional)',
			answerComponent: (
				<div
					className='YAlign'
					style={{
						width: '100%',
						flex: 'unset',
						maxWidth: '250px',
					}}
				>
					<Typography variant='body1'>
						<strong>Selecione a(s) cópia(s) do(s) documento(s)</strong>
					</Typography>
					<NewFileInput
						ContainerStyle={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							width: '80%',
						}}
						onChange={() => getFileNames(makeFormData(getFiles()))}
						multiple={true}
						name='upload'
						accept='application/pdf,image/png, image/jpeg'
						label={
							<div className='XAlign'>
								<Icon>attach_file</Icon>
								ANEXAR
							</div>
						}
					/>
					{fileNames.length > 0 ? (
						<ul
							style={{
								listStyleType: 'disclosure-closed',
								paddingLeft: '16px',
							}}
						>
							{fileNames.map((filename) => (
								<li
									key={filename}
									style={{ listStyleType: 'disclosure-closed' }}
								>
									<Typography variant='subtitle1'>{filename}</Typography>
								</li>
							))}
						</ul>
					) : null}
				</div>
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: null,
			onRequestAdvanceStep: async () => {
				const enviou = await handleUploadFile('CPF_RG');
				if (enviou) {
					handleRequestAdvance();
				}
			},
			onRequestRetreatStep: handleRequestRetreat,
			alignArrow: 'flex-end',
		},
	];

	//adiciono opção de enviar documentos do conjuge
	if (
		(Form.Est_Civil === 'Casado(Comunhão Universal)' ||
			Form.Est_Civil === 'Casado(Comunhão Parcial)' ||
			Form.Est_Civil === 'Casado(Separação Total)') &&
		Form.Est_Civil !== null
	) {
		Encerramento = [
			...Encerramento,
			{
				question: 'Cópias do CPF e RG do(a) cônjuge ou semelhante(opcional)',
				answerComponent: (
					<div
						className='YAlign'
						style={{
							width: '100%',
							flex: 'unset',
							maxWidth: '250px',
						}}
					>
						<Typography variant='body1'>
							<strong>Selecione a(s) cópia(s) do(s) documento(s)</strong>
						</Typography>
						<NewFileInput
							ContainerStyle={{
								display: 'flex',
								flexDirection: 'column',
								height: '100%',
								width: '80%',
							}}
							onChange={() => getFileNames(makeFormData(getFiles()))}
							multiple={true}
							name='upload'
							accept='application/pdf,image/png, image/jpeg'
							label={
								<div className='XAlign'>
									<Icon>attach_file</Icon>
									ANEXAR
								</div>
							}
						/>
						{fileNames.length > 0 ? (
							<ul
								style={{
									listStyleType: 'disclosure-closed',
									paddingLeft: '16px',
								}}
							>
								{fileNames.map((filename) => (
									<li
										key={filename}
										style={{ listStyleType: 'disclosure-closed' }}
									>
										<Typography variant='subtitle1'>{filename}</Typography>
									</li>
								))}
							</ul>
						) : null}
					</div>
				),
				validationTest: () => true,
				validationErrorFunction: () => {},
				changeAnswerFunction: null,
				onRequestAdvanceStep: async () => {
					const enviou = await handleUploadFile('CPF_RG_CONJ');
					if (enviou) {
						handleRequestAdvance();
					}
				},
				onRequestRetreatStep: handleRequestRetreat,
				alignArrow: 'flex-end',
			},
		];
	}

	//continuo o encerramento
	Encerramento = [
		...Encerramento,
		{
			question: 'Cópia e da última declaração de imposto de renda(opcional)',
			answerComponent: (
				<div
					className='YAlign'
					style={{
						width: '100%',
						flex: 'unset',
						maxWidth: '250px',
					}}
				>
					<Typography variant='body1'>
						<strong>Selecione o documento</strong>
					</Typography>
					<NewFileInput
						ContainerStyle={{
							display: 'flex',
							flexDirection: 'column',
							height: '100%',
							width: '80%',
						}}
						onChange={() => getFileNames(makeFormData(getFiles()))}
						multiple={false}
						name='upload'
						accept='application/pdf,image/png, image/jpeg'
						label={
							<div className='XAlign'>
								<Icon>attach_file</Icon>
								ANEXAR
							</div>
						}
					/>
					{fileNames.length > 0 ? (
						<ul
							style={{
								listStyleType: 'disclosure-closed',
								paddingLeft: '16px',
							}}
						>
							{fileNames.map((filename) => (
								<li
									key={filename}
									style={{ listStyleType: 'disclosure-closed' }}
								>
									<Typography variant='subtitle1'>{filename}</Typography>
								</li>
							))}
						</ul>
					) : null}
				</div>
			),
			validationTest: () => true,
			validationErrorFunction: () => {},
			changeAnswerFunction: null,
			onRequestAdvanceStep: async () => {
				const enviou = await handleUploadFile('IR');
				if (enviou) {
					handleRequestAdvance();
				}
			},
			onRequestRetreatStep: handleRequestRetreat,
			alignArrow: 'flex-end',
		},
	];

	const matriz = [
		dadosPessoais,
		estadoCivil,
		dependentes,
		Bens,
		Rend,
		Exp,
		Socios,
		Franquia,
		Prioridades,
		Encerramento,
	];

	return (
		<>
			<ModalCOF open={modalCOFOpen} onClose={() => setModalCOFOpen(false)} />
			<div
				className='YAlign'
				style={{
					alignItems: fullScreen ? 'center' : 'flex-end',
					justifyContent: fullScreen ? 'center' : 'flex-start',
					height: fullScreen ? 'unset' : '100%',
					width: fullScreen ? '100%' : 'unset',
					maxHeight: fullScreen ? 'unset' : '500px',
					padding: fullScreen ? '16px 0px 16px 0px' : '16px 32px 0px 0px',
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: fullScreen ? 'row' : 'column',
						alignItems: fullScreen ? 'center' : 'flex-start',
						justifyContent: fullScreen ? 'space-between' : 'flex-start',
						padding: '8px 40px',
						borderRadius: '4px',
						background: 'rgba(255, 255, 255, 0.2)',
						width: fullScreen ? '100%' : 'unset',
					}}
				>
					{whichHelperDisplay({
						loading,
						matriz,
						question,
						section,
						submitError,
						fullScreen,
					})}
				</div>
			</div>

			<div
				style={{
					padding: '0px 8px 0px 8px',
				}}
			>
				{whichContentDisplay({
					loading,
					matriz,
					question,
					section,
					submitError,
					handleRequestAdvance,
				})}
			</div>

			<div
				className='YAlign'
				style={{
					alignItems: 'center',
					justifyContent: 'flex-start',
					height: '100%',
					maxHeight: '500px',
					width: fullScreen ? '100%' : 'unset',
					overflowY: 'auto',
				}}
			>
				<div
					style={{
						borderRadius: '4px',
						marginTop: '16px',
						background: 'rgba(255, 255, 255, 0.2)',
						width: fullScreen ? '100%' : 'unset',
					}}
				>
					<Stepper
						activeStep={whichStepIsActive(fullScreen, section, stepsName)}
						orientation='vertical'
						style={{
							background: 'transparent',
						}}
					>
						{whichStepDisplay({
							fullScreen,
							stepsName,
							section,
							classes: classes,
						})}
					</Stepper>
				</div>
			</div>
		</>
	);
};

const whichContentDisplay = ({
	loading,
	matriz,
	question,
	section,
	submitError,
	handleRequestAdvance,
}) => {
	if (loading) {
		return (
			<QuestionBox
				question={
					submitError
						? 'Falha ao salvar etapa, tente novamente.'
						: 'Salvando etapa...'
				}
				answer={
					<Button
						variant='contained'
						color='primary'
						endIcon={<ReplayIcon />}
						disabled={!submitError}
						onClick={handleRequestAdvance}
					>
						Tentar novamente
					</Button>
				}
				validation={() => true}
				validationErrorAction={() =>
					Toast('Salvando etapa, aguarde...', 'info')
				}
				onChangeAnswer={() => {}}
				onAdvance={() => {}}
				onRetreat={() => {}}
			/>
		);
	} else if (
		!loading &&
		typeof matriz[section] !== 'undefined' &&
		matriz[section][question] !== 'undefined'
	) {
		return (
			<QuestionBox
				question={matriz[section][question].question}
				answer={matriz[section][question].answerComponent}
				validation={matriz[section][question].validationTest}
				validationErrorAction={
					matriz[section][question].validationErrorFunction
				}
				onChangeAnswer={matriz[section][question].changeAnswerFunction}
				onAdvance={matriz[section][question].onRequestAdvanceStep}
				onRetreat={matriz[section][question].onRequestRetreatStep}
				alignArrow={matriz[section][question].alignArrow}
				answerOnly={matriz[section][question].answerOnly}
			/>
		);
	} else {
		return (
			<QuestionBox
				question='Formulário completo!'
				answer={null}
				validation={() => false}
				validationErrorAction={() =>
					Toast(
						'Voce já respondeu a todas as questões do formulário',
						'success'
					)
				}
				onChangeAnswer={() => {}}
				onAdvance={() => {}}
				onRetreat={() => {}}
			/>
		);
	}
};

const whichHelperDisplay = ({
	loading,
	matriz,
	question,
	section,
	submitError,
	fullScreen,
}) => {
	if (loading && !submitError) {
		return (
			<>
				<Typography variant='h6'>Salvando...</Typography>
				<LinearProgress
					style={{
						width: '100%',
						marginLeft: fullScreen ? '32px' : '0px',
					}}
				/>
			</>
		);
	} else if (loading && submitError) {
		return (
			<>
				<Typography variant='h6'>Falha</Typography>
				<SyncDisabledIcon fontSize='large' color='primary' />
			</>
		);
	} else if (
		!loading &&
		typeof matriz[section] !== 'undefined' &&
		matriz[section][question] !== 'undefined'
	) {
		return (
			<>
				<Typography variant='h6'>Progresso</Typography>
				<CircularStatic progress={(question / matriz[section].length) * 100} />
			</>
		);
	} else {
		return (
			<>
				<Typography variant='h6'>CONCLUÍDO!</Typography>
				<CheckCircleIcon fontSize='large' color='primary' />
			</>
		);
	}
};

const whichStepDisplay = ({ fullScreen, stepsName, section, classes }) => {
	if (fullScreen) {
		let a = stepsName.map((label, index) => {
			if (section === index || section === index + 1 || section === index - 1) {
				return (
					<Step key={label}>
						<StepLabel icon={index + 1} className={classes.StepLabelNumber}>
							{label}
							{section === index ? (
								<EditIcon
									fontSize='small'
									style={{
										marginLeft: '8px',
									}}
								/>
							) : null}
						</StepLabel>
					</Step>
				);
			} else {
				return null;
			}
		});

		a = a.filter((pos) => pos !== null);

		if (section - 1 > 0) {
			a.unshift(
				<Step key={stepsName[section - 2]}>
					<StepLabel icon={`?`} className={classes.StepLabelNumber}>
						...
					</StepLabel>
				</Step>
			);
		}

		if (section + 2 < stepsName.length) {
			a.push(
				<Step key={stepsName[section + 2]}>
					<StepLabel icon={`?`} className={classes.StepLabelNumber}>
						...
					</StepLabel>
				</Step>
			);
		}

		return a;
	} else {
		return stepsName.map((label, index) => (
			<Step key={label}>
				<StepLabel className={classes.StepLabelNumber}>
					{label}
					{section === index ? (
						<EditIcon
							fontSize='small'
							style={{
								marginLeft: '8px',
							}}
						/>
					) : null}
				</StepLabel>
			</Step>
		));
	}
};

const whichStepIsActive = (fullScreen, section, stepsName) => {
	if (fullScreen) {
		if (section < 2) {
			return section;
		} else if (section + 2 > stepsName.length) {
			return section - stepsName.length + 3;
		} else {
			return 2;
		}
	} else {
		return section;
	}
};

const useStyles = makeStyles((theme) => ({
	TextInput: {
		width: '100%',
		margin: '8px',
		paddingRight: '8px',
		'&:nth-child(1) > div > input': {
			marginLeft: '8px',
		},
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	StepLabelNumber: {
		'& > span.MuiStepLabel-iconContainer > svg > circle': {
			color: '#0056C7',
			backgroundColor: '#0056C7',
		},
		'& > span.MuiStepLabel-iconContainer > svg > path': {
			color: '#65e305',
			backgroundColor: '#65e305',
		},
	},
}));

const divStyle = {
	display: 'Flex',
	width: '100%',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center',
	marginBottom: '2%',
};

const inputStyle = {
	width: '20px',
	textAlign: 'center',
	height: 'unset',
	border: '1px solid #9e9e9e',
	marginRight: '10px',
	color: '#0056C7',
	fontWeight: 'bold',
};

const afirmacoes = [
	'Serviço de apoio prestado da franqueadora.',
	'Investimento. A equação financeira entre o quanto é investido e o tempo que demora e haver o retorno desse valor.',
	'Status. Reconhecimento social que ganhará tornando-se um franqueado Pilão Professional.',
	'Afinidade com a marca Pilão.',
	'Lucratividade. Quanto é o potencial de lucro mensal.',
	'Segurança e solidez. Garantidas pelos fatos de ser uma empresa líder no segmento.',
	'Afinidade com o produto café.',
	'Pelos conceitos, valores e cultura (transparência, afetividade, seriedade, etc); percebidos durante o processo de conhecimento da franquia.',
	'Força comercial da marca. Pelo tanto que a marca é conhecida pelo consumidor, faz propagandas e terá capacidade de gerar vendas nas unidades franqueadas.',
	'Indicação de um amigo ou conhecido.',
	'Referências positivas de franqueado(s) da rede Pilão Professional.',
];
