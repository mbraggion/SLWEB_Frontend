import moment from "moment";
import React from "react";

import { Button, makeStyles, TextField, Typography } from "@material-ui/core";
import { Replay as ReplayIcon } from "@material-ui/icons";

import DatePicker from "../../components/materialComponents/datePicker";
import { InputCEP } from "./components/inputCEP";
import { InputCPF } from "./components/inputCPF";
import { InputRG } from "./components/inputRG";
import { InputTelCelular } from "./components/inputTelCelular";
import { InputTelFixo } from "./components/inputTelFixo";
import { QuestionBox } from "./components/questionBox";

import { Toast } from "../../components/toasty";

export const FormQuestion = ({
  loading,
  question,
  submitError,
  handleRequestAdvance,
  handleRequestRetreat,
  handleChangeAnswer,
}) => {
  const classes = useStyles();

  return (
    <div
      style={{
        padding: "0px 8px 0px 8px",
      }}
    >
      {whichContentDisplay(
        loading,
        question,
        submitError,
        handleRequestAdvance,
        handleRequestRetreat,
        handleChangeAnswer,
        classes
      )}
    </div>
  );
};

const whichContentDisplay = (
  loading,
  question,
  submitError,
  handleRequestAdvance,
  handleRequestRetreat,
  handleChangeAnswer,
  classes
) => {
  if (loading) {
    // FIM DA ETAPA
    return (
      <QuestionBox
        question={
          submitError
            ? "Falha ao salvar etapa, tente novamente."
            : "Salvando etapa..."
        }
        answer={
          <Button
            variant="contained"
            color="primary"
            endIcon={<ReplayIcon />}
            disabled={!submitError}
            onClick={handleRequestAdvance}
          >
            Tentar novamente
          </Button>
        }
        validation={() => true}
        validationErrorAction={() =>
          Toast("Salvando etapa, aguarde...", "info")
        }
        onChangeAnswer={() => {}}
        onAdvance={handleRequestAdvance}
        onRetreat={() => {}}
      />
    );
  } else if (!loading && typeof question !== "undefined") {
    // QUESTÃO COMUM
    return (
      <QuestionBox
        question={question.question}
        answer={returnAnswerComponent(question, classes, handleChangeAnswer)}
        validation={() => {
          if (question.invalidMessage === null) {
            return true;
          } else {
            if (
              question.answer !== null &&
              String(question.answer).trim() !== "" &&
              typeof question.answer != "undefined"
            ) {
              return true;
            } else {
              return false;
            }
          }
        }}
        validationErrorAction={() => {
          Toast(question.invalidMessage, "warn");
        }}
        // onChangeAnswer={(e) =>
        //   handleChangeAnswer(question.questionId, e.currentTarget.value)
        // }
        onChangeAnswer={null}
        onAdvance={handleRequestAdvance}
        onRetreat={handleRequestRetreat}
        alignArrow={whereAlignArrow(question)}
        answerOnly={isAnswerOnly(question)}
      />
    );
  } else {
    // FORMULÁRIO FINALIZADO
    return (
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
    );
  }
};

const whereAlignArrow = (question) => {
  if (
    question.answerComponentType === "Estado Civil" ||
    question.answerComponentType === "Afirmacoes" ||
    question.answerComponentType === "file"
  ) {
    return "flex-end";
  } else {
    return "center";
  }
};

const isAnswerOnly = (question) => {
  if (question.slug === "Afirmacoes") {
    return true;
  } else {
    return false;
  }
};

const returnAnswerComponent = (question, classes, onChangeAnswer) => {
  switch (question.answerComponentType) {
    case "input":
      return (
        <TextField
          autoFocus
          className={classes.TextInput}
          variant="outlined"
          label={question.FTP_slug}
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.currentTarget.value)}
        />
      );
    case "date":
      return (
        <DatePicker
          min={false}
          label="Data de nascimento"
          defaultValue={rawDateToMomentValidObject(question.answer)}
          onChange={(e) => onChangeAnswer(e._d)}
        />
      );
    case "RG":
      return (
        <InputRG
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
        />
      );
    case "CPF":
      return (
        <InputCPF
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
        />
      );
    case "Celular":
      return (
        <InputTelCelular
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
        />
      );
    case "Telefone":
      return (
        <InputTelFixo
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
        />
      );
    case "CEP":
      return (
        <InputCEP
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
        />
      );
    case "Estado Civil":
      return (
        <div>
          {question.questionOptions.map((EC) => (
            <div style={divStyle} key={EC.value}>
              <input
                type="checkbox"
                onClick={(e) =>
                  onChangeAnswer(e.target.checked ? e.target.value : null)
                }
                value={EC.value}
                checked={EC.value === question.answer}
              />
              <Typography variant="subtitle1">{EC.label}</Typography>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const rawDateToMomentValidObject = (rawDate) => {
  if (
    rawDate === null ||
    typeof rawDate === "undefined" ||
    String(rawDate).trim === ""
  ) {
    return null;
  }

  if (moment(rawDate).isValid()) {
    return moment(rawDate);
  } else {
    const MomentValidObj = moment();
    const destructecRawDate = String(rawDate).split("/");

    MomentValidObj.date(destructecRawDate[0]);
    MomentValidObj.month(destructecRawDate[1] - 1);
    MomentValidObj.year(destructecRawDate[2]);

    return MomentValidObj;
  }
};

const useStyles = makeStyles((theme) => ({
  TextInput: {
    width: "100%",
    margin: "8px",
    paddingRight: "8px",
    "&:nth-child(1) > div > input": {
      marginLeft: "8px",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  StepLabelNumber: {
    "& > span.MuiStepLabel-iconContainer > svg > circle": {
      color: "#0056C7",
      backgroundColor: "#0056C7",
    },
    "& > span.MuiStepLabel-iconContainer > svg > path": {
      color: "#65e305",
      backgroundColor: "#65e305",
    },
  },
}));

const divStyle = {
  display: "Flex",
  width: "100%",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  marginBottom: "2%",
};
