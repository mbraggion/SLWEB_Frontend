import React, { useState } from 'react'

import { makeStyles, TextField } from '@material-ui/core'
import Datepicker from '../../../components/materialComponents/datePicker'
import { InputNumber } from '../components/inputCNPJ'
import { InputTel } from '../components/inputTel'

export const Contrato = ({ contract }) => {
  const classes = useStyles()

  const [allowEdit, setAllowEdit] = useState(false)

  return (
    <div className={classes.container}>
      <div className={classes.linha}>
        <TextField
          value={contract.ConId}
          onChange={() => { }}
          disabled={true}
          label='Contrato'
        />
        <TextField
          value={contract.Nome_Fantasia}
          onChange={() => { }}
          disabled={true}
          label='Cliente'
        />
      </div>
      <div className={classes.linha}>
        <InputNumber
          value={contract.CNPJ}
          onChange={() => { }}
          disabled={true}
          className={classes.numberInput}
          label={'CNPJ'}
          Tipo={'CNPJ'}
        />
      </div>
      <div className={classes.linha}>
        <Datepicker
          min={false}
          onChange={() => { }}
          disabled={!allowEdit}
          label={'Data de início'}
          defaultValue={contract.Dt_Inicio}
        />
        <Datepicker
          min={false}
          onChange={() => { }}
          disabled={!allowEdit}
          label={'Data de encerramento'}
          defaultValue={contract.Dt_Fim}
        />
      </div>
      <div className={classes.linha}>
        <TextField
          value={contract.Contato_Empresa}
          onChange={() => { }}
          disabled={true}
          label='Contato'
        />
        <InputTel
          value={contract.Contato2}
          onChange={() => { }}
          disabled={!allowEdit}
          className={classes.telInput}
          label={'Telefone para contato'}
        />
      </div>
      <div className={classes.linha}>
        <TextField
          value={contract.Email}
          onChange={() => { }}
          disabled={true}
          label='Email'
        />
      </div>
      <div className={classes.linha}>
        <TextField
          value={contract.Contato_Empresa_2}
          onChange={() => { }}
          disabled={true}
          label='Contato'
        />
        <InputTel
          value={contract.Fone_2}
          onChange={() => { }}
          disabled={!allowEdit}
          className={classes.telInput}
          label={'Telefone para contato'}
        />
      </div>
      <div className={classes.linha}>
        <TextField
          value={contract.Email_2}
          onChange={() => { }}
          disabled={true}
          label='Email'
        />
      </div>

    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  linha: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  numberInput: {
    width: '100%'
  },
  telInput: {

  }
}))