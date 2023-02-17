import React from 'react';

import Out from './out/routes';
import In from './in/routes';

//import de css
import 'materialize-css';
import '../style/materialize.css';
import '../style/MainStyle.css';

const Main = () => {
	// const theme = useTheme();
	// const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

	//isso não ta funfando mas devia, ver isso dps
	// useEffect(() => {
	//   if (!isMdUp) {
	//     alert('Para melhor experiencia, recomendamos o uso do site em aparelhos com largura maior que 400 pixels')
	//   }
	// }, [isMdUp])

	return sessionStorage.getItem('token') ? <In /> : <Out />;
};

export default Main;
