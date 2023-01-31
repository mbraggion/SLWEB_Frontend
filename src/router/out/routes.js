import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

//Import das telas
import Login from "../../pages/login/index";
import LoginADM from "../../pages/loginADM/index";
import Forgot from "../../pages/forgot";
import Formulario from "../../pages/formulario";
import XRoute from "../../pages/1_UNAUTHORIZED/index";
import autoLogin from "../../pages/autoLogin";
import Audotoria from '../../pages/auditoria'

export default class Out extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/pilao" component={LoginADM} />
          <Route exact path="/forgot" component={Forgot} />
          <Route exact path="/formulario" component={Formulario} />
          <Route exact path="/auditoria/:uuid" component={Audotoria} />
          
          <Route path="/integracao/:code/:target" component={autoLogin} />
          <Route path="*" component={XRoute} />
        </Switch>
      </Router>
    );
  }
}

