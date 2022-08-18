import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../../services/api";

import Settings from "@material-ui/icons/Settings";
import ThreeSixty from "@material-ui/icons/ThreeSixty";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import Bebidas from "./_Configuracao";
import Dialog from "../../../components/materialComponents/Dialog";
import Selecao from "../../../components/materialComponents/Select";
import OpenSelect from "./_AddBebida";
import Button from "../../../components/materialComponents/Button";
import Modal from "../../../components/modal";
import { Rotulo } from "../../../components/commom_in";
import PadraoMod from "./_Padrao";

import {
  ChangePagamento,
  ChangeValidador,
  LoadAtivos,
  LoadConfigPadrao,
  ChangeMaquina,
  ChangeValidadorFichas,
  clearConfig,
} from "../../../global/actions/SolicitacaoAction";

import { InstrucoesCartaoModal } from './_ModalInstrucoesCartao'

const Requisicao = (props) => {
  const [modalInstrucaoCartao, setModalInstrucaoCartao] = useState(false)

  const {
    Pagamento,
    Maquina,
    Configuracao,
    Capacidade,
    MaxContenedores,
    Contenedor,
    TipoValidador,
    Validador,
  } = props.State;

  const Ativos = props.State.AtivosDisponiveis;
  const Padrao = props.State.ConfiguracoesPadrao;

  const {
    ChangePagamento,
    ChangeValidador,
    ChangeMaquina,
    ChangeValidadorFichas,
    LoadConfigPadrao,
    clearConfig,
  } = props;

  const chooseMaquina = (maq) => {
    if (maq === "") {
      ChangeMaquina("");
    } else {
      Ativos.map((ativo) => {
        if (ativo.MaqModelo === maq) {
          ChangeMaquina(ativo);
          api.get(`/equip/requests/default/${ativo.MaqModId}`).then((response) => {
            LoadConfigPadrao(response.data);
          });
        }
        return null;
      });
    }
  };

  const handleChangeSistemaDePagamento = (value) => {
    if (value === 'Cartão' || value === 'Cartão e Validador') {
      setModalInstrucaoCartao(true)
    }

    ChangePagamento(value)
  }

  return (
    <div className="YAlign">
      <InstrucoesCartaoModal 
        open={modalInstrucaoCartao}
        onClose={() => setModalInstrucaoCartao(false)}
        title='Sistema de Pagamento C/ Cartão'
      />
      <div
        style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        className="XAlign"
      >
        <Selecao
          width="200px"
          MLeft="8px"
          MBottom="8px"
          // condicao="*Limpe a configuração para alterar"
          label="Máquina"
          value={Maquina}
          disabled={Configuracao.length > 0 ? true : false}
          onChange={(e) => chooseMaquina(e.target.value)}
        >
          {Ativos.map((maquina) => (
            <MenuItem value={maquina.MaqModelo}>{maquina.MaqModelo}</MenuItem>
          ))}
        </Selecao>

        <Selecao
          width="200px"
          MLeft="8px"
          MBottom="8px"
          // condicao="*Limpe a configuração para alterar"
          label="Pagamento"
          value={Pagamento}
          disabled={Configuracao.length > 0 ? true : false}
          onChange={(e) => handleChangeSistemaDePagamento(e.target.value)}
        >
          <MenuItem value="Sem Pagamento">Sem Pagamento</MenuItem>
          <MenuItem value="Cartão">Cartão</MenuItem>
          <MenuItem value="Validador">Validador</MenuItem>
          <MenuItem value="Cartão e Validador">Cartão e Validador</MenuItem>
        </Selecao>

        <div>
          <Modal
            header="Detalhes do Validador"
            trigger={
              <Button
                style={{ marginLeft: "8px", marginBottom: "8px", height: "54px" }}
                icon={<Settings />}
                disabled={!shouldShowValidador(Pagamento, Configuracao)}
              >
                Validador
              </Button>
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <FormControl component="fieldset">
                <RadioGroup
                  value={TipoValidador}
                  onChange={(e) => {
                    ChangeValidador(e.target.value);
                  }}
                >
                  <FormControlLabel
                    value="Moeda"
                    control={<Radio />}
                    label="Moeda"
                  />
                  <FormControlLabel
                    value="Ficha"
                    control={<Radio />}
                    label="Ficha"
                  />
                  <FormControlLabel
                    value="Moeda e Ficha"
                    control={<Radio />}
                    label="Moeda e Ficha"
                  />
                </RadioGroup>
              </FormControl>

              <div className="YAlign">
                {returnValidadorOption(
                  TipoValidador,
                  Validador,
                  ChangeValidadorFichas
                )}
              </div>
            </div>
          </Modal>
        </div>

        <PadraoMod
          disabled={!shouldShowInfo(Pagamento, Maquina)}
          Padrao={Padrao}
        />
        <OpenSelect
          disabled={
            !shouldShowAddBebida(Pagamento, Maquina, Configuracao, Capacidade)
          }
        />
        <Button
          style={{ margin: "0px 0px 8px 8px", height: "54px" }}
          onClick={() => clearConfig()}
          icon={<ThreeSixty />}
          disabled={Configuracao.length > 0 ? false : true}
        >
          Limpar config.
        </Button>
        <div
          className="YAlign"
          style={{
            margin: "0px 0px 8px 8px",
            height: "54px",
            justifyContent: "center",
            flex: "unset",
          }}
        >
          <p style={{ margin: "0px" }}>
            {Configuracao.length}/<strong>{Capacidade}</strong> Bebidas
            adicionadas
          </p>
          <p style={{ margin: "0px" }}>
            {Contenedor.length}/<strong>{MaxContenedores}</strong> Contenedores em
            uso
          </p>
        </div>

        <div style={{ margin: "0px 0px 8px 8px" }}>
          <Dialog botao="Contenedores" title="Contenedores em uso">
            {Contenedor.map((cont) => (
              <p>{defineContenedor(cont)}</p>
            ))}
          </Dialog>
        </div>
      </div>
      {Configuracao.length > 0 ? (
        <div style={{
          height: 400,
          width: "100%",
          overflowX: "hidden"
        }}>
          <Bebidas />
        </div>
      ) : null}
    </div>
  );
}

const mapStateToProps = (store) => ({
  State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ChangePagamento,
      ChangeValidador,
      LoadAtivos,
      ChangeMaquina,
      LoadConfigPadrao,
      ChangeValidadorFichas,
      clearConfig,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Requisicao);

const defineContenedor = (cont) => {
  switch (cont) {
    case 1:
      return "Café";
    case 2:
      return "Leite";
    case 3:
      return "Cappuccino";
    case 4:
      return "Café c/ Leite";
    case 5:
      return "Achocolatado";
    case 6:
      return "Chá de Limão";
    default:
      return "Desconhecido";
  }
};

const opcoesValidador = [
  ["F1", "F2", "F3", "F4", "F5"], //Fichas
  ["0.05", "0.10", "0.25", "0.50", "1.00"], //Moedas
  ["0.05", "0.10", "0.25", "0.50", "1.00", "F1", "F2", "F3", "F4", "F5"], //Moeda e Ficha
];

const shouldShowAddBebida = (Pagamento, Maquina, Configuracao, Capacidade) => {
  if (Pagamento !== "" && Maquina !== "" && Configuracao.length < Capacidade) {
    return true;
  }
};

const shouldShowInfo = (Pagamento, Maquina) => {
  if (Pagamento !== "" && Maquina !== "") {
    return true;
  }
};

const shouldBeChecked = (item, Validador) => {
  if (Validador.indexOf(item) < 0) {
    return false;
  } else {
    return true;
  }
};

const shouldShowValidador = (Pagamento, Configuracao) => {
  if (
    (Pagamento === "Validador" || Pagamento === "Cartão e Validador") &&
    Configuracao.length < 1
  ) {
    return true;
  } else {
    return false;
  }
};

const returnValidadorOption = (tipo, Validador, ChangeValidadorFichas) => {
  switch (tipo) {
    case "Ficha":
      return opcoesValidador[0].map((item) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
          }}
        >
          <FormControlLabel
            key={item}
            checked={shouldBeChecked(item, Validador)}
            onChange={(e) => {
              ChangeValidadorFichas(e.target.value);
            }}
            value={item}
            control={<Radio />}
            label={item.replace("F", "")}
          />
        </div>
      ));
    case "Moeda":
      return opcoesValidador[1].map((item) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
            marginTop: "8px",
          }}
        >
          <input
            checked={shouldBeChecked(item, Validador)}
            type="checkbox"
            value={item}
            onChange={(e) => {
              ChangeValidadorFichas(e.target.value);
            }}
          />
          <Rotulo style={{ margin: "0px" }}>R$ {item}</Rotulo>
        </div>
      ));
    case "Moeda e Ficha":
      return opcoesValidador[2].map((item) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
          }}
        >
          {!isNaN(Number(item.charAt(0))) ? (
            <div style={{ marginTop: "8px" }}>
              <input
                type="checkbox"
                value={item}
                checked={shouldBeChecked(item, Validador)}
                onChange={(e) => {
                  ChangeValidadorFichas(e.target.value);
                }}
                key={item}
              />
              <Rotulo style={{ margin: "0px" }}>R$ {item}</Rotulo>
            </div>
          ) : (
            <FormControlLabel
              key={item}
              checked={shouldBeChecked(item, Validador)}
              onChange={(e) => {
                ChangeValidadorFichas(e.target.value);
              }}
              value={item}
              control={<Radio />}
              label={item.replace("F", "")}
            />
          )}
        </div>
      ));
    default:
      return null;
  }
};
