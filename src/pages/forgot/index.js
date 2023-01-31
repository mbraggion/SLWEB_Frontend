import React, { useState } from "react";
import { api } from "../../services/api";
import { Toast } from "../../components/toasty";
import { Link } from "react-router-dom";

import { Container, Box, Logo } from "../../components/commom_out";
import Image from "../../assets/Logo/logo_sl.png";
import Button from "../../components/materialComponents/Button";
import InputUnderline from "../../components/materialComponents/InputUnderline";
import { LockOutlined, ArrowBack, Work } from "@material-ui/icons";
import { RED_PRIMARY } from '../../misc/colors'
import { navigateTo } from '../../misc/commom_functions'

export default function Forgot() {
  const [user_code, setUser] = useState("");

  const handleReset = async () => {
    if (user_code === "") {
      Toast("Informe o código da sua filial", 'warn');
    } else {
      let toastId = null

      try {
        toastId = Toast('Aguarde...', 'wait')
        await api.post("/forgot", {
          user_code: user_code,
        });

        Toast('Sua senha foi enviada para o seu e-mail!', 'update', toastId, 'success')
        setTimeout(() => {
          navigateTo('move', '/')
        }, 3000);
      } catch (err) {
      }
    }
  };

  return (
    <Container style={{ backgroundColor: RED_PRIMARY }}>
      <Box>
        <Logo src={Image} alt="SLAPLIC WEB" />
        <InputUnderline
          label="Código de acesso"
          onChange={(e) => {
            setUser(e);
          }}
        />

        <Button
          style={{ minWidth: "60%", marginBottom: "8px", backgroundColor: RED_PRIMARY, color: '#FFFFFF' }}
          icon={<LockOutlined />}
          onClick={() => {
            handleReset();
          }}
        >
          Recuperar senha
        </Button>

        <Link to="/">
          <Button
            style={{ minWidth: "60%", marginBottom: "8px", backgroundColor: '#FFFFFF', boxShadow: 'none' }}
            icon={<ArrowBack />}
          >
            Voltar
          </Button>
        </Link>
      </Box>
      <Link to="/PILAO">
        <Button
          icon={<Work />}
        >
          Colaboradores
        </Button>
      </Link>
    </Container>
  );
}
