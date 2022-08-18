import axios from 'axios'
import { Toast } from '../components/toasty'
// import { navigateTo	 } from '../misc/commom_functions'

const AxiosWithConfig = axios.create({
  baseURL: `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Authorization': `${sessionStorage.getItem("token")}`,
  },
  proxy: {
    host: process.env.REACT_APP_API_URL,
    port: process.env.REACT_APP_API_PORT
  },
  crossDomain: true,
})

AxiosWithConfig.interceptors.response.use(undefined,
  error => {
    if (typeof error.response != "undefined" && typeof error.response.status != "undefined") {
      switch (String(error.response.status)) {
        case '498':
          Toast('Sua sessão expirou, faça login novamente', 'error')
          setTimeout(() => {
            // navigateTo('move', '/')
            window.location.assign('/')
            window.sessionStorage.clear()
          }, 3000)
          break;

        case '400':
          Toast('Erro, contate o suporte', 'error')
          break;

        case '304':
          Toast('Sem mudança', 'warn')
          break;

        case '401':
          Toast('Não autorizado', 'error')
          break;

        case '405':
          Toast('Falha na validação', 'error')
          break;

        case '406':
          Toast('Requisitos não cumpridos', 'error')
          break;

        case '409':
          Toast('Dados conflitantes', 'error')
          break;

        case '412':
          Toast('Pré-condição não atendida', 'error')
          break;

        default:
          break;
      }
    } else {
      Toast('Servidor congestionado, contate o suporte', 'error')
    }
    return Promise.reject(error)
  })

export const api = AxiosWithConfig