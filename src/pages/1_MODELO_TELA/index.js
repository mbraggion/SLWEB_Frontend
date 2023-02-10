import React, { useState, useEffect } from 'react';

//Meio de comunicação
import { api } from '../../services/api';
//"Placeholder" da página enquanto dados são carregados no
import Loading from '../../components/loading_screen';

//import de elementos visuais
import { Panel, Container } from '../../components/commom_in';
import { Toast } from '../../components/toasty';

function Exemplo() {
	const [loaded, setLoaded] = useState(false);

	//componentDidMount
	useEffect(() => {
		async function LoadData() {
			try {
				//requisição inicial para obter dados essenciais da pagina
				const response = await api.get('');

				setLoaded(true);
			} catch (err) {}
		}

		LoadData();
	}, []);

	//componentWillUnmount
	useEffect(() => {
		return () => {
			console.log('Resetar store');
		};
	}, []);

	return !loaded ? (
		<Loading />
	) : (
		<Container>
			<Panel></Panel>
		</Container>
	);
}

export default Exemplo;
