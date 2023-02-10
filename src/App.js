import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import { ptBR } from '@material-ui/data-grid';
import 'moment/locale/pt-br';
import moment from 'moment';

import { ToastyContainer } from './components/toasty';
import { PALETTE_RED_PRIMARY, PALETTE_GREY_PRIMARY } from './misc/colors';

import Main from './router/main';

const App = () => {
	moment.locale('pt-br');

	return (
		<ThemeProvider theme={theme}>
			<ToastyContainer />
			<Main />
		</ThemeProvider>
	);
};

export default App;

const theme = createTheme(
	{
		palette: {
			primary: PALETTE_RED_PRIMARY,
			secondary: PALETTE_GREY_PRIMARY,
		},
	},
	ptBR
);
