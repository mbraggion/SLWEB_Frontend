import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import { ViewList } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";

import { Table } from "../../components/table";
import Select from "../../components/materialComponents/Select";
import InputMultline from "../../components/materialComponents/InputMultline";
import { RED_PRIMARY } from '../../misc/colors'

import { SetCheckedProd, ChangeCliente, ChangeTipoVenda, SetCondPag, SetDepOrigem, SetDepDestino, SetObs, EditPedido, SwitchTab } from "../../global/actions/VendasAction";

function Vender(props) {
  const classes = useStyles();

  const { Produtos, Checked, Clientes, Cliente, TipoVenda, Condicoes, OBS, CondPag, RemOrigem, RemDestino, Depositos, FixPedido } = props.State;

  const { SetCheckedProd, ChangeCliente, ChangeTipoVenda, SetObs, SetCondPag, SetDepOrigem, SetDepDestino, EditPedido, SwitchTab } = props;

  console.log(FixPedido)

  useEffect(() => {
    SwitchTab(0)
  }, [SwitchTab])

  const handleToggle = (value) => () => {
    SetCheckedProd(value.ProdId);
  };

  const handleSwitchCliente = (CNPJ) => {
    Clientes.forEach((cliente) =>
      String(cliente.CNPJ) === String(CNPJ) ? ChangeCliente(cliente) : null
    );
  };

  const cancelarEdicao = () => {
    EditPedido(null)
  }

  return (
    <div
      className="XAlign"
      style={{
        width: "100%",
        height: "100%",
        flexWrap: "wrap  ",
        alignItems: "flex-start",
      }}
    >
      <Card style={{ width: "100%", padding: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
            <Select
              onChange={(e) => handleSwitchCliente(e.target.value)}
              width='200px'
              maxWidth='100%'
              value={Cliente.CNPJ}
              disabled={FixPedido !== null}
              label="Cliente"
              MRight='8px'
              MBottom='8px'
            >
              {Clientes.map((cliente) => (
                <MenuItem value={cliente.CNPJ} key={cliente.CNPJ}>
                  {cliente.Nome_Fantasia} {cliente.CNPJss}
                </MenuItem>
              ))}
            </Select>

            <Select
              onChange={(e) => ChangeTipoVenda(e.target.value)}
              value={TipoVenda}
              disabled={FixPedido !== null}
              label="Tipo de Venda"
              width='200px'
              MRight='8px'
              MBottom='8px'
            >
              <MenuItem value="V" key="Venda">
                Venda
              </MenuItem>
              <MenuItem value="R" key="Remessa">
                Remessa
              </MenuItem>
              <MenuItem value="B" key="Bonificação">
                Bonificação
              </MenuItem>
            </Select>
            {extraOptions(
              TipoVenda,
              Condicoes,
              CondPag,
              Depositos,
              RemOrigem,
              RemDestino,
              SetCondPag,
              SetDepOrigem,
              SetDepDestino
            )}
          </div>
          {FixPedido &&
              <Typography
                variant="h5"
                gutterBottom

                onMouseEnter={e => {
                  e.target.innerHTML = 'Cancelar Atualização'
                  e.target.style.border = `2px solid ${RED_PRIMARY}`
                  e.target.style.backgroundColor = `${RED_PRIMARY}`
                  e.target.style.color = `#FFF`
                  e.target.style.cursor = 'pointer'
                }}

                onMouseLeave={e => {
                  e.target.style.color = `#000`
                  e.target.innerHTML = `Editando pedido <strong style="color: ${RED_PRIMARY}">${FixPedido}</strong>`
                  e.target.style.border = `2px dashed ${RED_PRIMARY}`
                  e.target.style.backgroundColor = `#FFF`
                  e.target.style.cursor = 'pointer'
                }}

                onClick={cancelarEdicao}

                style={{ border: `2px dashed ${RED_PRIMARY}`, padding: '8px', borderRadius: '4px', fontWeight: 'bold' }}>
                Editando pedido <strong style={{ color: RED_PRIMARY }}>{FixPedido}</strong>
              </Typography>
          }
        </div>
        <InputMultline
          onChange={(e) => SetObs(e.target.value)}
          value={OBS}
          label={`Obs. na nota(${200 - OBS.length})`}
          style={{
            width: "100%", backgroundColor:
              (200 - OBS.length) < 0 ? "rgb(255, 0, 0, 0.5)" : "inherit",
          }}
        />

        <CardHeader
          className={classes.cardHeader}
          avatar={<ViewList />}
          title='Produtos'
          subheader={`${ProdutosMarcados(Produtos, Checked)}/${Produtos.length
            } selecionados`}
        />
        <Divider />
        <TableContainer component={Paper}>
          <Table size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Código</StyledTableCell>
                <StyledTableCell>Produto</StyledTableCell>
                <StyledTableCell>Valor Base</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Produtos.map((prod, i) => {
                const labelId = `transfer-list-all-item-${prod.ProdId}-label`;

                return (
                  <StyledTableRow
                    key={prod.ProdId}
                    onClick={handleToggle(prod)}
                  >
                    <StyledTableCell style={{ textAlign: 'center', padding: '0px' }}>
                      <input
                        style={{ margin: "0px" }}
                        checked={Checked.indexOf(prod.ProdId) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                        type="checkbox"
                        value={prod.ProdId}
                      />
                    </StyledTableCell>

                    <StyledTableCell>{prod.ProdId}</StyledTableCell>

                    <StyledTableCell>
                      <ListItemText primary={String(prod.Produto).trim()} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <ListItemText
                        primary={Number.parseFloat(prod.PrVenda).toFixed(4)}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      SetCheckedProd,
      ChangeCliente,
      ChangeTipoVenda,
      SetObs,
      SetCondPag,
      SetDepOrigem,
      SetDepDestino,
      EditPedido,
      SwitchTab
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  State: store.VendaState,
});

export default connect(mapStateToProps, mapDispatchToProps)(Vender);

//estilo célula
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

//estilo linha
const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:hover": {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      backgroundColor: "#CCC",
      cursor: "pointer",
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    width: "100%",
    height: "100%",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  table: {
    padding: '0px'
  }
}));

const ProdutosMarcados = (ProdList, Marcados) => {
  let count = 0;
  ProdList.forEach((prod) =>
    Marcados.indexOf(prod.ProdId) !== -1 ? count++ : null
  );

  return count;
};

const extraOptions = (
  TipoVenda,
  Condicoes = [],
  Pag,
  Depositos,
  depOrigem,
  depDestino,
  SetCondPag,
  SetDepOrigem,
  SetDepDestino
) => {
  switch (TipoVenda) {
    case "V":
      return (
        <Select
          onChange={(e) => SetCondPag(e.target.value)}
          value={Pag}
          disabled={false}
          label="Condição de Pagamento"
          width="200px"
          MBottom='8px'
        >
          {Condicoes.map((cond) => (
            <MenuItem value={cond.CpgId} key={cond.CpgId}>
              {cond.CpgDesc}
              {/* {cond.CpgDesc}, ({addBusinessDays(moment(), cond.CpgId)}) */}
            </MenuItem>
          ))}
        </Select>
      );
    case "R":
      return (
        <>
          <Select
            onChange={(e) => SetDepOrigem(e.target.value)}
            value={depOrigem}
            disabled={false}
            label="Origem"
            width="200px"
            MRight='8px'
            MBottom='8px'
          >
            {Depositos.map((dep) => (
              <MenuItem value={dep.DepId} key={dep.DepId} disabled={dep.DepId === depDestino}>
                {dep.DepNome}
              </MenuItem>
            ))}
          </Select>
          <Select
            onChange={(e) => SetDepDestino(e.target.value)}
            value={depDestino}
            disabled={false}
            label="Destino"
            width="200px"
            MBottom='8px'
          >
            {Depositos.map((dep) => (
              <MenuItem value={dep.DepId} key={dep.DepId} disabled={dep.DepId === depOrigem}>
                {dep.DepNome}
              </MenuItem>
            ))}
          </Select>
        </>
      );
    case "B":
      return;
    default:
      return;
  }
};

//Funcao pra pegar DDL e retornar o dia alvo
// function addBusinessDays(originalDate, numDaysToAdd) {
//   const Sunday = 0;
//   const Saturday = 6;
//   let daysRemaining = numDaysToAdd;

//   const newDate = originalDate.clone();

//   while (daysRemaining > 0) {
//     newDate.add(1, "days");
//     if (newDate.day() !== Sunday && newDate.day() !== Saturday) {
//       daysRemaining--;
//     }
//   }

//   return newDate.format("ll");
// }
