import React, { useState } from 'react';
import { api } from '../../../services/api';

import { Add } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import InputMultline from '../../../components/materialComponents/InputMultline';
import Dialog from '../../../components/materialComponents/Dialog';
import Button from '../../../components/materialComponents/Button';
import { roleLevel } from '../../../misc/commom_functions';
import { REACT_APP_FRANQUEADO_ROLE_LEVEL } from '../../../misc/role_levels';
import { RED_SECONDARY } from '../../../misc/colors';
import { Toast } from '../../../components/toasty';
import Select from '../../../components/materialComponents/Select';

const AdicionarLead = () => {
	const [NomeFantasia, setNomeFantasia] = useState('');
	const [RazaoSocial, setRazaoSocial] = useState('');
	const [Estado, setEstado] = useState('');
	const [Municipio, setMunicipio] = useState('');
	const [Contato, setContato] = useState('');
	const [Fone1, setFone1] = useState('');
	const [Fone2, setFone2] = useState('');
	const [Email, setEmail] = useState('');
	const [Desc, setDesc] = useState('');
	const [Msg, setMsg] = useState('');

	const handleSubmit = async () => {
		let toastId = null;
		const loadDTO = {
			NomeFantasia,
			RazaoSocial,
			Estado,
			Municipio,
			Contato,
			Fone1,
			Fone2,
			Email,
			Desc,
			Msg,
		};

		try {
			toastId = Toast('Aguarde...', 'wait');
			await api.post('/leads', {
				lead: loadDTO,
			});

			Toast('Lead Cadastrado!', 'update', toastId, 'success');
			resetField();
		} catch (err) {
			Toast('Falha ao cadastrar lead', 'update', toastId, 'error');
		}
	};

	const resetField = () => {
		setNomeFantasia('');
		setRazaoSocial('');
		setEstado('');
		setMunicipio('');
		setContato('');
		setFone1('');
		setFone2('');
		setEmail('');
		setDesc('');
		setMsg('');
	};

	return roleLevel() <= REACT_APP_FRANQUEADO_ROLE_LEVEL ? null : (
		<div
			style={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'flex-end',
				width: '100%',
			}}
		>
			<Dialog
				icone={<Add />}
				botao='Adicionar'
				title='Adicionar Lead'
				action={
					<Button
						style={{ backgroundColor: RED_SECONDARY, color: '#FFFFFF' }}
						onClick={() => handleSubmit()}
						icon={<Add />}
					>
						Cadastrar
					</Button>
				}
			>
				<div
					className='XAlign'
					style={{ width: '100%', justifyContent: 'space-between' }}
				>
					<TextField
						style={{ margin: '0px 0px 8px 0px' }}
						value={NomeFantasia}
						id='outlined-basic'
						label='Nome Fantasia'
						variant='outlined'
						onChange={(e) => setNomeFantasia(e.target.value)}
					/>
					<TextField
						style={{ margin: '0px 0px 8px 0px' }}
						value={RazaoSocial}
						id='outlined-basic'
						label='Razão Social'
						variant='outlined'
						onChange={(e) => setRazaoSocial(e.target.value)}
					/>
				</div>
				<Select
					width='100%'
					MBottom='8px'
					label='Estado'
					value={Estado}
					onChange={(e) => setEstado(e.target.value)}
				>
					{estados.map((estado) => (
						<MenuItem value={estado.UF}>{estado.estado}</MenuItem>
					))}
				</Select>

				<div
					className='XAlign'
					style={{ width: '100%', justifyContent: 'space-between' }}
				>
					<TextField
						style={{ margin: '0px 16px 0px 0px' }}
						value={Municipio}
						id='outlined-basic'
						label='Município'
						variant='outlined'
						onChange={(e) => setMunicipio(e.target.value)}
					/>
					<TextField
						style={{ margin: '8px 0px 8px 0px' }}
						value={Contato}
						id='outlined-basic'
						label='Contato'
						variant='outlined'
						onChange={(e) => setContato(e.target.value)}
					/>
				</div>
				<div
					className='XAlign'
					style={{ width: '100%', justifyContent: 'space-between' }}
				>
					<TextField
						style={{ margin: '0px 16px 0px 0px' }}
						value={Fone1}
						id='outlined-basic'
						label='Fone 1'
						variant='outlined'
						onChange={(e) => setFone1(e.target.value)}
					/>
					<TextField
						style={{ margin: '8px 0px 8px 0px' }}
						value={Fone2}
						id='outlined-basic'
						label='Fone 2'
						variant='outlined'
						onChange={(e) => setFone2(e.target.value)}
					/>
				</div>
				<TextField
					style={{ width: '100%' }}
					value={Email}
					id='outlined-basic'
					label='Email'
					variant='outlined'
					onChange={(e) => setEmail(e.target.value)}
				/>
				<InputMultline
					style={{
						width: '100%',
						marginTop: '8px',
						backgroundColor:
							charCount(Desc, 250) < 0 ? 'rgb(255, 0, 0, 0.5)' : 'inherit',
					}}
					value={Desc}
					onChange={(e) => setDesc(e.target.value)}
					label={`Atividade/Descrição(${charCount(Desc, 250)})`}
				/>
				<InputMultline
					style={{
						width: '100%',
						marginTop: '8px',
						backgroundColor:
							charCount(Msg, 250) < 0 ? 'rgb(255, 0, 0, 0.5)' : 'inherit',
					}}
					value={Msg}
					onChange={(e) => setMsg(e.target.value)}
					label={`Recado Lead (${charCount(Msg, 250)})`}
				/>
			</Dialog>
		</div>
	);
};

export default AdicionarLead;

const charCount = (field, maxChar) => {
	return maxChar - field.length;
};

const estados = [
	{ estado: 'Acre', UF: 'AC' },
	{ estado: 'Alagoas', UF: 'AL' },
	{ estado: 'Amapá', UF: 'AP' },
	{ estado: 'Amazonas', UF: 'AM' },
	{ estado: 'Bahia', UF: 'BA' },
	{ estado: 'Ceará', UF: 'CE' },
	{ estado: 'Distrito Federal', UF: 'DF' },
	{ estado: 'Espírito Santo', UF: 'ES' },
	{ estado: 'Goiás', UF: 'GO' },
	{ estado: 'Maranhão', UF: 'MA' },
	{ estado: 'Mato Grosso', UF: 'MT' },
	{ estado: 'Mato Grosso do Sul', UF: 'MS' },
	{ estado: 'Minas Gerais', UF: 'MG' },
	{ estado: 'Pará', UF: 'PA' },
	{ estado: 'Paraíba', UF: 'PB' },
	{ estado: 'Paraná', UF: 'PR' },
	{ estado: 'Pernambuco', UF: 'PE' },
	{ estado: 'Piauí', UF: 'PI' },
	{ estado: 'Rio de Janeiro', UF: 'RJ' },
	{ estado: 'Rio Grande do Norte', UF: 'RN' },
	{ estado: 'Rio Grande do Sul', UF: 'RS' },
	{ estado: 'Rondônia', UF: 'RO' },
	{ estado: 'Roraima', UF: 'RR' },
	{ estado: 'Santa Catarina', UF: 'SC' },
	{ estado: 'São Paulo', UF: 'SP' },
	{ estado: 'Sergipe', UF: 'SE' },
	{ estado: 'Tocantins', UF: 'TO' },
];
