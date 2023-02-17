import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MenuItem from '@material-ui/core/MenuItem';

import {
	ChangeCorporativa,
	ChooseInibCopos,
	// ChooseGabinete,
	ChooseAbastecimento,
	ChooseChip,
	ChooseAntena,
} from '../../../global/actions/SolicitacaoAction';

import Selecao from '../../../components/materialComponents/Select';

function Detalhes(props) {
	const {
		ChangeCorporativa,
		ChooseInibCopos,
		// ChooseGabinete,
		ChooseAbastecimento,
		ChooseChip,
		ChooseAntena,
	} = props;

	const {
		InibirCopos,
		Corporativa,
		// Gabinete,
		Abastecimento,
		Chip,
		AntExt,
		Maquina,
		// PermiteGab,
	} = props.State;

	return (
		<>
			<Selecao
				width='200px'
				MLeft='8px'
				MBottom='8px'
				condicao='*Limpe a configuração para alterar'
				label='Máquina Corporativa?'
				value={Corporativa}
				disabled={corporateMachineRules()}
				onChange={(e) => ChangeCorporativa(e.target.value)}
			>
				<MenuItem value={true}>Sim</MenuItem>
				<MenuItem value={false}>Não</MenuItem>
			</Selecao>

			{shouldInibirCopos(Maquina) ? (
				<Selecao
					width='200px'
					MLeft='8px'
					MBottom='8px'
					label='Inibir Copos?'
					value={InibirCopos}
					onChange={(e) => ChooseInibCopos(e.target.value)}
				>
					<MenuItem value={true}>Sim</MenuItem>
					<MenuItem value={false}>Não</MenuItem>
				</Selecao>
			) : null}

			{/* <Selecao
        width="200px"
        MLeft="8px"
        MBottom="8px"
        condicao="*Esta máquina não é compativel com gabinete"
        label="Acompanha Gabinete?"
        value={Gabinete}
        disabled={!PermiteGab}
        onChange={(e) => ChooseGabinete(e.target.value)}
      >
        <MenuItem value={true}>Sim</MenuItem>
        <MenuItem value={false}>Não</MenuItem>
      </Selecao> */}

			<Selecao
				width='200px'
				MLeft='8px'
				MBottom='8px'
				condicao=''
				label='Abastecimento Hídrico'
				value={Abastecimento}
				disabled={false}
				onChange={(e) => ChooseAbastecimento(e.target.value)}
			>
				<MenuItem value='Ponto Hídrico'>Ponto Hídrico</MenuItem>
				<MenuItem value='Galão'>Galão</MenuItem>
			</Selecao>

			<Selecao
				width='200px'
				MLeft='8px'
				MBottom='8px'
				condicao=''
				label='Chip de Telemetria'
				value={Chip}
				disabled={false}
				onChange={(e) => ChooseChip(e.target.value)}
			>
				{Chips.map((chip) => {
					return <MenuItem value={chip}>{chip}</MenuItem>;
				})}
			</Selecao>

			<Selecao
				width='200px'
				MLeft='8px'
				MBottom='8px'
				condicao=''
				label='Antena Externa?'
				value={AntExt}
				disabled={false}
				onChange={(e) => ChooseAntena(e.target.value)}
			>
				<MenuItem value={true}>Sim</MenuItem>
				<MenuItem value={false}>Não</MenuItem>
			</Selecao>
		</>
	);
}

const mapStateToProps = (store) => ({
	State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			ChangeCorporativa,
			ChooseInibCopos,
			// ChooseGabinete,
			ChooseAbastecimento,
			ChooseChip,
			ChooseAntena,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(Detalhes);

const Chips = ['Vivo', 'Tim', 'Claro', 'VodaFone'];

const corporateMachineRules = () => {
	return false;
};

const shouldInibirCopos = (Maquina) => {
	switch (Maquina) {
		case 'LEI SA':
			return false;
		case 'LEI 200':
			return true;
		case 'LEI 400':
			return true;
		case 'LEI 600':
			return true;
		default:
			return false;
	}
};
