import React, {
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { api } from '../../../services/api';

import {
	Typography,
	TextField,
	FormControl,
	Divider,
	makeStyles,
	MenuItem,
	Select,
	InputLabel,
} from '@material-ui/core';

import {
	CheckCircle as CheckCircleIcon,
	NotInterested as NotInterestedIcon,
} from '@material-ui/icons';

import DatePicker from '../../../components/materialComponents/datePicker';
import { toValidString } from '../../../misc/commom_functions';
import { Toast } from '../../../components/toasty';

export const Dados = forwardRef(
	({ PdvId, AnxId, allowEditing, onRequestEquipSection }, ref) => {
		const classes = useStyles();

		const [details, setDetails] = useState(INITIAL_STATE);
		const [depositos, setDepositos] = useState([]);
		const [configuracoes, setConfiguracoes] = useState([]);
		const [loaded, setLoaded] = useState(false);

		async function LoadData() {
			const response = await api.get(
				`/pontosdevenda/info/${PdvId}/${AnxId}/basic`
			);

			setDetails(response.data.Dados.cadastro);
			setDepositos(response.data.Dados.depositos);
			setConfiguracoes(response.data.Dados.configuracoes);
			setLoaded(true);
		}

		useEffect(() => {
			LoadData();
			// eslint-disable-next-line
		}, []);

		useImperativeHandle(ref, () => ({
			async handleSubmit() {
				if (validate(details)) {
					try {
						await api.put(`/pontosdevenda/atualizar/${PdvId}/${AnxId}/basic`, {
							UpdatedData: {
								PDV: details,
							},
						});

						return true;
					} catch (err) {
						return false;
					}
				} else {
					return false;
				}
			},

			async undoChanges() {
				setLoaded(false);
				await LoadData();
			},
		}));

		return !loaded ? (
			<Typography variant='subtitle1'>Carregando...</Typography>
		) : (
			<>
				<Divider variant='inset' />
				<li
					style={{
						listStyleType: 'none',
					}}
				>
					<Typography
						className={classes.dividerInset}
						color='primary'
						display='block'
						variant='caption'
					>
						Dados Básicos
					</Typography>
				</li>

				<section className={classes.line}>
					<TextField
						variant='standard'
						label='Cliente'
						value={toValidString(details.AnxDesc)}
						disabled={true}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								AnxDesc: e.target.value,
							}));
						}}
						style={{ width: '100%' }}
					/>
				</section>
				<section className={classes.line}>
					<TextField
						variant='standard'
						label='CNPJ'
						value={toValidString(details.CNPJss)}
						disabled={true}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								CNPJss: e.target.value,
							}));
						}}
						style={{ width: '100%' }}
					/>
				</section>
				<section className={classes.line}>
					<FormControl className={classes.formControl}>
						<InputLabel>Depósito</InputLabel>
						<Select
							value={details.DepId}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									DepId: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							{depositos.map((dep) => (
								<MenuItem value={dep.DepId} key={dep.DepId}>
									{dep.DepNome}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel>Configuracao</InputLabel>
						<Select
							value={details.CfgId}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									CfgId: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							{configuracoes.map((cfg) => (
								<MenuItem value={cfg.CfgId} key={cfg.CfgId}>
									{cfg.CfgDesc}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</section>
				<section className={classes.lineStart}>
					<TextField
						variant='standard'
						label='Modelo'
						value={details.EQUIPMOD_Desc}
						disabled={true}
						style={{ width: '50px', marginRight: '8px' }}
					/>
					<TextField
						variant='standard'
						label='Código'
						value={details.EquiCod}
						disabled={true}
						style={{ width: '100px', marginRight: '8px' }}
					/>
					<div
						className='XAlign'
						style={{
							fontSize: '16px',
							height: '62px',
							paddingBottom: '8px',
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
						}}
					>
						{details.PdvStatus === 'A' ? (
							<>
								STATUS PDV: <stong style={{ fontWeight: 'bold' }}>Ativo</stong>
								<CheckCircleIcon
									style={{ color: 'green', marginLeft: '8px' }}
								/>
							</>
						) : (
							<>
								STATUS PDV:{' '}
								<stong style={{ fontWeight: 'bold' }}>Inativo</stong>
								<NotInterestedIcon
									style={{ color: 'red', marginLeft: '8px' }}
								/>
							</>
						)}
					</div>

					{/* <TextField
            variant='standard'
            label="IMEI"
            value={details.IMEI}
            disabled={true}
          /> */}
					{/* <IconButton
            onClick={onRequestEquipSection}
          >
            <ShuffleIcon />
          </IconButton> */}
				</section>
				<section className={classes.line}>
					<TextField
						variant='standard'
						label='Logradouro'
						value={toValidString(details.PdvLogradouroPV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvLogradouroPV: e.target.value,
							}));
						}}
						style={{ width: '250px', marginRight: '8px' }}
					/>
					<TextField
						variant='standard'
						label='Número'
						value={toValidString(details.PdvNumeroPV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvNumeroPV: e.target.value,
							}));
						}}
						style={{ width: '70px', marginRight: '8px' }}
					/>
				</section>
				<section className={classes.line}>
					<TextField
						variant='standard'
						label='Complemento'
						value={toValidString(details.PdvComplementoPV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvComplementoPV: e.target.value,
							}));
						}}
						style={{ width: '100%' }}
					/>
				</section>
				<section className={classes.line}>
					<TextField
						variant='standard'
						label='Bairro'
						value={toValidString(details.PdvBairroPV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvBairroPV: e.target.value,
							}));
						}}
						style={{ width: '100%', marginRight: '8px' }}
					/>
					<TextField
						variant='standard'
						label='Município'
						value={toValidString(details.PdvCidadePV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvCidadePV: e.target.value,
							}));
						}}
						style={{ width: '200px' }}
					/>
				</section>
				<section className={classes.lineStart}>
					<TextField
						variant='standard'
						label='UF'
						value={toValidString(details.PdvUfPV)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvUfPV: e.target.value,
							}));
						}}
						style={{ width: '50px', marginRight: '8px' }}
					/>
					<TextField
						variant='standard'
						label='CEP'
						value={toValidString(details.PdvCEP)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvCEP: e.target.value,
							}));
						}}
						style={{ width: '100px' }}
					/>
				</section>
				<section className={classes.lineStart}>
					{/* <TextField
            variant='standard'
            label="Departamento"
            value={toValidString(details.PdvDepartamento)}
            disabled={allowEditing}
            onChange={(e) => {
              e.persist()
              setDetails(oldState => ({
                ...oldState,
                PdvDepartamento: e.target.value
              }))
            }}
            style={{ width: '100%', marginRight: '8px' }}
          /> */}
					<TextField
						variant='standard'
						label='Anotações'
						value={toValidString(details.PdvObs)}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvObs: e.target.value,
							}));
						}}
						style={{ width: '100%' }}
					/>
				</section>

				<Divider variant='inset' />
				<li
					style={{
						listStyleType: 'none',
					}}
				>
					<Typography
						className={classes.dividerInset}
						color='primary'
						display='block'
						variant='caption'
					>
						Alterações
					</Typography>
				</li>

				<section className={classes.line}>
					<DatePicker
						label='Data Ativação'
						disabled={true}
						defaultValue={details.PdvDataAtivacao}
						onChange={() => {}}
					/>
					<DatePicker
						label='Data Encerramento'
						disabled={true}
						defaultValue={details.PdvDataEncerramento}
						onChange={() => {}}
					/>
				</section>

				<section className={classes.line}>
					<TextField
						variant='standard'
						label='Motivo do encerramento'
						value={details.PdvMotivoEncerramento}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvMotivoEncerramento: e.target.value,
							}));
						}}
						style={{ width: '100%', margin: '16px 0px 8px 0px' }}
					/>
				</section>

				<Divider variant='inset' />
				<li
					style={{
						listStyleType: 'none',
					}}
				>
					<Typography
						className={classes.dividerInset}
						color='primary'
						display='block'
						variant='caption'
					>
						Faturamento
					</Typography>
				</li>

				<section className={classes.line}>
					<FormControl
						className={classes.formControl}
						style={{
							minWidth: '120px',
						}}
					>
						<InputLabel>Anexo tem mín.</InputLabel>
						<Select
							value={details.AnxFatMinimo}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									AnxFatMinimo: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							<MenuItem value='S'>Sim</MenuItem>
							<MenuItem value='N'>Não</MenuItem>
						</Select>
					</FormControl>
					<FormControl
						className={classes.formControl}
						style={{
							minWidth: '120px',
						}}
					>
						<InputLabel>Mínimo por</InputLabel>
						<Select
							value={details.AnxCalcMinPor}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									AnxCalcMinPor: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							<MenuItem value='A'>Anexo</MenuItem>
							<MenuItem value='P'>Ponto de Venda</MenuItem>
						</Select>
					</FormControl>
					<FormControl
						className={classes.formControl}
						style={{
							minWidth: '120px',
						}}
					>
						<InputLabel>Tipo de mín.</InputLabel>
						<Select
							value={details.AnxTipMin}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									AnxTipMin: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							<MenuItem value='R'>Reais</MenuItem>
							<MenuItem value='D'>Doses</MenuItem>
						</Select>
					</FormControl>
				</section>
				<section
					className={classes.line}
					style={{
						alignItems: 'flex-end',
					}}
				>
					<FormControl
						className={classes.formControl}
						style={{
							minWidth: '120px',
							marginRight: '8px',
						}}
					>
						<InputLabel>PDV tem mín.</InputLabel>
						<Select
							value={details.PdvConsMin}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									PdvConsMin: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							<MenuItem value='S'>Sim</MenuItem>
							<MenuItem value='N'>Não</MenuItem>
						</Select>
					</FormControl>
					<TextField
						variant='standard'
						label='Consumo mín. em R$'
						value={details.PdvConsValor}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvConsValor: e.target.value,
							}));
						}}
						style={{ width: '120px', marginRight: '8px' }}
					/>
					<TextField
						variant='standard'
						label='Consumo mín. em doses'
						value={details.PdvConsDose}
						disabled={allowEditing}
						onChange={(e) => {
							e.persist();
							setDetails((oldState) => ({
								...oldState,
								PdvConsDose: e.target.value,
							}));
						}}
						style={{ width: '120px' }}
					/>
				</section>
				<section className={classes.line}>
					<FormControl
						className={classes.formControl}
						style={{
							width: '100%',
						}}
					>
						<InputLabel>Considerar valor pago no cálculo de mínimo?</InputLabel>
						<Select
							value={details.PdvSomaCompartilhado}
							onChange={(e) => {
								setDetails((oldState) => ({
									...oldState,
									PdvSomaCompartilhado: e.target.value,
								}));
							}}
							disabled={allowEditing}
						>
							<MenuItem value='S'>Sim</MenuItem>
							<MenuItem value='N'>Não</MenuItem>
						</Select>
					</FormControl>
				</section>
			</>
		);
	}
);

const validate = (data) => {
	if (
		data.DepId === null ||
		data.DepId === '' ||
		typeof data.DepId === 'undefined'
	) {
		Toast('Depósito inválido', 'warn');
		return false;
	}

	if (
		data.CfgId === null ||
		data.CfgId === '' ||
		typeof data.CfgId === 'undefined'
	) {
		Toast('Configuração inválida', 'warn');
		return false;
	}

	if (
		data.PdvLogradouroPV === null ||
		data.PdvLogradouroPV === '' ||
		typeof data.PdvLogradouroPV === 'undefined'
	) {
		Toast('Logradouro inválido', 'warn');
		return false;
	}

	if (
		data.PdvNumeroPV === null ||
		data.PdvNumeroPV === '' ||
		typeof data.PdvNumeroPV === 'undefined'
	) {
		Toast('Número inválido', 'warn');
		return false;
	}

	if (
		data.PdvBairroPV === null ||
		data.PdvBairroPV === '' ||
		typeof data.PdvBairroPV === 'undefined'
	) {
		Toast('Bairro inválido', 'warn');
		return false;
	}

	if (
		data.PdvCidadePV === null ||
		data.PdvCidadePV === '' ||
		typeof data.PdvCidadePV === 'undefined'
	) {
		Toast('Município inválido', 'warn');
		return false;
	}

	if (
		data.PdvUfPV === null ||
		data.PdvUfPV === '' ||
		typeof data.PdvUfPV === 'undefined'
	) {
		Toast('UF inválida', 'warn');
		return false;
	}

	if (
		data.PdvCEP === null ||
		data.PdvCEP === '' ||
		typeof data.PdvCEP === 'undefined'
	) {
		Toast('CEP inválido', 'warn');
		return false;
	}

	if (
		data.PdvConsMin === null ||
		data.PdvConsMin === '' ||
		typeof data.PdvConsMin === 'undefined'
	) {
		Toast('Informe se o Ponto de Venda tem consumo mínimo', 'warn');
		return false;
	}

	if (
		data.PdvConsMin === 'S' &&
		(data.PdvConsValor === null ||
			data.PdvConsValor === '' ||
			typeof data.PdvConsValor === 'undefined')
	) {
		Toast('Informe o valor do consumo mínimo', 'warn');
		return false;
	}

	if (
		data.PdvConsMin === 'S' &&
		(data.PdvConsDose === null ||
			data.PdvConsDose === '' ||
			typeof data.PdvConsDose === 'undefined')
	) {
		Toast('Informe a quantidade de doses do consumo mínimo', 'warn');
		return false;
	}

	if (
		data.PdvConsMin === 'S' &&
		(data.PdvSomaCompartilhado === null ||
			data.PdvSomaCompartilhado === '' ||
			typeof data.PdvSomaCompartilhado === 'undefined')
	) {
		Toast(
			'Informe se a o consumo deve ser condiderado para o calculo de mínimo',
			'warn'
		);
		return false;
	}

	if (
		data.AnxFatMinimo === null ||
		data.AnxFatMinimo === '' ||
		typeof data.AnxFatMinimo === 'undefined'
	) {
		Toast('Informe se o Anexo tem consumo mínimo', 'warn');
		return false;
	}

	if (
		data.AnxCalcMinPor === null ||
		data.AnxCalcMinPor === '' ||
		typeof data.AnxCalcMinPor === 'undefined'
	) {
		Toast(
			'Informe se o mínimo deve ser calculado por Anexo ou Ponto de Venda',
			'warn'
		);
		return false;
	}

	if (
		data.AnxTipMin === null ||
		data.AnxTipMin === '' ||
		typeof data.AnxTipMin === 'undefined'
	) {
		Toast('Informe se o mínimo deve ser calculado por doses ou reais', 'warn');
		return false;
	}

	return true;
};

const useStyles = makeStyles((theme) => ({
	line: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'nowrap',
		minWidth: '400px',
		marginBottom: '8px',
	},
	lineStart: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'nowrap',
		minWidth: '400px',
		marginBottom: '8px',
	},
	infoBox: {
		padding: '4px',
		border: '1px solid #ccc',
	},
}));

const INITIAL_STATE = {
	DepId: 1,
	CfgId: 1,

	EQUIPMOD_Desc: '',
	EquiCod: '',
	IMEI: '',

	AnxDesc: '',
	PdvLogradouroPV: '',
	PdvNumeroPV: '',
	PdvComplementoPV: '',
	PdvCidadePV: '',
	PdvCEP: '',
	PdvObs: '',
	PdvDataAtivacao: null,
	PdvDataEncerramento: null,
	PdvDataAlteracao: null,
	PdvMotivoEncerramento: '',

	AnxFatMinimo: 'N',
	AnxCalcMinPor: 'A',
	AnxTipMin: 'R',

	PdvConsMin: 'N',
	PdvConsValor: '',
	PdvConsDose: '',
	PdvSomaCompartilhado: 'N',
};
