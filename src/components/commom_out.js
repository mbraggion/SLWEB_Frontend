import Styled from 'styled-components'

import background from '../assets/background/login_fig.png'

export const Container = Styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100vh;
    justify-content: flex-end;
    align-items: flex-end;
    
    background-image: url(${background});
    background-repeat: no-repeat ;
    background-size: 100vh; 
    background-position: left;
    object-fit: cover;
`

export const Box = Styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #FFFFFF;
    
    min-width: 280px;
    width: 25vw;
    max-width: 300px;
    max-height: 400px;

    border-radius: 10px;
    
    margin-right: 15vw;
    margin-bottom: calc(25vh - 40px);

    animation-name: fadein;
    animation-duration: 700ms;
    animation-fill-mode: forwards;

    @keyframes fadein{
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }    
`
export const Logo = Styled.img`
    height: 30%;
    width: unset;
`
