import React, { useEffect, useState } from "react";

import { FormHelper } from "./FormHelper";
import { FormQuestion } from "./FormQuestion";
import { FormStepper } from "./FormStepper";
import { ModalCOF } from "./modals/modalCOF";

import { Toast } from "../../components/toasty";

export const Form = ({ Form, onChangeForm, COD, lastFormSection }) => {
  const [section, setSection] = useState(0);
  const [question, setQuestion] = useState(13);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [modalCOFOpen, setModalCOFOpen] = useState(false);
  // 963406

  const sessao = !loading ? Form[Object.keys(Form)[section]] : [];
  const questao = !loading
    ? Form[Object.keys(Form)[section]][question]
    : questionModal;

  useEffect(() => {
    setSection(Number(lastFormSection));
  }, [lastFormSection]);

  const validateQuestion = () => {
    if (questao && questao.dependences !== null) {
      let valid = true;

      questao.dependences.forEach((d) => {
        let targetQuestion = Form[Object.keys(Form)[section]].filter(
          (q) => q.questionId === d.id
        )[0];

        //testo o que deve ser igual
        if (Array.isArray(d.equals)) {
          let ou = false;

          d.equals.forEach((e) => {
            if (targetQuestion.answer === e) {
              ou = true;
            }
          });

          valid = ou;
        } else if (typeof d.equals != "undefined") {
          if (targetQuestion.answer !== d.equals) {
            valid = false;
          }
        }
      });

      questao.dependences.forEach((d) => {
        let targetQuestion = Form[Object.keys(Form)[section]].filter(
          (q) => q.questionId === d.id
        );

        //testo o que deve ser diferente
        if (Array.isArray(d.notEquals)) {
          let ou = false;

          d.notEquals.forEach((e) => {
            if (targetQuestion.answer !== e) {
              ou = true;
            }
          });

          valid = ou;
        } else if (typeof d.notEquals != "undefined") {
          if (targetQuestion.answer === d.notEquals) {
            valid = false;
          }
        }
      });

      return valid;
    } else {
      alert('não foi possivel validar a questão')
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleRequestAdvance = async () => {
    if (
      question + 1 === sessao.length &&
      typeof Form[Object.keys(Form)[section + 1]] != "undefined"
    ) {
      setLoading(true);
      setSubmitError(false);

      try {
        await handleSubmit();

        //volta o question para 0
        setQuestion(0);

        //avança a section
        setSection((oldState) => oldState + 1);

        setLoading(false);
        setSubmitError(false);
      } catch (err) {
        setSubmitError(true);
      }
    } else if (typeof Form[Object.keys(Form)[section + 1]] == "undefined") {
      setLoading(true);
      setSubmitError(false);

      try {
        await handleSubmit();

        /*Essa posicao no array das perguntas vai retornar um undefined,
        que o FormQuestion vai considerar que o formulário acabou*/
        setQuestion((oldState) => oldState + 1);

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
    // }
  };

  const handleChangeAnswer = (newAnswer) => {
    onChangeForm((oldState) => {
      let aux = { ...oldState };

      aux[Object.keys(Form)[section]][question] = {
        ...aux[Object.keys(Form)[section]][question],
        answer: newAnswer,
      };

      return aux;
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
        handleRequestAdvance={() => {
          handleRequestAdvance();
        }}
        handleRequestRetreat={() => {
          handleRequestRetreat();
        }}
        handleChangeAnswer={handleChangeAnswer}
      />

      <FormStepper />
    </>
  );
};

let questionModal = {
  questionId: 0,
  question: null,
  answer: null,
  answerComponentType: null,
  invalidMessage: null,
  dependences: null,
};
