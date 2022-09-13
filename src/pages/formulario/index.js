import React, { useState } from "react";
import Loading from "../../components/loading_screen";

//Meio de comunicação
import { api } from "../../services/api";

import { Toast } from "../../components/toasty";

// import Stepper from './stepper'
import CodeView from "./codeInsertView";
import { HelperModal } from "./modals/helperModal";
import Intro from "./modals/Intro";

import { Form } from "./Form";
import { HelperButton } from "./helperButton";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { FormContainer } from "./styles";

export const Formulario = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [codCandidato, setCodCandidato] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [validado, setValidado] = useState(false);
  const [formSection, setFormSection] = useState(0);
  const [form, setForm] = useState(null);
  const [wait, setWait] = useState(false);
  const [helperModalOpen, setHelperModalOpen] = useState(false);

  const handleInsereCodigo = async (codigo, event) => {
    if (!Number.isSafeInteger(Number(codigo))) {
      event.target.value = codigo.slice(0, codigo.length - 1);
      return;
    }

    if (codigo.length === 6) {
      setCodCandidato(codigo);
      setLoading(true);
    } else {
      setCodCandidato(null);
      return;
    }

    try {
      const response = await api.get(`/form/check/${codigo}`);
      setLoading(false);
      setValidado(true);
      setWait(false);
      setFormSection(response.data.SECAO);
      setForm(response.data.FORM);
    } catch (err) {
      Toast("Código inválido", "info");
      setLoading(false);
      setValidado(false);
      setWait(false);
      setCodCandidato(null);
    }
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleSolicitaCodigo = async () => {
    if (email.trim() === "" || email === null) {
      Toast("Informe um email", "warn");
      return;
    }

    let toastId = null;

    toastId = Toast("Aguarde...", "wait");

    setWait(true);
    try {
      await api.post("/form/solicitacao", {
        email: email,
        formType: "Avaliacao de Perfil de Franqueado",
      });

      setEmail("");
      setWait(false);

      Toast(
        "Um código foi enviado para o seu email!",
        "update",
        toastId,
        "success"
      );
    } catch (err) {
      Toast("Falha ao enviar email com código", "update", toastId, "error");
      setWait(false);
    }
  };

  const handleOpenHelperModal = () => {
    setHelperModalOpen(true);
  };

  const handleCloseHelperModal = () => {
    setHelperModalOpen(false);
  };

  const whichContentDisplay = () => {
    if (codCandidato === null) {
      return (
        <CodeView
          onCodeInsertion={(value, e) => handleInsereCodigo(value, e)}
          onCodeRequest={(e) => handleSolicitaCodigo(e)}
          onEmailChange={(e) => handleChangeEmail(e)}
          email={email}
          fetching={wait}
        />
      );
    } else if (loading) {
      return (
        <Loading
          type="spinningBubbles"
          color="#000000"
          height="3%"
          width="3%"
        />
      );
    } else if (validado) {
      return (
        <FormContainer fullscreen={fullScreen}>
          <Intro />
          {form !== null ? (
            <Form
              Form={form}
              onChangeForm={setForm}
              COD={codCandidato}
              lastFormSection={formSection}
            />
          ) : null}
        </FormContainer>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {whichContentDisplay()}

      <HelperModal
        open={helperModalOpen}
        onClose={handleCloseHelperModal}
        title="Ajuda com o Formulário"
      />

      <HelperButton
        helperModalOpen={helperModalOpen}
        handleOpenHelperModal={handleOpenHelperModal}
      />
    </>
  );
};

export default Formulario;
