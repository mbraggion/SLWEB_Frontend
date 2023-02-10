import styled from 'styled-components';

export const Block = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 50%;
	height: 100%;
	font-size: 1.5rem;
	background: ${(props) => props.bgColor || '#fff'};
	padding: 3vw;
	border: ${(props) => props.border || 'none'};

	@media (max-width: 768px) {
		width: 100%;
		margin: 0px;
		padding: 1vw;
		font-size: 1rem;
	}
`;

export const BlockTotal = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100vw;
	max-width: 100vw;
	font-size: 1.5rem;
	background: ${(props) => props.bgColor || '#fff'};
	padding: 5vw;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

export const Title = styled.h1`
	font-size: 3em;
	color: #fff;
	text-align: center;
	padding: 0px 8px;
`;

export const Text = styled.p`
	color: ${(props) => props.color || '#fff'};
	text-align: justify;
	@media (max-width: 768px) {
		font-size: 1.5em;
		width: 95vw;
		padding: 0px 8px;
	}
`;

export const InputEmail = styled.input`
	text-align: left;
	border-radius: 0.5rem;
	border: 1px solid #000;
	width: 50vw;
`;

export const Body = styled.div`
	display: flex;
	width: 80vw;
	height: 90vh;
	flex-direction: column;
	align-items: center;
	margin-top: 5rem;
	border: 1px solid #000;
	border-radius: 0.5rem;
`;

export const DivEmail = styled.div`
	display: flex;
	flex-direction: row;
`;

export const ContainerFFq = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	flex-direction: column;
	background-color: none;
	align-items: center;
	overflow: ${(props) => props.overflow};
	justify-content: center;
	align-content: center;
	height: unset;
	text-align: center;
	background: #f21;
`;

export const Container = styled.div`
	display: flex;
	margin: 0px;
	padding: 0px;

	height: 100vh;
	width: 100%;

	@media (max-width: 768px) {
		flex-direction: column;
		width: 100%;
		height: 100%;

		padding: 0px;
		margin: 0px;

		font-size: 1rem;
	}
`;

export const Button = styled.button`
	width: 25rem;
	height: 5rem;
	border-radius: 1rem;
	border: ${(props) => props.border};
	background-color: ${(props) => props.bgColor};
	margin-top: 1rem;
	color: ${(props) => props.color};
	font-size: 1.5rem;

	&:hover {
		transition: 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		cursor: pointer;
		box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
		background-color: ${(props) => props.hover};
		color: ${(props) => props.colorH || '#fff'};
	}

	@media (max-width: 768px) {
		width: 95vw;
		height: 12vh;
	}
`;

export const InputUnderline = styled.input`
	border-radius: 0.5rem;
	border: none;
	width: 40vw;
	height: 5vh;
`;

export const FormContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: ${(props) => (props.fullscreen ? 'column' : 'row')};
	align-items: center;
	justify-content: ${(props) => (props.fullscreen ? 'flex-start' : 'center')};

	width: 100%;
	height: 100%;
	min-height: 100vh;
	padding: 8px;

	background-image: linear-gradient(to bottom right, #333333 70%, #c8102e);
`;

export const FormBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;

	width: 500px;
	max-width: calc(100vw - 16px);
	height: 500px;
	padding: 16px;

	background-color: #fff;
	box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.2);
	border-radius: 8px;
`;
