import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

import { Typography } from "@material-ui/core";
import { Input as InputIcon, TagFaces } from "@material-ui/icons";
import Image from "../../assets/logo_sl.png";
import { Box, Container, Logo } from "../../components/commom_out";
import Button from "../../components/materialComponents/Button";
import Input from "../../components/materialComponents/InputUnderline";
import { Toast } from "../../components/toasty";
import { GREY_PRIMARY, RED_PRIMARY } from "../../misc/colors";
import { navigateTo } from "../../misc/commom_functions";

export default function LoginADM() {
  const [adm_code, setAdmCode] = useState(null);

  const [adm_password, setAdmPassword] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [available, setAvailable] = useState(true)


  const handleLogin = async (e) => {
    e.preventDefault()

    if (
      (adm_code === null || adm_code.trim() === '')
      ||
      (adm_password === null || adm_password.trim() === '')
    ) {
      Toast('Código ou Senha não informados', 'warn')
      return
    }

    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      setFetching(true)

      const response = await api.post("/admAuth/partial", {
        admin_code: adm_code,
        admin_password: adm_password,
      });

      Toast('Conectado!', 'update', toastId, 'success')

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("filial_logada", response.data.nome !== '');
      sessionStorage.setItem("usuário", response.data.nome);
      sessionStorage.setItem("links", JSON.stringify(response.data.Links));

      navigateTo('move', "/")
    } catch (err) {
      setFetching(false)
      Toast('Código ou senha incorretos', 'update', toastId, 'error')
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    checkIfSiteIsAvailable()
  }, []);

  const checkIfSiteIsAvailable = async () => {
    try {
      await api.get("/");

      setAvailable(true)
    } catch (err) {
      setAvailable(false)
    }
  }

  return (
    <Container style={{ backgroundColor: GREY_PRIMARY }}>

      <Box onSubmit={(e) => handleLogin(e)}>

        <Logo src={Image} alt="Pilão professional" />

        <Input
          onChange={(e) => {
            setAdmCode(e);
          }}
          label="Código ADM"
        />

        <Input
          type="password"
          onChange={(e) => {
            setAdmPassword(e);
          }}
          label="Senha ADM"
          style={{
            marginBottom: "8px",
          }}
        />

        {!available
          ? (
            <Typography variant="caption">O SLWEB está indisponivel no momento.</Typography>
          )
          : (
            <Button
              style={{
                minWidth: "60%",
                marginBottom: "8px",
                backgroundColor: RED_PRIMARY,
                color: '#FFFFFF'
              }}
              disabled={fetching}
              icon={<InputIcon />}
              onClick={(e) => handleLogin(e)}
            >
              Acessar
            </Button>
          )}


      </Box>
      <Link to="/">
        <Button icon={<TagFaces />}>Franqueados</Button>
      </Link>
    </Container>
  );
}
