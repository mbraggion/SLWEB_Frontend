import React, { useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

import Image from "../../assets/logo_sl.png";
import { Toast } from "../../components/toasty";
import { Container, Box, Logo } from "../../components/commom_out";
import Button from "../../components/materialComponents/Button";
import Input from "../../components/materialComponents/InputUnderline";
import { TagFaces, Input as InputIcon } from "@material-ui/icons";
import { GREY_PRIMARY, RED_PRIMARY } from "../../misc/colors";
import { navigateTo } from "../../misc/commom_functions";

export default function LoginADM() {
  const [adm_code, setAdmCode] = useState(null);

  const [adm_password, setAdmPassword] = useState(null);
  const [fetching, setFetching] = useState(false);


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
      </Box>
      <Link to="/">
        <Button icon={<TagFaces />}>Franqueados</Button>
      </Link>
    </Container>
  );
}
