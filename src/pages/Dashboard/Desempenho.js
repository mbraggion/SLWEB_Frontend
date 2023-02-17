import React from 'react';
import { Chart } from 'react-google-charts';

export const Desempenho = ({ performances }) => {
	return performances.length > 0 ? (
		<Chart
			chartType='Line'
			data={normalizedData(performances)}
			options={{
				chart: {
					title: 'Performance dos Equipamentos',
					subtitle: 'nas últimas 4 semanas',
				}
			}}
			width='100%'
			height={'400px'}
		/>
	) : null ;
};

const normalizedData = (performances) => {
	const data = [];

	data.push([
		'Produção de Doses',
		...performances.map((p) => `${p.EquiCod ?? ''} - ${p.AnxDesc ?? ''}`),
	]);
	data.push(['Há três semanas', ...performances.map((p) => p.Prd3 ?? 0)]);
	data.push(['Há duas semanas', ...performances.map((p) => p.Prd2 ?? 0)]);
	data.push(['Há uma semana', ...performances.map((p) => p.Prd1 ?? 0)]);
	data.push(['Esta semana', ...performances.map((p) => p.Prd ?? 0)]);

	console.log(data)
	return data;
};
