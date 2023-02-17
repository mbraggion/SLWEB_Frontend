import React, { useEffect, useState } from 'react';

//Meio de comunicação
import { api } from '../../services/api';
//"Placeholder" da página enquanto dados são carregados no
import Loading from '../../components/loading_screen';

//import de elementos visuais
import { Panel } from '../../components/commom_in';
import { NewRecipeModal } from './modals/newRecipeModal';
import { RecipeDetailsModal } from './modals/recipeDetailsModal';
import { ReceitasListOptions } from './options';
import { RecipeList } from './recipeList';

function Receitas() {
	const [loaded, setLoaded] = useState(false);
	const [filtro, setFiltro] = useState('');
	const [mostrarInativos, setMostrarInativos] = useState(false);
	const [newRecipeModalOpen, setNewRecipeModalOpen] = useState(false);
	const [recipeDetailsModalOpen, setRecipeDetailsModal] = useState(false);
	const [targetRecipeId, setTargetRecipeId] = useState(null);
	const [receitas, setReceitas] = useState([]);
	const [grpInsumos, setGrpInsumos] = useState([]);

	//componentDidMount
	useEffect(() => {
		async function LoadData() {
			try {
				//requisição inicial para obter dados essenciais da pagina
				const response = await api.get('/receita');

				setLoaded(true);
				setReceitas(response.data.Receitas);
				setGrpInsumos(response.data.GrupoInsumos);
			} catch (err) {}
		}

		LoadData();
	}, []);

	const handleOpenNewRecipeModal = () => {
		setNewRecipeModalOpen(true);
	};

	const handleCloseNewRecipeModal = () => {
		setNewRecipeModalOpen(false);
	};

	const handleOpenRecipeDetailsModal = (id) => {
		setRecipeDetailsModal(true);
		setTargetRecipeId(id);
	};

	const handleCloseRecipeDetailsModal = () => {
		setRecipeDetailsModal(false);
		setTargetRecipeId(null);
	};

	return !loaded ? (
		<Loading />
	) : (
		<Panel>
			<RecipeDetailsModal
				open={recipeDetailsModalOpen}
				onClose={handleCloseRecipeDetailsModal}
				onUpdateRecipesArray={setReceitas}
				GrupoInsumo={grpInsumos}
				RecId={targetRecipeId}
			/>
			<NewRecipeModal
				open={newRecipeModalOpen}
				onClose={handleCloseNewRecipeModal}
				onUpdateRecipesArray={setReceitas}
				GrupoInsumo={grpInsumos}
			/>
			<ReceitasListOptions
				onChangeFiltro={setFiltro}
				onOpenNewRecipeModal={handleOpenNewRecipeModal}
				mostrarInativos={mostrarInativos}
				switchInativos={setMostrarInativos}
			/>
			<RecipeList
				Recipes={returnRecipesFilter(receitas, mostrarInativos, filtro)}
				onOpenDetailsModal={handleOpenRecipeDetailsModal}
			/>
		</Panel>
	);
}

export default Receitas;

const returnRecipesFilter = (recipes, shouldShowInactive, filterString) => {
	var re = new RegExp(filterString.trim().toLowerCase());

	return recipes
		.filter((recipe) => {
			if (shouldShowInactive) {
				return true;
			} else if (!shouldShowInactive && recipe.RecStatus === 'A') {
				return true;
			} else {
				return false;
			}
		})
		.filter((recipe) => {
			if (filterString.trim() === '') {
				return true;
			} else if (
				filterString.trim() !== '' &&
				recipe.RecDesc.trim().toLowerCase().match(re)
			) {
				return true;
			} else {
				return false;
			}
		});
};
