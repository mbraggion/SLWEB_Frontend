import React, { useEffect, useState } from "react";

import { FormHelper } from "./FormHelper";
import { FormQuestion } from "./FormQuestion";
import { FormStepper } from "./FormStepper";
import { ModalCOF } from "./modals/modalCOF";

import { Toast } from "../../components/toasty";

export const Form = ({ Form, onChangeForm, COD, lastFormSection }) => {
  const [section, setSection] = useState(0);
  const [question, setQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [modalCOFOpen, setModalCOFOpen] = useState(false);
  // 963406

  const sessao = Form[Object.keys(Form)[section]];
  const questao = Form[Object.keys(Form)[section]][question];

  useEffect(() => {
    setSection(Number(lastFormSection));
  }, [lastFormSection]);

  const handleRequestAdvance = async () => {
    if (question === sessao.length) {
      Toast("Aguarde...", "info");
    } else if (question + 1 === sessao.length) {
      setLoading(true);
      setSubmitError(false);
      try {
        await handleSubmit();
        //avança a section
        setSection((oldState) => oldState + 1);
        //volta o question para 0
        setQuestion(0);
        setLoading(false);
        setSubmitError(false);
      } catch (err) {
        setSubmitError(true);
      }
    } else {
      setQuestion((oldState) => oldState + 1);
    }
  };

  const handleRequestRetreat = async () => {
    if (question === 0 && section === 1) {
      Toast("Você já está na primeira pergunta", "info");
    } else if (question > 0) {
      setQuestion(question - 1);
    } else if (question === 0 && section > 0) {
      setQuestion(Form[Object.keys(Form)[section - 1]].length - 1);
      setSection(section - 1);
    } else {
    }
  };

  const handleSubmit = async () => {
    // let toastId = null
    // toastId = Toast('Salvando...', 'wait')
    // try {
    //   //envia o formulario
    //   await api.post(`/form/upload/form/${COD}`,
    //     {
    //       form: Form,
    //       secao: section + 1
    //     },
    //   );
    //   Toast('Etapa salva', 'update', toastId, 'success')
    // } catch (err) {
    //   Toast('Falha ao salvar dados, tente novamente', 'update', toastId, 'error')
    //   throw new Error()
    // }
  };

  const handleChangeAnswer = (newAnswer) => {
    console.log(Form[Object.keys(Form)[section]][question])
    
    onChangeForm((oldState) => {
      let aux = {...oldState}
      
      aux[Object.keys(Form)[section]][question] = {
        ...aux[Object.keys(Form)[section]][question], 
        answer: newAnswer
      }

      return aux
    });
  };

  return (
    <>
      <ModalCOF open={modalCOFOpen} onClose={() => setModalCOFOpen(false)} />

      <FormHelper />

      <FormQuestion
        loading={loading}
        question={questao}
        submitError={submitError}
        handleRequestAdvance={handleRequestAdvance}
        handleRequestRetreat={handleRequestRetreat}
        handleChangeAnswer={handleChangeAnswer}
      />

      <FormStepper />
    </>
  );
};
