import React, { useState, useEffect } from 'react';

import { Search, FindReplace } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import Button from '../../components/materialComponents/Button';

import InputMultline from '../../components/materialComponents/InputMultline';

import List from './List';

const Disponiveis = (props) => {
	const [LeadsFiltrado, setLeadsFiltrado] = useState(props.Leads);
	const [Filtro, setFiltro] = useState();

	const handleFilter = () => {
		// se replace(/\p{Diacritic}/gu, "") parar de funcionar, use replace(/[\u0300-\u036f]/g, "")

		if (Filtro.trim() === '') {
			setLeadsFiltrado(props.Leads);
		} else {
			setLeadsFiltrado(
				props.Leads.filter(
					(lead) =>
						lead.Municipio &&
						String(lead.Municipio)
							.normalize('NFD')
							.replace(/\p{Diacritic}/gu, '')
							.toUpperCase()
							.trim() ===
							String(Filtro)
								.normalize('NFD')
								.replace(/\p{Diacritic}/gu, '')
								.toUpperCase()
								.trim()
				)
			);
		}
	};

	useEffect(() => {
		setLeadsFiltrado(props.Leads);
	}, [props.Leads]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					flexWrap: 'wrap',
					margin: '8px 0px 8px 0px',
				}}
			>
				<Typography variant='h5' gutterBottom>
					Leads Disponiveis({LeadsFiltrado.length})
				</Typography>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<InputMultline
						style={{ margin: '0px 8px 0px 0px' }}
						value={Filtro}
						onChange={(e) => setFiltro(e.target.value)}
						label='Filtrar Município'
					/>
					<Button onClick={() => handleFilter()}>
						{Filtro === '' ? <FindReplace /> : <Search />}
					</Button>
				</div>
			</div>

			<List Leads={LeadsFiltrado} />
		</div>
	);
};

export default Disponiveis;
