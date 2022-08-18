import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

import { Panel } from "../../components/commom_in";
import { maskCNPJ, maskCEP } from "../../misc/commom_functions";
import { Toast } from "../../components/toasty";
import Loading from "../../components/loading_screen";
import { makeStyles } from "@material-ui/core/styles";

import InputNumber from "../../components/materialComponents/inputMoney";
import Dialog from "../../components/materialComponents/Dialog";
import Select from "../../components/materialComponents/Select";
import InputUnderline from "../../components/materialComponents/InputUnderline";
import Button from "../../components/materialComponents/Button";
import { Create as CreateIcon } from '@material-ui/icons';

import AnnonProfileIcon from '../../assets/annon_profile_icon.png'
import { Settings, VpnKey, Check } from "@material-ui/icons/";
import {
  MenuItem,
  Divider
} from "@material-ui/core/";

import { RED_SECONDARY, GREY_LIGHT } from "../../misc/colors";
import { toValidString } from '../../misc/commom_functions'

function Perfil() {
  const classes = useStyles();
  const [info, setInfo] = useState({});
  const [vencCert, setVencCert] = useState(null);
  const [password, setPassword] = useState({});
  const [newEmail, setNewEmail] = useState(null);
  const [newTaxa, setNewTaxa] = useState({ tipo: "", valor: 0, });
  const [loaded, setLoaded] = useState(false);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get("/profile");

        setInfo(response.data.Franqueado);
        setVencCert(response.data.VencCert)
        setNewTaxa({
          tipo: response.data.Franqueado.ParamTxt,
          valor: response.data.Franqueado.ParamVlr * 100,
        });
        setLoaded(true);
      } catch (err) { }
    }
    loadData();
  }, []);

  const handleChangePassword = async () => {
    setWait(true);
    let toastId = null;

    try {
      toastId = Toast("Aguarde...", "wait");

      await api.put("/profile/password", {
        token: sessionStorage.getItem("token"),
        password: password,
      });

      Toast("Senha atualizada com sucesso!", "update", toastId, "success");
      setWait(false);
      setPassword({
        atual: "",
        nova: "",
        confirmacao: "",
      });
    } catch (err) { }
  };

  const handleChangeEmail = async () => {
    if (
      newEmail === "" ||
      newEmail === null ||
      typeof newEmail == "undefined"
    ) {
      Toast("Preencha um email valido", "warn");
      return;
    }

    setWait(true);
    let toastId = null;

    try {
      toastId = Toast("Aguarde...", "wait");
      await api.put("/profile/email", {
        email: newEmail,
      });

      Toast("Email atualizado com sucesso!", "update", toastId, "success");
      setWait(false);
      setInfo({ ...info, Email: newEmail });
    } catch (err) {
      setWait(false);
    }
  };

  const handleChangeTax = async () => {
    if (newTaxa.valor === "" || newTaxa.valor === null) {
      Toast("Preencha algum valor para a taxa", "warn");
      return;
    }

    let toastId = null;

    try {
      toastId = Toast("Aguarde...", "wait");
      await api.put("/profile/tax", {
        token: sessionStorage.getItem("token"),
        newTax: newTaxa,
      });

      Toast("Taxa atualizada!", "update", toastId, "success");
    } catch (err) { }
  };

  return !loaded ? (
    <Loading />
  ) : (
    <Panel>
      <div className={classes.left}>
        <div className={classes.PerfilBase}>
          <div className={classes.Avatar}>
            <img
              src={AnnonProfileIcon}
              alt="logo"
            />
            <p disabled>{toValidString(info.M0_FILIAL[0])}</p>
          </div>

          {/*DADOS FRANQUIA */}
          <div className={classes.Dados}>
            <p className={classes.title}>Razão Social: {info.M0_FILIAL[0]}</p>
            <p className={classes.title}>
              CNPJ: {maskCNPJ(info.M0_CGC[0])} || IE: {info.M0_INSC}
            </p>

            <div className={classes.information}>
              <div className={classes.infoContainer}>
                <h5 className={classes.titleBox}>FILIAL</h5>
                <p className={classes.Relevant}>
                  {toValidString(info.M0_CODFIL[0])}
                </p>
              </div>

              <div className={classes.infoContainer}>
                <h5 className={classes.titleBox}>
                  CERTIFICADO DIGITAL VÁLIDO ATÉ
                </h5>
                <p className={classes.Relevant}>
                  {vencCert === null ? '------' : vencCert}
                </p>
              </div>

              <div className={classes.infoContainer}>
                <h5 className={classes.titleBox}>
                  CONTRATO DE FRANQUIA VÁLIDO ATÉ
                </h5>
                <p className={classes.Relevant}>
                  ------
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className={classes.PerfilBase}>
          <div className={classes.perfilInfo}>
            <div className={classes.infoContactL}>
              <h5>Informações de contato</h5>

              <p>
                <b>CNPJ: </b>
                {maskCNPJ(info.M0_CGC[0])}
              </p>
              <p>
                <b>Inscrição estadual:</b>
                {info.M0_INSC}
              </p>
              <p>
                <b>Email: </b> {toValidString(info.Email)}
              </p>

              <p>
                <b>Endereço:</b> {info.M0_ENDCOB}, {info.M0_BAIRCOB} -{" "}
                {info.M0_CIDCOB}/{info.M0_ESTCOB} - CEP:{" "}
                {maskCEP(info.M0_CEPCOB)}
              </p>
            </div>

            <div className={classes.infoContactR}>
              <Dialog
                title="Alterar Senha"
                botao="Alterar Senha"
                icone={<VpnKey />}
                action={
                  <Button className={classes.buttons}
                    style={{
                      backgroundColor: wait ? GREY_LIGHT : RED_SECONDARY,
                      color: "#FFFFFF",
                    }}
                    icon={<Check />}
                    disabled={wait}
                    onClick={() => handleChangePassword()}
                  >
                    Salvar
                  </Button>
                }
              >

                <InputUnderline
                  value={password.atual}
                  type="password"
                  label="Senha atual"
                  onChange={(e) => setPassword({ ...password, atual: e })}
                />

                <InputUnderline
                  value={password.nova}
                  type="password"
                  label="Nova senha"
                  onChange={(e) => setPassword({ ...password, nova: e })}
                />

                <InputUnderline
                  value={password.confirmacao}
                  type="password"
                  label="Confirmar nova senha"
                  onChange={(e) => setPassword({ ...password, confirmacao: e })}
                />
              </Dialog>

              {/* editar email*/}

              <Dialog
                title="Alterar Email Principal"
                botao="Alterar Email"
                icone={<Settings />}
                action={
                  <Button className={classes.buttons}
                    style={{
                      backgroundColor: wait ? GREY_LIGHT : RED_SECONDARY,
                      color: "#FFFFFF",
                    }}
                    icon={<Check />}
                    disabled={wait}
                    onClick={() => handleChangeEmail()}
                  >
                    Salvar
                  </Button>
                }
              >
                <InputUnderline
                  value={newEmail}
                  disabled={wait}
                  type="text"
                  label={`Atual: ${toValidString(info.Email)}`.split(';')[0].concat('...')}
                  onChange={(e) => setNewEmail(e)}
                />
              </Dialog>

              {/* Editar taxa */}
              <Dialog
                title="Alterar Taxa"
                botao="Alterar taxa"
                icone={<CreateIcon />}
                action={
                  <Button className={classes.buttons}
                    style={{
                      backgroundColor: wait ? GREY_LIGHT : RED_SECONDARY,
                      color: "#FFFFFF",
                    }}
                    icon={<Check />}
                    disabled={wait}
                    onClick={() => handleChangeTax()}
                  >
                    Salvar
                  </Button>
                }
              >
                <div>
                  <Select
                    label="Tipo"
                    value={newTaxa.tipo}
                    onChange={(e) => {
                      setNewTaxa({ tipo: e.target.value, valor: 0 });
                      const i = document.querySelectorAll("input");

                      i[0].value = "";
                    }}
                  >
                    <MenuItem value="PERCENTUAL">Percentual</MenuItem>
                    <MenuItem value="VALOR FIXO">Valor fixo</MenuItem>
                  </Select>

                  <InputNumber
                    style={{
                      marginTop: '8px',
                      maxWidth: '130px',
                    }}
                    decimais={newTaxa.tipo === "PERCENTUAL" ? 0 : 2}
                    onChange={(e) => setNewTaxa({ ...newTaxa, valor: e.target.value })}
                    label={newTaxa.tipo === "PERCENTUAL" ? "Porcentagem(%)" : "Valor(R$)"}
                    disabled={false}
                    value={newTaxa.valor}
                  />
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default Perfil;

const useStyles = makeStyles((theme) => ({
  left: {
    alignItems: "left",
    overflowY: "auto",
  },
  PerfilBase: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",

    "@media (max-width:768px)": {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  Avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    paddingTop: '8px',

    "@media (max-width:768px)": {

    },

    "& p": {
      width: "15rem",
      fontSize: "1rem",
      fontWeight: "bold",
    },

    "& img": {
      width: "15rem",
      height: "15rem",
      borderRadius: "50%",
      border: "7px solid #fff",
      boxShadow: "0px 0px 10px #888888",
      marginRight: "2rem",

      "@media (max-width:768px)": {
        marginRight: "0rem",
      },
    },
  },
  information: {
    display: "flex",

    "@media (max-width:768px)": {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #0000001f",
    boxShadow: "0px 0px 5px #888888",
    borderRadius: "5px",
    color: "#0e0e0e",
    backgroundColor: "#fff",
    padding: "10px 20px",
    justifyContent: "center",
    alignItems: "center",
    margin: "10px 8px",
    width: "15rem",
    maxwidth: "15rem",
    maxHeight: "10rem",
    cursor: "default",

    "&:hover": {
      transition: "200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: "scale(1.05)",
    },

    "&:not(hover)": {
      transition: "200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: "scale(1)",
    },
  },
  perfilInfo: {
    display: "flex",
    width: "100%",

    "@media (max-width:768px)": {
      flexDirection: "column",
      width: "100%",
      maxWidth: "100%",
    },
  },
  infoContactL: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "45vw",
    maxWidth: "45vw",
    alignItems: "left",

    "& p": {
      fontSize: "1rem",
      margin: ".75rem 0",
    },

    "@media (max-width:768px)": {
      flexDirection: "column",
      width: "100%",
      maxWidth: "100%",
      paddingLeft: "8px"
    },
  },
  infoContactR: {
    display: "flex",
    flexDirection: "column",
    width: "45vw",
    maxWidth: "45vw",
    alignItems: "flex-end",

    "& button": {
      marginTop: ".5rem",
      maxWidth: "15rem",
      width: "15rem",
      height: "5rem",
    },

    "@media (max-width:768px)": {
      flexDirection: "column",
      width: "100%",
      maxWidth: "100%",
      paddingBottom: "8px",
      alignItems: "flex-start",
      paddingLeft: "8px",

      "& button": {
        marginTop: ".5rem",
        width: "95vw",
        maxWidth: "100%",

      },
    },
  },
  titleBox: {
    textAlign: "center",
    fontSize: "1rem",
    color: "#888888",
  },
  Relevant: {
    fontWeight: "bolder",
    fontSize: "1.5rem",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.1rem",
  },

  riskin: {
    width: "100%",
    height: "1px",
    backgroundColor: "#000000",
  },
}));
