import React, { useState } from "react";

import { Button as ButtonMaterial, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

import { Block, Button, Container, Text, Title } from "./styles";

const CodeView = ({ email, fetching, onEmailChange, onCodeRequest, onCodeInsertion }) => {
  const [openM1, setOpenM1] = useState(false);
  const [openM2, setOpenM2] = useState(false);

  const handleClickOpen = () => {
    setOpenM1(true);
  };

  const handleClose = () => {
    setOpenM1(false);
  };

  const handleClickOpen2 = (e) => {
    setOpenM2(true);
    e.persist();
    onCodeInsertion(e.target.value, e);
  };

  const handleClose2 = () => {
    setOpenM2(false);
  };

  return (
    <Container>

      {/* TEXTO DA ESQUERDA*/}
      <Block bgColor="#C8102E">
        <Title>
          Questionário de análise de perfil
          <br />
          <strong>Pilão Professional</strong>
        </Title>
        <Text>
          As informações do questionário serão utilizadas para conhecermos suas
          expectativas com a franquia, para garantirmos que estamos juntos com o
          mesmo objetivo de crescer e ter sucesso em nossa franquia.
        </Text>
      </Block>

      {/* TEXTO DA DIREITA */}
      <Block>
        <Text color="#41211f">
          Para ter acesso ao formulário, clique em uma das opções abaixo:
        </Text>

        <Dialog open={openM1} onClose={handleClose}>
          <DialogTitle>Solicitar senha de acesso</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Digite seu melhor email para receber a senha de acesso para
              preenchimento do questionário.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Digite aqui seu melhor email"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <ButtonMaterial 
            disabled={fetching}
            onClick={(e) => onCodeRequest(e)}>Solicitar</ButtonMaterial>
          </DialogActions>
        </Dialog>
        <Button
          bgColor="#66bb6a"
          hover="#316E34"
          border="none"
          color="#fff"
          onClick={handleClickOpen}
        >
          {" "}
          Solicitar senha de acesso
        </Button>

        <Dialog open={openM2} onClose={handleClose2}>
          <DialogTitle>Já possuo a senha</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Digite aqui a senha de acesso para preencher o questionário.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Senha de acesso"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => onCodeInsertion(e.target.value, e)}
            />
          </DialogContent>
        </Dialog>
        <Button
          bgColor="none"
          border="3px solid #41211f"
          color="#41211f"
          hover="#41211f"
          colorH="#fff"
          onClick={handleClickOpen2}
        >
          {" "}
          Já possuo uma senha de acesso
        </Button>
      </Block>

    </Container>
  );
};

export default CodeView;
