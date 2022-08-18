import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { api } from "../../services/api";

import {
  LoadLeadsFranqueado,
  LoadLeadsGeral,
  LoadLeadsLimite,
} from "../../global/actions/LeadAction";

// import AdicionarLead from './modals/AddLead'
import Assumidos from './LeadsAssumidos'
import Disponiveis from './LeadsDisponiveis'

import { Panel } from "../../components/commom_in";
import Loading from "../../components/loading_screen";

function LeadsList(props) {
  const [Loaded, setLoaded] = useState(false);


  const { LoadLeadsFranqueado, LoadLeadsGeral, LoadLeadsLimite } = props;
  const { LeadsFranqueado, LeadsGeral, Limites } = props.State;

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get("/leads");

        LoadLeadsFranqueado(response.data.LeadsFranqueado);
        LoadLeadsGeral(response.data.LeadsGeral);
        LoadLeadsLimite(response.data.Limites);
        setLoaded(true);
      } catch (err) { }
    }
    load();
    // eslint-disable-next-line
  }, []);

  // const CargaPlanilha = () => {
  //   //Pega todos inputs do tipo arquivos
  //   const arquivos = document.getElementsByClassName("files")[0].files[0];
  //   const reader = new FileReader();
  //   let result

  //   reader.onload = (evt) => {
  //     // evt = on_file_select event
  //     /* Parse data */
  //     const bstr = evt.target.result;
  //     const wb = xlsx.read(bstr, { type: "binary" });
  //     /* Get first worksheet */
  //     const wsname = wb.SheetNames[0];
  //     const ws = wb.Sheets[wsname];
  //     /* Convert array of arrays */
  //     const data = xlsx.utils.sheet_to_csv(ws, { header: 1 });
  //     /* Update state */
  //     result = convertToJson(data); // shows data in obj format
  //     console.log(result)
  //   };

  //   if(typeof arquivos != 'undefined'){
  //     reader.readAsBinaryString(arquivos);
  //   }else{
  //      
  //   }
  // }

  // const convertToJson = (csv) => {
  //   var lines = csv.split("\n");

  //   var result = [];

  //   var headers = lines[0].split(",");

  //   for (var i = 1; i < lines.length; i++) {
  //     var obj = {};
  //     var currentline = lines[i].split(",");

  //     for (var j = 0; j < headers.length; j++) {
  //       obj[headers[j]] = currentline[j];
  //     }

  //     result.push(obj);
  //   }

  //   return result; //JavaScript object
  //   // return JSON.stringify(result); //JSON
  // }

  return !Loaded ? (
    <Loading />
  ) : (
    <Panel style={{
      alignItems: "flex-start",
      padding: '16px',
      justifyContent: 'column',
      flexWrap: 'noWrap',
      overflow: 'auto'
    }}>
      {/* <AdicionarLead /> */}
      <Assumidos
        Leads={LeadsFranqueado}
        ContAssumidos={Limites[0].Tentativas}
        ContMax={Limites[0].MaxTentativas}
      />
      <Disponiveis
        Leads={LeadsGeral}
      />
    </Panel>
  );
}

const mapStateToProps = (store) => ({
  State: store.leadsState,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      LoadLeadsFranqueado,
      LoadLeadsGeral,
      LoadLeadsLimite,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LeadsList);
