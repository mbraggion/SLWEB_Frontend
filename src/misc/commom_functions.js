import {
  REACT_APP_FRANQUEADO_ROLE_LEVEL,
  REACT_APP_EXPEDICAO_ROLE_LEVEL,
  REACT_APP_SISTEMA_ROLE_LEVEL,
  REACT_APP_JURIDICO_ROLE_LEVEL,
  REACT_APP_BACKOFFICE_ROLE_LEVEL,
  REACT_APP_TECNICA_ROLE_LEVEL,
  REACT_APP_MARKETING_ROLE_LEVEL
} from "./role_levels";
import { api } from '../services/api'

//Retorna CNPJ/CPF formatado
export const maskCNPJ = (cnpj) => {
  if (cnpj === null) {
    return cnpj;
  } else if (cnpj.length === 11) {
    const CPF = String(cnpj);

    var CPFsplit = [];

    CPFsplit.push(CPF.substring(0, 3))
    CPFsplit.push(CPF.substring(3, 6))
    CPFsplit.push(CPF.substring(6, 9))
    CPFsplit.push(CPF.substring(9, 11))

    const CPFss = `${CPFsplit[0]}.${CPFsplit[1]}.${CPFsplit[2]}-${CPFsplit[3]}`;

    return CPFss;
  } else if (cnpj.length === 14) {
    const CNPJ = String(cnpj);

    var CNPJsplit = [];

    CNPJsplit.push(CNPJ.substring(0, 2));
    CNPJsplit.push(CNPJ.substring(2, 5));
    CNPJsplit.push(CNPJ.substring(5, 8));
    CNPJsplit.push(CNPJ.substring(8, 12));
    CNPJsplit.push(CNPJ.substring(12, 14));

    const CNPJss = `${CNPJsplit[0]}.${CNPJsplit[1]}.${CNPJsplit[2]}/${CNPJsplit[3]}-${CNPJsplit[4]}`;

    return CNPJss;
  } else {
    return cnpj;
  }
};

//Retorna CEP formatado
export const maskCEP = (cep) => {
  const cep_aux = [];

  cep_aux[0] = cep ? cep.substring(0, 2) : '?';
  cep_aux[1] = cep ? cep.substring(2, 5) : '?';
  cep_aux[2] = cep ? cep.substring(5, 8) : '?';

  return `${cep_aux[0]}.${cep_aux[1]}-${cep_aux[2]}`;
};

//Retorna a data atual em formato DD/MM/AAAA com fuso horário correto
export const dateCheck = () => {
  const data = new Date();

  return data.toLocaleString();
};

//Retorna datas completas convertidas em DD/MM/AAAA
export const convertData = (data) => {
  if (data === "NA" || data === null || typeof data == "undefined") {
    return "NA";
  }

  let DtSolicita = String(data);

  const dataA = DtSolicita.split("T");
  const dataB = dataA[0].replace(/-/g, "/");
  return dataB.split("/").reverse().join("/");
};

export const roleLevel = () => {
  const role = sessionStorage.getItem("role");

  switch (role) {
    //sem permissão pra funções especiais
    case "Franquia":
      return REACT_APP_FRANQUEADO_ROLE_LEVEL;

    //permissão para interagir com solicitações de máquinas e configurações
    case "Expedição":
      return REACT_APP_EXPEDICAO_ROLE_LEVEL;

    //permissão para interagir com solicitações de máquinas e configurações
    case "Técnica Pilão" || "Técnica Bianchi":
      return REACT_APP_TECNICA_ROLE_LEVEL;

    //permissão para subir conteudos para plataforma
    case "Marketing":
      return REACT_APP_MARKETING_ROLE_LEVEL;

    //permissão para ver dados sensiveis de franqueados e gerar relatórios
    case "Jurídico":
      return REACT_APP_JURIDICO_ROLE_LEVEL;

    //permissão para alterar dados sensiveis de franqueados e gerar relatórios
    case "BackOffice":
      return REACT_APP_BACKOFFICE_ROLE_LEVEL;

    //Super usuário
    case "Sistema":
      return REACT_APP_SISTEMA_ROLE_LEVEL;

    default:
      return 0;
  }
};

export const toValidString = (string, sub = '') => {
  return string === null || string === 'null' || typeof string == 'undefined' ? sub : string;
}

export const capitalizeMonthFirstLetter = (month) => {
  return month.charAt(0).toUpperCase() + month.slice(1)
}

export const navigateTo = (type, url = null) => {
  switch (type) {
    case 'move':
      saveNavigationToDB(url)
      window.location.assign(url)
      break
    case 'return':
      window.history.back()
      // saveNavigationToDB(window.location.href.split(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`)[1])
      break
    case 'reload':
      window.location.reload()
      // saveNavigationToDB(window.location.href.split(`${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`)[1])
      break
    case 'link':
      saveNavigationToDB(url)
      break
    default:
      console.log('navigate type not acceptable')
      break
  }
}

const saveNavigationToDB = (url) => {
  api.post('/navegacao/', {
    url: url
  })
  return
}