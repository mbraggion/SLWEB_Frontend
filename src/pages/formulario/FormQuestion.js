import React from 'react';

import { QuestionBox } from "./components/questionBox";

import { Toast } from "../../components/toasty";

export const FormQuestion = () => {
  return(
    <div
        style={{
          padding: "0px 8px 0px 8px",
        }}
      >
        <QuestionBox
          question="Formulário completo!"
          answer={null}
          validation={() => false}
          validationErrorAction={() =>
            Toast(
              "Voce já respondeu a todas as questões do formulário",
              "success"
            )
          }
          onChangeAnswer={() => {}}
          onAdvance={() => {}}
          onRetreat={() => {}}
        />
      </div>
  )
}