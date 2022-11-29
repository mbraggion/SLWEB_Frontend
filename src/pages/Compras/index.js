import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../services/api";

import { ShoppingCart, Add, Close } from "@material-ui/icons";
import {
  Zoom,
  Badge,
  Typography,
  Fab,
  makeStyles,
  withStyles
} from "@material-ui/core/";

import {
  LoadInsumos,
  DestroyStore,
  UpdateCarrinho,
  LoadMultiplicador
} from "../../global/actions/ComprasAction";
import MenuAbas from "../../components/materialComponents/PainelAbas";
import { Panel } from "../../components/commom_in";
import { RED_PRIMARY } from "../../misc/colors";

import Comprar from "./Comprar";
import Contas from "./Contas";
import Pedidos from "./Pedidos";
import CarrinhoModal from './modals/CarrinhoModal'

function Compras(props) {
  const classes = useStyles();

  const [carrinhoModalOpen, setCarrinhoModalOpen] = useState(false);
  const [showDescontoCard, setShowDescontoCard] = useState(true);

  const {
    LoadInsumos,
    DestroyStore,
    UpdateCarrinho,
    LoadMultiplicador
  } = props;

  const {
    TabIndex,
    Carrinho,
    Checked,
    Produtos,
    Multiplicador_Desconto
  } =
    props.State;

  // const promo = [{
  //   Cód: 251122,
  //   Produto: "KIT BLACK FRIDAY M (6xCafé,2xCappuccino,3xCafé com Leite,4xAchocolatado)",
  //   QtMin: 1.00,
  //   VlrUn: 632.16,
  //   Vlr: 632.16,
  //   FatConversao: 1.00,
  //   ProdRoy: 0,
  //   QCompra: 0
  // },
  // {
  //   Cód: 221125,
  //   Produto: "KIT BLACK FRIDAY P (6xCafé,4xCappuccino,5xAchocolatado)",
  //   QtMin: 1.00,
  //   VlrUn: 616.07,
  //   Vlr: 616.07,
  //   FatConversao: 1.00,
  //   ProdRoy: 0,
  //   QCompra: 0
  // }]

  //component did mount
  useEffect(() => {
    async function loadProdutos() {
      try {
        const response = await api.get("/compras/produtos");

        LoadInsumos(response.data.Produtos);
        LoadMultiplicador(1 - response.data.Desconto);
      } catch (err) {

      }
    }
    loadProdutos();
  }, [LoadInsumos, LoadMultiplicador]);

  //component will unmount
  useEffect(() => {
    return () => DestroyStore();
  }, [DestroyStore]);

  return (
    <Panel
      style={{
        overflow: "auto",
        alignContent: "center",
        padding: "0px",
        justifyContent: "flex-start",
      }}
    >
      <MenuAbas titles={["Contas a Pagar", "Comprar", "Compras realizadas"]}>
        <Contas />
        <Comprar />
        <Pedidos />
      </MenuAbas>
      <CarrinhoModal
        open={carrinhoModalOpen}
        onClose={setCarrinhoModalOpen}
        desconto={Multiplicador_Desconto}
      />
      {Multiplicador_Desconto < 1 && showDescontoCard ?
        (
          <div
            className="YAlign"
            style={{
              position: "absolute",
              left: "88px",
              bottom: "16px",
              height: '100px',
              width: '300px',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px',
              border: '1px solid #ccc',
              zIndex: '999',
              backgroundColor: '#fff',
              boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className='XAlign' style={{ justifyContent: 'center' }}>
              <Typography
                style={{
                  color: RED_PRIMARY,
                  margin: '0px 8px 0px 0px'
                }}
                variant="subtitle1"
                gutterBottom
              >
                DESCONTO ATIVO NAS COMPRAS
              </Typography>
              <Close
                style={{
                  cursor: 'pointer',
                }}
                fontSize="small"
                onClick={() => setShowDescontoCard(false)}
              />
            </div>
            <Typography style={{ color: '#000' }} variant='subtitle2'>Existe um desconto de <strong>{100 - (Multiplicador_Desconto * 100)}%</strong> ativo para as suas compras de insumos, aproveite!</Typography>
          </div>)
        :
        null
      }

      <div
        className="YAlign"
        style={{
          position: "absolute",
          right: "16px",
          bottom: "16px",
          alignItems: "unset",
        }}
      >
        <Zoom
          in={TabIndex === 2 && ProdutosMarcados(Produtos, Checked) > 0}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${TabIndex === 2 ? transitionDuration.exit : 0
              }ms`,
          }}
          unmountOnExit
        >
          <Fab
            variant="extended"
            onClick={() => UpdateCarrinho()}
            color="primary"
          >
            <StyledBadge
              badgeContent={ProdutosMarcados(Produtos, Checked)}
              color="primary"
            >
              <Add className={classes.extendedIcon} />
              Adicionar
            </StyledBadge>
          </Fab>
        </Zoom>

        <Zoom
          in={Carrinho.length > 0}
          timeout={transitionDuration}
          style={{
            marginTop: "8px",
            transitionDelay: `${TabIndex === 2 ? transitionDuration.exit : 0
              }ms`,
          }}
          unmountOnExit
        >
          <Fab
            variant="extended"
            onClick={() => {
              setCarrinhoModalOpen(true);
            }}
            color="primary"
          >
            <StyledBadge badgeContent={Carrinho.length} color="primary">
              <ShoppingCart className={classes.extendedIcon} />
              Carrinho
            </StyledBadge>
          </Fab>
        </Zoom>
      </div>
    </Panel>
  );
}

const mapStateToProps = (store) => ({
  State: store.CompraState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      LoadInsumos,
      DestroyStore,
      UpdateCarrinho,
      LoadMultiplicador
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Compras);

const useStyles = makeStyles((theme) => ({
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  dataGrid: {
    '& input[type="checkbox"]': {
      transform: "scale(0.5)",
    },
  },
  checkbox: {
    transform: "scale(0.3)",
    marginLeft: "8px",
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -4,
    top: -4,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

const ProdutosMarcados = (ProdList, Marcados) => {
  let count = 0;
  ProdList.forEach((prod) =>
    Marcados.indexOf(prod.Cód) !== -1 ? count++ : null
  );

  return count;
};

const transitionDuration = {
  appear: 300,
  enter: 300,
  exit: 300,
};


