import React, { useEffect, useState } from "react";

import { FormHelper } from "./FormHelper";
import { FormQuestion } from "./FormQuestion";
import { FormStepper } from "./FormStepper";
import { ModalCOF } from "./modals/modalCOF";

import { Toast } from '../../components/toasty';
import { api } from '../../services/api';

export const Form = ({ Form, onChangeForm, COD, lastFormSection, isFormComplete }) => {
  const [section, setSection] = useState(1);
  const [question, setQuestion] = useState(0);

  const [loading, setLoading] = useState(false);
  const [formFinished, setFormFinished] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [modalCOFOpen, setModalCOFOpen] = useState(false);

  const sessao = !loading && !isFormComplete ? Form[Object.keys(Form)[section]] : [];
  const questao = !loading && !isFormComplete
    ? Form[Object.keys(Form)[section]][question]
    : questionModal;

  useEffect(() => {
    if (lastFormSection !== null) {
      setSection(Number(lastFormSection));
    } else {

    }
  }, [lastFormSection]);

  useEffect(() => {
    setFormFinished(isFormComplete);
  }, [isFormComplete]);

  const validateQuestion = (q) => {
    if (q.dependences !== null) {
      let valid = true;

      // check equals
      q.dependences.forEach((d) => {
        let targetQuestion = null

        for (let i = 1; i < Object.keys(Form).length; i++) {
          let result = Form[Object.keys(Form)[i]].filter(
            (tq) => tq.questionId === d.id
          )

          if (result.length > 0) {
            targetQuestion = result[0]
          }
        }

        if (targetQuestion === null) throw new Error('questão dependida não encontrada')

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

      // check not equals
      q.dependences.forEach((d) => {
        let targetQuestion = null

        for (let i = 1; i < Object.keys(Form).length; i++) {
          let result = Form[Object.keys(Form)[i]].filter(
            (tq) => tq.questionId === d.id
          )

          if (result.length > 0) {
            targetQuestion = result[0]
          }
        }

        if (targetQuestion === null) throw new Error('questão dependida não encontrada')

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

      return valid
    } else {
      return true
    }
  };

  const handleRequestAdvance = async () => {
    const finishForm = async () => {
      setLoading(true);
      setSubmitError(false);

      try {
        if (!await handleSubmit(true)) {
          throw new Error()
        }

        setLoading(false);
        setSubmitError(false);
        setFormFinished(true)
      } catch (err) {
        setSubmitError(true);
      }
    }

    //testo se estou tentando avançar alem do formulario
    if (question + 1 === sessao.length && section + 1 === Object.keys(Form).length) {
      await finishForm()

      return
    }

    let newSection = question + 1 === sessao.length && section + 1 !== Object.keys(Form)[section + 1].length ? section + 1 : section
    let newQuestion = question + 1 === sessao.length && section + 1 !== Object.keys(Form)[section + 1].length ? 0 : question + 1
    let validated = false

    for (let s = newSection; s < Object.entries(Form).length && !validated; s++) {
      for (let q = newQuestion; q < Form[Object.keys(Form)[s]].length && !validated; q++) {
        if (validateQuestion(Form[Object.keys(Form)[s]][q])) {
          validated = true
          newSection = s
          newQuestion = q
        }
      }

      if (!validated) newQuestion = 0
    }

    if(!validated){
      await finishForm()

      return
    }

    if (newSection > section) {
      setLoading(true);
      setSubmitError(false);

      try {
        if (!await handleSubmit()) {
          throw new Error()
        }

        //volta o question para 0
        setQuestion(newQuestion);

        //avança a section
        setSection(newSection);

        setLoading(false);
        setSubmitError(false);
      } catch (err) {
        setSubmitError(true);
      }
    } else if (newSection === section && newQuestion !== question) {
      setQuestion(newQuestion);
    }
  };

  const handleRequestRetreat = async () => {
    let newSection = question === 0 ? section - 1 : section
    let newQuestion = question === 0 ? Form[Object.keys(Form)[section - 1]].length - 1 : question - 1

    if (newSection < 1 || newQuestion < 0) {
      Toast("Você já está na primeira pergunta", "info");
    } else {
      let validated = false

      for (let s = newSection; s < Object.entries(Form).length && !validated; s--) {
        for (let q = newQuestion; q < Form[Object.keys(Form)[s]].length && !validated; q--) {

          if (validateQuestion(Form[Object.keys(Form)[s]][q])) {
            validated = true
            newSection = s
            newQuestion = q
          }
        }

        if (!validated) newQuestion = 0
      }

      setSection(newSection);
      setQuestion(newQuestion);
    }

    // if (question === 0 && section === 1) {
    //   // se for a primeira pergunta da primeira section = Toast = voce ja esta no comeco do formulario

    //   Toast("Você já está na primeira pergunta", "info");
    // } else if (question === 0 && section > 1) {
    //   // se for a primeira pergunta e nao for a primeira section = section = section - 1, question = form[section - 1].length - 1

    //   setQuestion(Form[Object.keys(Form)[section - 1]].length - 1);
    //   setSection(section - 1);
    // } else if (question > 0 && section > 0) {
    //   // se nao for a primeira pergunta de qualquer section = question = question - 1

    //   setQuestion(question - 1);
    // }
  };

  const handleSubmit = async (isFinish = false) => {
    let toastId = null
    toastId = Toast('Salvando...', 'wait')

    try {
      //envia o formulario
      await api.post(`/form/upload/form/${COD}`,
        {
          form: Form,
          secao: isFinish ? null : section + 1
        },
      );

      Toast('Etapa salva', 'update', toastId, 'success')
      return true
    } catch (err) {
      Toast('Falha ao salvar dados, tente novamente', 'update', toastId, 'error')
      return false
    }
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

      <FormHelper
        loading={loading}
        question={question}
        sectionLength={sessao.length}
        submitError={submitError}
        formFinished={formFinished}
      />

      <FormQuestion
        loading={loading}
        formFinished={formFinished}
        question={questao}
        submitError={submitError}
        handleRequestAdvance={() => {
          handleRequestAdvance();
        }}
        handleRequestRetreat={() => {
          handleRequestRetreat();
        }}
        handleChangeAnswer={handleChangeAnswer}
        COD={COD}
      />

      <FormStepper
        stepsName={Object.keys(Form).filter(objName => objName !== 'NC')}
        section={section - 1}
        formFinished={formFinished}
      />
    </>
  );
};

let questionModal = {
  questionId: 0,
  slug: null,
  question: null,
  questionOptions: null,
  answer: null,
  answerComponentType: null,
  invalidMessage: null,
  dependences: null,
};
