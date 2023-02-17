import Styled from 'styled-components';

export const Container = Styled.div`
    display: flex;
    flex: 1;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
    background-color: none;
    align-items: center;
    overflow: ${(props) => props.overflow};   
`;

export const Subcontainer = Styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    width: 100%;
`;

export const Titulo = Styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: none;
    width: 100%;
    margin-bottom: 10px;

    text{
        margin-right: 10px;
        margin-right: 10vw;
    }

    label{
        margin-left: 10px;
        font-weight: bold;
    }
`;

export const Option = Styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    width: 20vw;
    padding-left: 10px;
    height: 7vh;
    min-height: 40px;
    background-color: #323835;
    font-weight: bold;
    color: #7159c1;
    cursor: pointer;

    &:hover{
        animation-name: hover;
        animation-duration: 400ms;
        animation-fill-mode: forwards;
    }

    @keyframes hover{
        0%{
            background-color: #323835;
            color: #7159c1;
        }100%{
            color: #323835;
            background-color: #e0dcdc;
        }
    }

    label{
        cursor: pointer;
        font-size: 14px;
    }

`;

export const Panel = Styled.div`
    margin-top: 64px;
    margin-left: 73px; //novo sidebar
    display: flex;
    flex-direction: ${(props) => props.flexDirection || 'column'};
    justify-content:  ${(props) => props.jContent || 'flex-start'};
    align-items: center;
    flex-wrap: wrap;
    background-color: none;
    border: ${(props) => props.border || '1px solid #ccc'} ;
    box-shadow: ${(props) =>
			props.boxShadow || '0px -0px 5px 3px rgba(0, 0, 0, 0.2)'};
    padding: 20px 20px 30px 20px;
    
    height:  calc(100% - 64px);
    width: calc(100% - 73px);
    
    //novo sidebar
    @media (max-width: 960px) {
        height: calc(100% - 64px);
        width: calc(100% - 0px);
        margin-left: 0px;
        margin-top: 64px;
    }
    
    //novo sidebar
    @media (max-width: 600px) {
        height: calc(100% - 48px);
        width: calc(100% - 0px);
        margin-left: 0px;
        margin-top: 48px;
        padding: 20px 0px 0px 0px;
  }
`;

export const Exit = Styled.a`
    display: flex;
    width: 100%;
    flex-direction: row;
    font-size: 16px;
    
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
`;
export const Combobox = Styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 14px;
    
    justify-content: center;
    align-items: center;

    table{
            white-space: nowrap;
        tr{
            line-height: 1.5;
        }
    }
`;

export const Button = Styled.button`
    height: 5vh;
    margin: 10px 0px 0px 30px;
    background-color: #6ea5ff;
    border: 2px outset #6ea5ff;
    color: #FFF;
    border-radius: 1vh;
    margin-bottom: 1vh;
    font-weight:bold;

    &:hover{
        background-color: #6ea5ff;
        border: 2px inset #6ea5ff;
        color: #FFF;
        cursor: pointer;
    }
`;

export const CommomCheckbox = Styled.input`
    height: 16px,
    width: 16px,
    background-color: #ccc,
    opacity: 1,
    pointer-events: auto
    border-radius: 4px;
`;

export const Contagem = Styled.label`
    height: 2.5vh;
    padding: 0 1vw 0 1vw;
    background-color: #FFF;
`;

export const Rotulo = Styled.label`
    font-weight: bold;
    margin-right: 1vw;
    margin-top: 30px;
`;

export const Campo = Styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 10px 0px 0px 10px;
`;

export const Valor = Styled.input`
    display:flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #333;
    border-radius: 10px;
    background-color: #e1ebfc;
    height: 100%;
    margin-right: 100px;

    &:focus{
        animation-name:  grow;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }
    &:not(focus){
        animation-name:  shrink;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }

    @keyframes grow{
        0%{
            padding: 0 1vw 0 1vw;
        }100%{
            padding: 1vh 2vw 1vh 2vw;
        }
    }

    @keyframes shrink{
        0%{
            padding: 0 2vw 0 2vw;
        }100%{
            padding: 0 1vw 0 1vw;
        }
    };
`;

export const Data = Styled.input`
`;

export const buttonFooter = Styled.div`
height: 300px;
width: 1280px;
display: grid;      
justify-content: right;
align-items: center;
overflow: hidden;
display: grid;
grid-template-columns: repeat(2,25%);
grid-template-rows: 1fr 100px 100px;
`;

//Richard
export const CB = Styled.div`

height: 300px;
width: 1280px;
display: grid;      
justify-content: center;
align-items: center;
overflow: hidden;
display: grid;
grid-template-columns: repeat(4,17%);
grid-template-rows: 1fr 100px 100px 100px 100px;
border-bottom: 1px solid #cecece;
margin-bottom: 10px;
`;

//Richard
export const Rot = Styled.label`
    font-size: 20px;
    color: #888;
    font-weight: bold;
    justify-content: right;
    text-align: right;
    align-items: right;
    margin:20px 0 10px 20px;
`;

//Richard
export const Tit = Styled.div`
    padding-top: 10px;
    margin-right: 80%;
    background-color: none;

    label{
        margin-left: 10px;
        font-weight: bold;
        font-size: 16px;
        color: #555;
    }
`;

//Richard
export const Combox = Styled.div`

height: 250px;
width: 950px;
display: grid;      
justify-content: center;
align-items: center;
overflow: hidden;
display: grid;
grid-template-columns: repeat(20,5%);
grid-template-rows: 1fr 100px 100px 100px 100px;
border-bottom: 1px solid #cecece;
margin-bottom: 10px;
`;

export const BoxTitle = Styled.div`
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 1rem;
    width: 100%;
    height: 35vh;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h3{
        font-size: 3rem;
    }
`;
