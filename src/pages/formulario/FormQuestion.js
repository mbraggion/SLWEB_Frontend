import moment from "moment";
import React, { useState } from "react";
import { api } from '../../services/api';

import { Button, makeStyles, MenuItem, TextField, Typography } from "@material-ui/core";
import { Replay as ReplayIcon } from "@material-ui/icons";
import { Icon } from "react-materialize";

import NewFileInput from '../../components/FileInput';
import DatePicker from "../../components/materialComponents/datePicker";
import Select from '../../components/materialComponents/Select';
import { InputCEP } from "./components/inputCEP";
import { InputCPF } from "./components/inputCPF";
import { InputRG } from "./components/inputRG";
import { InputTelCelular } from "./components/inputTelCelular";
import { InputTelFixo } from "./components/inputTelFixo";
import { QuestionBox } from "./components/questionBox";

import { Toast } from "../../components/toasty";

export const FormQuestion = ({
  loading,
  formFinished,
  question,
  submitError,
  handleRequestAdvance,
  handleRequestRetreat,
  handleChangeAnswer,
  COD
}) => {
  const classes = useStyles();
  const [fileNames, setFilenames] = useState([])

  const handleUploadFile = async () => {
    const arquivos = getFiles()
    const formData = makeFormData(arquivos)

    let qtdArquivos = formData.getAll('formData').length

    if(qtdArquivos === 0) return true

    let toastId = null

    formData.append('multiple', qtdArquivos > 1 ? "S" : "N")
    formData.append('cod', COD)

    try {
      toastId = Toast('Salvando arquivo...', 'wait')

      await api.post(`/form/upload/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      })

      Toast('Arquivo(s) salvo(s)', 'update', toastId, 'success')
      setFilenames([])
      return true
    } catch (err) {
      Toast('Falha ao salvar arquivo(s)', 'update', toastId, 'error')
      return false
    }
  }

  return (
    <div
      style={{
        padding: "0px 8px 0px 8px",
      }}
    >
      {whichContentDisplay(
        loading,
        formFinished,
        question,
        submitError,
        handleRequestAdvance,
        handleRequestRetreat,
        handleChangeAnswer,
        classes,
        fileNames,
        setFilenames,
        handleUploadFile
      )}
    </div>
  );
};

const whichContentDisplay = (
  loading,
  formFinished,
  question,
  submitError,
  handleRequestAdvance,
  handleRequestRetreat,
  handleChangeAnswer,
  classes,
  filenames,
  setFilenames,
  onUploadFiles
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
        onChangeAnswer={() => { }}
        onAdvance={handleRequestAdvance}
        onRetreat={() => { }}
      />
    );
  } else if (!loading && !formFinished) {
    // QUESTÃO COMUM
    return (
      <QuestionBox
        question={question.question}
        answer={returnAnswerComponent(question, classes, handleChangeAnswer, filenames, setFilenames)}
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
        onChangeAnswer={null}
        onAdvance={async () => {
          if (question.answerComponentType === 'file') {
            const res = await onUploadFiles()

            if (res === true) {
              handleRequestAdvance()
            }

          } else {
            handleRequestAdvance()
          }
        }}
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
        validation={() => true}
        validationErrorAction={() => { }}
        onChangeAnswer={() => { }}
        onAdvance={() => Toast(
          "Voce já respondeu a todas as questões do formulário",
          "success"
        )}
        onRetreat={() => Toast(
          "Não é possivel navegar de volta a um formulário já preenchido"
        )}
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

const returnAnswerComponent = (question, classes, onChangeAnswer, filenames, setFilenames) => {
  switch (question.answerComponentType) {
    case "input":
      return (
        <TextField
          autoFocus
          className={classes.TextInput}
          variant="outlined"
          label={question.slug}
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
    case "select":
      return (
        <Select
          onChange={(e) => onChangeAnswer(e.target.value)}
          label="Selecione..."
          value={question.answer}
        >
          {question.questionOptions.map(opc => (
            <MenuItem key={opc.value} value={opc.value}>{opc.label}</MenuItem>
          ))}

        </Select>
      );
    case "input muiltiline":
      return (
        <TextField
          autoFocus
          className={classes.TextInput}
          variant='outlined'
          label={question.slug}
          value={question.answer}
          onChange={(e) => onChangeAnswer(e.currentTarget.value)}

          multiline
          rowsMax={4}
        />
      );
    case "file":
      return (
        <div
          className='YAlign'
          style={{
            width: '100%',
            flex: 'unset',
            maxWidth: '250px'
          }}
        >
          <Typography variant='body1'>
            <strong>Selecione o arquivo</strong>
          </Typography>
          <NewFileInput
            ContainerStyle={{
              display: 'flex',
              flexDirection: "column",
              height: '100%',
              width: '80%',
            }}
            onChange={() => setFilenames(getFileNames(makeFormData(getFiles())))}
            multiple={question.questionOptions[0].multiple}
            name="upload"
            accept="application/pdf,image/png, image/jpeg"
            label={
              <div className="XAlign">
                <Icon>attach_file</Icon>
                ANEXAR
              </div>
            }
          />
          {filenames.length > 0 ? (
            <ul style={{ listStyleType: 'disclosure-closed', paddingLeft: '16px' }}>
              {filenames.map(filename => (
                <li key={filename} style={{ listStyleType: 'disclosure-closed' }}>
                  <Typography variant='subtitle1'>
                    {filename}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )
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

const getFiles = () => {
  //Pega todos inputs do tipo arquivos
  const arquivos = document.getElementsByClassName("files");

  return arquivos
}

const makeFormData = (htmlFileCollection) => {
  //cria um objeto do tipo formulario
  const formData = new FormData();

  //poe o conteudo de todos os inputs do tipo arquivo dentro do mesmo formulario
  for (let j = 0; j < htmlFileCollection.length; j++) {
    for (let i = 0; i < htmlFileCollection[j].files.length; i++) {
      formData.append(`formData`, htmlFileCollection[j].files[i]);
    }
  }

  return formData
}

const getFileNames = (FormData) => {
  let aux = []
  for (let i = 0; i < FormData.getAll('formData').length; i++) {
    aux.push(FormData.getAll('formData')[i].name)
  }

  return aux
}

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
