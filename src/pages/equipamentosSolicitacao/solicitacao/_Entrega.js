import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { DatePicker } from "react-materialize";

import Selecao from "../../../components/materialComponents/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Rotulo, Campo } from "../../../components/commom_in";
import {
  ChooseCliente,
  ChangeEndereco,
  ChooseData,
  DefineContato,
  ChooseTelefone,
  ChooseEmail,
  DefineOBS,
} from "../../../global/actions/SolicitacaoAction";

function Entrega(props) {
  const classes = useStyles();
  const [Clientes, setClientes] = useState([]);

  const {
    ChooseCliente,
    ChangeEndereco,
    ChooseData,
    DefineContato,
    ChooseTelefone,
    DefineOBS,
  } = props;

  const {
    Cliente_Destino,
    Endereço_Entrega,
    CNPJ_Destino,
    Telefone_Contato,
    Observacao,
    Data_Entrega_Desejada,
    Contato,
    MinDDLEnvio,
    ClientesEnderecos
  } = props.State;

  const dataMinimaSolicitacao = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + MinDDLEnvio
  );

  useEffect(() => {
    setClientes(ClientesEnderecos);
  }, [ClientesEnderecos]);

  const defineCliente = (cliente) => {
    if (cliente === "") {
      ChooseCliente({
        Nome_Fantasia: '',
        CNPJss: '',
      });
      ChangeEndereco("");
    } else {
      Clientes.map((client) => {
        if (client.CNPJss === cliente) {
          ChooseCliente(client);
          ChangeEndereco(enderecoEntrega(client));
        }
        return null;
      });
    }
  };

  const mudarEndereco = (value) => {
    ChangeEndereco(value);
  };

  return (
    <>
      <Selecao
        width="200px"
        MLeft="8px"
        MBottom="8px"
        condicao="*Nenhum cliente encontrado"
        label="Cliente"
        value={CNPJ_Destino}
        disabled={shouldShowClientes(Clientes)}
        onChange={(e) => defineCliente(e.target.value)}
      >
        {Clientes.map((cliente) => (
          <MenuItem value={cliente.CNPJss}>
            {cliente.Nome_Fantasia}, CNPJ: {cliente.CNPJss}
          </MenuItem>
        ))}
      </Selecao>

      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            style={{ width: "400px" }}
            id="outlined-multiline-flexible"
            label="Endereço de entrega"
            helperText={Cliente_Destino === "" ? "*Selecione um cliente" : null}
            multiline
            rowsMax={4}
            disabled={Cliente_Destino === "" ? true : false}
            value={Endereço_Entrega}
            onChange={(e) => mudarEndereco(e.target.value)}
            variant="outlined"
          />
        </div>
      </form>

      <div className="XAlign" style={{ justifyContent: "flex-start" }}>
        <Campo>
          <Rotulo>Data mínima possivel({MinDDLEnvio}D)</Rotulo>
          {dataMinima(MinDDLEnvio)}
        </Campo>

        <Campo>
          <Rotulo>Data de Entrega Desejada</Rotulo>
          <DatePicker
            placeholder="Clique aqui"
            style={{
              all: "unset",
              borderBottom: "1px solid #ccc",
            }}
            value={dataFormatada(Data_Entrega_Desejada)}
            onChange={(e) => ChooseData(e)}
            options={{
              autoClose: true,
              container: null,
              defaultDate: null,
              disableDayFn: null,
              disableWeekends: true,
              events: [],
              firstDay: 0,
              format: "mmm dd, yyyy",
              i18n: datepickerconfig,
              isRTL: false,
              maxDate: null,
              minDate: dataMinimaSolicitacao,
              onClose: null,
              onDraw: null,
              onOpen: null,
              onSelect: null,
              parse: null,
              setDefaultDate: false,
              showClearBtn: true,
              showDaysInNextAndPreviousMonths: false,
              showMonthAfterYear: false,
              yearRange: 1,
            }}
          />
        </Campo>
      </div>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          value={Contato}
          className={classes.TextInput}
          onChange={(e) => DefineContato(e.target.value)}
          label="Contato"
          variant="outlined"
        />
      </form>
      {/* <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          value={Email_Acompanhamento}
          onChange={(e) => ChooseEmail(e.target.value)}
          label="Email"
          variant="outlined"
        />
      </form> */}
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          className={classes.TextInput}
          value={Telefone_Contato}
          onChange={(e) => ChooseTelefone(e.target.value)}
          label="Telefone de Contato"
          variant="outlined"
        />
      </form>
      <form className={classes.root} noValidate autoComplete="off">
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="Observações"
            multiline
            maxRows={4}
            value={Observacao}
            onChange={(e) => DefineOBS(e.target.value)}
            variant="outlined"
          />
        </div>
      </form>
    </>
  );
}

const mapStateToProps = (store) => ({
  State: store.solicitacaoState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      ChooseCliente,
      ChangeEndereco,
      ChooseData,
      DefineContato,
      ChooseTelefone,
      ChooseEmail,
      DefineOBS,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Entrega);

const shouldShowClientes = (Clientes) => {
  if (Clientes.length === 0) {
    return true;
  } else {
    return false;
  }
};

const dataFormatada = (date) => {
  let x = null;
  try {
    x = new Date(date)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/")
      .split("/")
      .reverse()
      .join("/");
  } catch (err) {
    x = "";
  }

  return x;
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  TextInput: {
    '& div>input:nth-child(1)': {
      margin: '0px 8px',
    },
  }
}));

const datepickerconfig = {
  cancel: "Cancelar",
  clear: "Limpar",
  done: "Confirmar",
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthsShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  nextMonth: "›",
  previousMonth: "‹",
  weekdays: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  weekdaysAbbrev: ["D", "S", "T", "Q", "Q", "S", "S"],
  weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
};

const dataMinima = (DDL = 0) => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + DDL
  )
    .toLocaleString()
    .split(" ")[0];
};

const enderecoEntrega = (cliente) => {
  let enderecoCompleto = ''

  if (cliente.Logradouro !== null) {
    enderecoCompleto = enderecoCompleto.concat(cliente.Logradouro.trim())
  }

  if (cliente.Número !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Número.trim()}`)
  }

  if (cliente.Complemento !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Complemento.trim()}`)
  }

  if (cliente.Bairro !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Bairro.trim()}`)
  }

  if (cliente.Município !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.Município.trim()}`)
  }

  if (cliente.UF !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.UF.trim()}`)
  }

  if (cliente.CEP !== null) {
    enderecoCompleto = enderecoCompleto.concat(`, ${cliente.CEP.trim()}`)
  }

  return enderecoCompleto
};
