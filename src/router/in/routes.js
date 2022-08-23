import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

import Sidebar from '../../components/sidebar/sidebar'

//import de telas
import notFound from "../../pages/1_NOT_FOUND/index";
import Perfil from "../../pages/perfil/index";
import Leads from "../../pages/leads/index";
import Ajuda from "../../pages/ajuda/index";
import Equipe from "../../pages/equipe/index";
import Equipamentos from '../../pages/equipamentos/index';
import AddEquipamentos from "../../pages/equipamentosSolicitacao/index";
import GerenciarEquip from "../../pages/gerenciarSolicitacoes/index";
import Home from "../../pages/dashboard/index";
import Monitor from "../../pages/monitor/index";
import FormsAcompanhamento from "../../pages/formulários_cadastrados";
import CentralEmails from "../../pages/emails/index";
import Compras from '../../pages/compras/index'
import Vendas from '../../pages/vendas/index'
import Coletas from '../../pages/consultaColetas/index'
import PDV from '../../pages/pontosDeVenda/index'
import Clientes from '../../pages/clientes'
import GerirLeads from '../../pages/gerirLeads/index'
import PedidosCompra from '../../pages/pedidosDeCompra/index'
import Arquivos from '../../pages/arquivos/index'
import Franqueados from '../../pages/franqueados'
import DRE from '../../pages/dre'

import { FilesProvider } from '../../hooks/useFiles'

function Dashboard(props) {
  return (
    <div
      id="outer"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: 'flex-start',
        alignContent: "center",
        overflow: props.State.overflow
      }}
    >
      <Router id="Out">
        <Sidebar />
        <div id="App">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/equipe" component={Equipe} />
            <Route exact path="/ajuda" component={Ajuda} />

            <Route exact path={validateRouteAccess("/leads")} component={Leads} />
            <Route exact path={validateRouteAccess("/perfil")} component={Perfil} />
            <Route exact path={validateRouteAccess("/compras")} component={Compras} />
            <Route exact path={validateRouteAccess("/vendas")} component={Vendas} />
            <Route exact path={validateRouteAccess("/equipamentos")} component={Equipamentos} />
            <Route exact path={validateRouteAccess("/solicitacao")} component={AddEquipamentos} />
            <Route exact path={validateRouteAccess("/leituras/:ativo")} component={Coletas} />
            <Route exact path={validateRouteAccess("/leituras")} component={Coletas} />
            <Route exact path={validateRouteAccess("/pontodevenda")} component={PDV} />
            <Route exact path={validateRouteAccess("/pontodevenda/:ativo")} component={PDV} />
            <Route exact path={validateRouteAccess("/clientes")} component={Clientes} />
            <Route exact path={validateRouteAccess("/monitor")} component={Monitor} />
            <Route exact path={validateRouteAccess("/dre")} component={DRE} />
            <Route exact path={validateRouteAccess("/arquivos")} component={ () => <FilesProvider> <Arquivos /> </FilesProvider> } />

            <Route exact path={validateRouteAccess("/administracao/solicitacao/management")} component={GerenciarEquip} />
            <Route exact path={validateRouteAccess("/administracao/formularios")} component={FormsAcompanhamento} />
            <Route exact path={validateRouteAccess("/administracao/leads")} component={GerirLeads} />
            <Route exact path={validateRouteAccess("/administracao/emails")} component={CentralEmails} />
            <Route exact path={validateRouteAccess("/administracao/pedidos/compra")} component={PedidosCompra} />
            <Route exact path={validateRouteAccess("/administracao/franqueados")} component={Franqueados} />

            <Route path="*" component={notFound} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

const mapStateToProps = (store) => ({
  State: store.EtcState,
});

export default connect(mapStateToProps)(Dashboard);

const validateRouteAccess = (correctPath) => {
  const links = JSON.parse(window.sessionStorage.getItem('links'))
  let linkEstaDisponivel = false

  links.forEach(LS => {
    LS.forEach(L => {
      if (String(correctPath).includes(L.Link)) {
        linkEstaDisponivel = true
      }
    })
  })

  return linkEstaDisponivel === true ? correctPath : '/'
}