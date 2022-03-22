import React, { useState } from "react";
import Loading from "../../components/loading_screen";

//Meio de comunicação
import { api } from "../../services/api";

import { Container } from "../../components/commom_in";
import { Toast } from "../../components/toasty";

import Stepper from './stepper'
import CodeView from './codeInsertView'
import Intro from './Intro'
import { HelperModal } from './helperModal'

import {
  Zoom,
  Fab
} from '@material-ui/core'

import {
  ContactSupport as ContactSupportIcons
} from '@material-ui/icons'

export const Formulario = () => {
  const [codCandidato, setCodCandidato] = useState(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [validado, setValidado] = useState(false)
  const [form, setForm] = useState(INITIAL_STATE)
  const [wait, setWait] = useState(false)
  const [helperModalOpen, setHelperModalOpen] = useState(false);

  const handleInsereCodigo = async (codigo, event) => {
    if (!Number.isSafeInteger(Number(codigo))) {
      event.target.value = codigo.slice(0, codigo.length - 1);
      return;
    }

    if (codigo.length === 6) {
      setCodCandidato(codigo)
      setLoading(true)
    } else {
      setCodCandidato(null)
      return;
    }

    try {
      await api.get(`/form/check/${codigo}`);
      setLoading(false)
      setValidado(true)
      setWait(false)
    } catch (err) {
      Toast('Código inválido', 'info')
      setLoading(false)
      setValidado(false)
      setWait(false)
      setCodCandidato(null)
    }
  }

  const handleChangeEmail = (value) => {
    setEmail(value)
  }

  const handleSolicitaCodigo = async () => {
    if (email === "" || email === null) {
      Toast('Informe um email', 'warn')
      return
    }

    let toastId = null

    try {
      toastId = Toast('Aguarde...', 'wait')
      setWait(true)

      await api.post("/form/solicitacao", {
        email: email,
      });

      Toast('Um código foi enviado para o seu email!', 'update', toastId, 'success')
    } catch (err) {
      Toast('Falha ao enviar email com código', 'update', toastId, 'error')
      setWait(false)
    }
  }

  const handleSubmit = async (event) => {
    let shouldFinishForm = true
    setWait(true)

    //Pega todos inputs do tipo arquivos
    const arquivos = document.getElementsByClassName("files");

    //cria um objeto do tipo formulario
    const formData = new FormData();

    //poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
    for (let j = 0; j < arquivos.length; j++) {
      for (let i = 0; i < arquivos[j].files.length; i++) {
        formData.append(`formData`, arquivos[j].files[i]);
      }
    }

    // if (formData.getAll('formData').length < 3) {
    //   Toast('Anexe todos os arquivos solicitados', 'warn')
    //   setWait(false)
    //   return false
    // }

    let toastId = null

    //faz upload de tudo
    try {
      toastId = Toast('Enviando dados...', 'wait')

      //envia o formulario
      await api.post(`/form/${codCandidato}`,
        {
          form: form,
        },
      );

      //envia os arquivos
      await api.post(`/form/upload/${codCandidato}/${formData.getAll('formData').length}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

      Toast('Dados salvos!', 'update', toastId, 'success')
    } catch (err) {
      Toast('Falha ao salvar os dados, se o erro persistir baixe o arquivo Word e nos envie com as respostas pelo email informado no arquivo.', 'update', toastId, 'error')
      event.target.disabled = false
      shouldFinishForm = false;
    }

    if (!shouldFinishForm) {
      setWait(false)
    } else {
      setTimeout(() => window.location.reload(), 3000);
    }

    return shouldFinishForm
  }

  const handleOpenHelperModal = () => {
    setHelperModalOpen(true)
  }

  const handleCloseHelperModal = () => {
    setHelperModalOpen(false)
  }

  return (
    <>
      <HelperModal
        open={helperModalOpen}
        onClose={handleCloseHelperModal}
        title='Ajuda com o Formulário'
      />
      <Container>

        {codCandidato === null ? (
          <CodeView
            onCodeInsertion={(value, e) => handleInsereCodigo(value, e)}
            onCodeRequest={(e) => handleSolicitaCodigo(e)}
            onEmailChange={(e) => handleChangeEmail(e)}
            fetching={wait}
          />
        ) : null}

        {loading ? (
          <Loading
            type="spinningBubbles"
            color="#000000"
            height="3%"
            width="3%"
          />
        ) : null}

        {validado ? (
          <>
            <Intro />
            <Stepper
              Form={form}
              onFormChange={setForm}
              onSubmit={(e) => handleSubmit(e)}
              fetching={wait}
            />
          </>
        ) : null}

      </Container>
      <div
        style={{
          position: "fixed",
          right: "16px",
          bottom: "16px",
        }}
      >
        <Zoom
          in={!helperModalOpen}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${!helperModalOpen ? transitionDuration.exit : 0
              }ms`,
          }}
          unmountOnExit
        >
          <Fab
            onClick={handleOpenHelperModal}
            color="primary"
            style={{
              boxShadow: '2px 2px 3px #999',
            }}
          >
            <ContactSupportIcons fontSize="large" />
          </Fab>
        </Zoom>
      </div>
    </>
  );
}

export default Formulario

const INITIAL_STATE = {
  Nome_Completo: null,
  DtNascimento: null,
  RG: null,
  CPF: null,
  Logradouro: null,
  Número: null,
  Complemento: null,
  Bairro: null,
  Municipio: null,
  Estado: null,
  CEP: null,
  Email: null,
  Tel_Residencial: null,
  Celular: null,
  Est_Civil: null,
  Conj_Nome: null,
  Conj_DtNascimento: null,
  Conj_CPF: null,
  Conj_RG: null,
  TUnião: null,
  Conj_RendMensal: null,
  CLT: null,
  Tem_filhos: null,
  Qtd_filhos: null,
  Idd_filhos: null,
  T_Residencia: null,
  P_Veiculo: null,
  P_Imovel: null,
  Expect: null,
  Recolhimento: null,
  T_Empresa: null,
  Sociedade: null,
  Part_invest: null,
  T_Empreendimento: null,
  Cob_Desp: null,
  Prioridade: new Array(11),
  Com_Regra: null,
  Com_Med: null,
  Com_Inf: null,
  Rend_Mensal: null,
  Residencia_Mensal: null,
  Recolhimento_QTD: null,
  Origem_Capital: null,
  Renda_Familiar: null,
  Renda_Composta: null,
  Disp_Invest: null,
  Detalhes_Atividade: null,
  Form_Escolar: null,
  Ult_exp: null,
  Nome_Socio: null,
  Socio_Vinculo: null,
  Tempo_ConheceSocio: null,
  Realizou_Socio: null,
  Cond_Socio: null,
  Prop_Invest: null,
  Exp_Sociedade: null,
  Conhece_Pilao: null,
  Caracteristica_Peso: null,
  Consultor: ''
}

const transitionDuration = {
  appear: 300,
  enter: 300,
  exit: 300,
};