import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-evenly;
	flex-wrap: wrap;
`;

export const Box = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: ${(props) => props.width || '18rem'};
	height: 23rem;
	background: #f3f3f3;
	border-radius: 1rem;
	margin: 8px 0px;
	box-shadow: 0px 0px 10px rgb(0 0 0 / 40%);
	border-radius: 1rem;

	&:hover {
		box-shadow: 0px 0px 10px rgb(0 0 0 / 50%);
		transition: 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		transform: scale(1.015);
	}
`;

export const Buttons = styled.div`
	display: flex;
	width: 100%;
	justify-content: center;
`;
export const Button = styled.div`
	background-color: ${(props) => props.bgColor || '#41211f'};
	width: ${(props) => props.width || '100%'};
	height: 3rem;
	display: flex;
	border-radius: ${(props) => props.borderRadius || '0'};
	color: #fff;
	font-size: 1.2rem;
	cursor: pointer;
	padding: 0px 4px;
	margin: ${(props) => props.margin || '0'};
	justify-content: center;
	align-items: center;

	&:hover {
		transition: 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		background-color: ${(props) => props.bgColorH || '#92211f'};
	}
`;

export const ChamadoButton = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	background-color: ${(props) => (props.Online ? '#CCC' : '#92211f')};
	color: ${(props) => (props.Online ? '#333' : '#FFF')};
	cursor: ${(props) => (props.Online ? 'default' : 'pointer')};
	padding: 8px 0px;
	margin: 8px 0px 0px 0px;
	font-size: 1rem;
	font-weight: bold;

	&:hover {
		transition: 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		background-color: ${(props) =>
			props.Online ? 'rgba(204, 204, 204, 0.8)' : 'rgba(146, 33, 31, 0.8)'};
	}
`;

export const Title = styled.h1`
	font-size: 1.2rem;
	font-weight: bold;
	color: #41211f;
	margin: 0;
	text-align: center;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	width: 100%;
	padding: 0px 8px;
`;

export const Image = styled.img`
	width: 10rem;
	height: 12rem;
	justify-content: center;
	background: url('https://franquiapilaoprofessional.com.br/wp-content/uploads/2020/10/Maquina_Pilao-Lei-Sa.png')
		no-repeat center/contain;
	border: none;
	margin: 5px;
`;

export const Text = styled.p`
	color: ${(props) => props.color || '#41211f'};
	font-size: 1rem;
	font-weight: bold;
	margin: 0;
`;

export const notificationTMT = styled.div`
	background-color: ${(props) => props.color || '#fff'};
`;

export const Card = styled.div`
	display: flex;
	flex-direction: column;
	width: 270px;
	/* height: 300px; */
	background-color: #fff;
	margin: 8px;
	box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
		0 1px 5px 0 rgba(0, 0, 0, 0.12);
	border-radius: 4px;
`;

export const TopInfoLabel = styled.div`
	width: 100%;
	height: 10px;
	border-radius: 4px 4px 0px 0px;
	background-color: ${(props) =>
		props.state === 'OK' ? 'rgb(92, 184, 92)' : 'rgb(217, 83, 79)'};
`;

export const FirstHalf = styled.section`
	display: flex;
	flex-direction: row;
	width: 100%;
	padding: 0px 8px;
`;

export const StateInfoText = styled.span`
	padding: 8px;
	font-size: 12px;
	color: ${(props) =>
		props.state === 'OK' ? 'rgb(92, 184, 92)' : 'rgb(217, 83, 79)'};
`;

export const SecondHalf = styled.section`
	display: flex;
	flex-direction: row;
	width: 100%;
	padding: 0px 8px;
	justify-content: space-between;
`;

export const TelemetryInfo = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding: 8px 0px;
`;

export const Footer = styled.div``;

export const CabContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	padding: 8px 0px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

export const ButtonContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-end;
`;

export const TableHeader = styled.th`
	padding: 0px 8px 0px 0px;
	color: #333;
`;

export const TableCell = styled.td`
	padding: 0px;
	border-bottom: none;
`;

export const TableRow = styled.tr`
	padding: 0px;
`;
