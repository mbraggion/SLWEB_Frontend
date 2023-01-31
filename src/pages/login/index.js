import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

import { Typography } from "@material-ui/core/";
import { Input, LockOutlined, Work } from "@material-ui/icons/";
import Image from "../../assets/Logo/logo_sl.png";
import {
  Box, Container, Logo
} from "../../components/commom_out";
import Button from "../../components/materialComponents/Button";
import InputUnderline from "../../components/materialComponents/InputUnderline";
import { Toast } from "../../components/toasty";
import { RED_PRIMARY } from '../../misc/colors';
import { navigateTo } from '../../misc/commom_functions';

function Login() {
  const [user_code, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    checkIfSiteIsAvailable()
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    if (
      (user_code.trim() === "" || user_code === null)
      ||
      (password.trim() === "" || password === null)
    ) {
      Toast('Filial ou Senha não informados', 'warn')
      return
    }

    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      setFetching(true)

      const response = await api.post("/auth/", {
        user_code: user_code,
        password: password,
      });

      Toast('Conectado!', 'update', toastId, 'success')

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("filial_logada", response.data.nome !== '');
      sessionStorage.setItem("usuário", response.data.nome);
      sessionStorage.setItem("links", JSON.stringify(response.data.Links));

      navigateTo('move', '/')
    } catch (err) {
      Toast('Filial ou senha incorretos', 'update', toastId, 'error')
      setFetching(false)
    }
  };

  const checkIfSiteIsAvailable = async () => {
    try {
      await api.get("/");

      setAvailable(true)
    } catch (err) {
      setAvailable(false)
    }
  }

  return (
    <Container style={{ backgroundColor: RED_PRIMARY }}>
      <Box onSubmit={(e) => handleLogin(e)}>
        <Logo src={Image} alt="Pilão professional" />
        <InputUnderline
          disabled={fetching || !available}
          label="Filial"
          onChange={(e) => {
            e = e.toUpperCase();
            setUser(e);
          }}
        />
        <InputUnderline
          disabled={fetching || !available}
          type="password"
          label="Senha"
          onChange={(e) => {
            setPassword(e);
          }}
          style={{
            marginBottom: "8px",
          }}
        />
        {!available
          ? (
            <Typography variant="caption">O SLWEB está indisponivel no momento.</Typography>
          )
          : (
            <>
              <Button
                style={{
                  minWidth: "60%",
                  marginBottom: "8px",
                  backgroundColor: RED_PRIMARY,
                  color: '#FFFFFF'
                }}
                disabled={fetching || !available}
                icon={<Input />}
                onClick={(e) => handleLogin(e)}
              >
                Acessar
              </Button>
              <Link to="/forgot">
                <Button
                  style={{ minWidth: "60%", marginBottom: "8px", backgroundColor: '#FFFFFF', boxShadow: 'none' }}
                  icon={<LockOutlined />}
                >
                  Recuperar senha
                </Button>
              </Link>
            </>
          )
        }

      </Box >
      <Link to="/PILAO">
        <Button icon={<Work />}>Colaboradores</Button>
      </Link>
    </Container >
  );
}

export default Login;
