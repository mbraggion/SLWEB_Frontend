import React, { useEffect } from "react";

import { Typography } from "@material-ui/core";
import Image from "../../assets/Logo/logo_sl.png";
import { Box, Container, Logo } from "../../components/commom_out";
import { Toast } from '../../components/toasty';
import { RED_PRIMARY } from '../../misc/colors';

function Login() {
  useEffect(() => {
    sessionStorage.clear()
    redirect()
  }, []);

  const redirect = () => {
    Toast('Redirecionando...', 'wait')

    setTimeout(() => {
      window.location.replace('https://slweb.slaplic.com.br/')
    }, 5000)
  }

  return (
    <Container style={{ backgroundColor: RED_PRIMARY }}>
      <Box onSubmit={() => {}}>
        <Logo src={Image} alt="Pilão professional" />
        <Typography
          variant='body1'
          style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            margin: '2rem 0 4rem 0'
          }}
        >
          O SLWEB agora tem um novo endereço!
        </Typography>

        <Typography 
        variant='subtitle2'
        style={{
          fontWeight: '100',
          textAlign: 'center'
        }}
        >
          Voce será redirecionado em instantes, ou pode clicar <a href='https://slweb.slaplic.com.br/'>aqui</a> para avançar para o novo endereço.
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
