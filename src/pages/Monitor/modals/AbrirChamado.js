import React from "react";
import moment from "moment";
import Draggable from "react-draggable";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography
} from '@material-ui/core';
import TextField from '../../../components/materialComponents/InputUnderline'
import InputPhone from '../../../components/materialComponents/inputPhoneNumber'
import { RED_PRIMARY } from '../../../misc/colors'

export const AbrirChamadoModal = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {props.title}
      </DialogTitle>

      <DialogContent>
        <div className="YAlign">
          {props.UltChamado !== null ?
            <Typography
              style={{
                width: '100%',
                textAlign: 'right'
              }}
              variant="subtitle1"
              gutterBottom
            >
              <strong>Último chamado aberto em {moment(props.UltChamado).format('DD/MM/YYYY')}</strong>
            </Typography>
            : null
          }
          <Typography
            style={{ color: RED_PRIMARY }}
            variant="subtitle1"
            gutterBottom
          >
            Contato
          </Typography>
          <div
            className="XAlign"
            style={{ width: "100%", justifyContent: "space-between", borderBottom: '1px dashed #CCC', marginBottom: '8px', paddingBottom: '8px' }}
          >
            <TextField
              style={{ margin: "0px 8px 8px 0px" }}
              value={props.Details.Email}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Email: value }
              })}
            />
            <InputPhone
              onChange={
                (e) => props.onChangeDetails((oldState) => {
                  return { ...oldState, Telefone: e.target.value }
                })
              }
              value={props.Details.Telefone}
              style={{ margin: "0px 0px 8px 0px" }}
              label="Telefone"
            />
          </div>
          <Typography
            style={{ color: RED_PRIMARY }}
            variant="subtitle1"
            gutterBottom
          >
            Endereço da máquina
          </Typography>
          <div
            className="XAlign"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <TextField
              style={{
                margin: "0px 0px 8px 0px",
                width: "100%"
              }}
              value={props.Details.Endereco.Logradouro}
              id="outlined-basic"
              label="Logradouro"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, Logradouro: value } }
              })}
            />
          </div>

          <div
            className="XAlign"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <TextField
              style={{ margin: "0px 8px 8px 0px" }}
              value={props.Details.Endereco.Numero}
              id="outlined-basic"
              label="Numero"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, Numero: value } }
              })}
            />
            <TextField
              style={{ margin: "0px 0px 8px 0px" }}
              value={props.Details.Endereco.Bairro}
              id="outlined-basic"
              label="Bairro"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, Bairro: value } }
              })}
            />

          </div>

          <div
            className="XAlign"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <TextField
              style={{ margin: "0px 8px 8px 0px" }}
              value={props.Details.Endereco.Complemento}
              id="outlined-basic"
              label="Complemento"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, Complemento: value } }
              })}
            />
            <TextField
              style={{ margin: "0px 0px 8px 0px" }}
              value={props.Details.Endereco.Cidade}
              id="outlined-basic"
              label="Cidade"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, Cidade: value } }
              })}
            />

          </div>

          <div
            className="XAlign"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <TextField
              style={{ margin: "0px 8px 8px 0px" }}
              value={props.Details.Endereco.UF}
              id="outlined-basic"
              label="UF"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, UF: value } }
              })}
            />
            <TextField
              style={{ margin: "0px 0px 8px 0px" }}
              value={props.Details.Endereco.CEP}
              id="outlined-basic"
              label="CEP"
              variant="outlined"
              onChange={(value) => props.onChangeDetails((oldState) => {
                return { ...oldState, Endereco: { ...oldState.Endereco, CEP: value } }
              })}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px' }}>
        {props.action}
        <Button
          onClick={props.onClose}
          color="secondary"
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function PaperComponent(props) {
  return (
    <Draggable
      {...props}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
