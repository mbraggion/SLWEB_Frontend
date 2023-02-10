import Styled from 'styled-components';
import { RED_PRIMARY, GREY_SECONDARY } from '../misc/colors';
import { roleLevel } from '../misc/commom_functions';
import { REACT_APP_FRANQUEADO_ROLE_LEVEL } from '../misc/role_levels';

export const Header = Styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    padding-right: 1%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: ${
			roleLevel() <= REACT_APP_FRANQUEADO_ROLE_LEVEL
				? RED_PRIMARY
				: GREY_SECONDARY
		};
`;
