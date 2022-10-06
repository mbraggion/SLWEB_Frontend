import moment from 'moment'
import React from 'react'

import { makeStyles, Typography } from '@material-ui/core'
import { Description as DescriptionIcon } from '@material-ui/icons'

import { RED_PRIMARY } from '../../misc/colors'
import { maskCNPJ } from '../../misc/commom_functions'

export const ContractListItem = ({ contract, onOpenModal }) => {
  const classes = useStyles({
    color: RED_PRIMARY,
    background: 'unset',
    border: `1px solid ${RED_PRIMARY}`
  })

  return (
    <div
      className={classes.box}
      onClick={() => onOpenModal(contract)}
    >
      <DescriptionIcon fontSize='large' />
      <div className={classes.infoContainer}>
      <Typography
          variant='body1'
          style={{ textAlign: 'right' }}
        >
          {String(contract.Nome_Fantasia).trim()}
        </Typography>
        <Typography
          variant='body2'
          style={{ textAlign: 'right' }}
        >
          {maskCNPJ(String(contract.CNPJ).trim())}
        </Typography>
        <Typography
          variant='body2'
          style={{ textAlign: 'right' }}
        >
          Cadastro: {contract.Dt_Inicio !== null ? moment(contract.Dt_Inicio).format('DD/MM/YYYY') : 'Desconhecido'}
        </Typography>
        <Typography
          variant='subtitle2'
          style={{ textAlign: 'right' }}
        >
          Contrato: {contract.ConId}
        </Typography>
      </div>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  box: props => ({
    display: 'flex',
    width: '300px',
    height: '120px',
    background: props.background,
    color: props.color,
    border: props.border,
    margin: '8px 0px',
    borderRadius: '8px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 8px 0px 8px',

    '&:hover': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: 'scale(1.05)',
      cursor: 'pointer',
      background: props.color,
      color: '#FFF',
      border: 'none',
    },

    '&:not(hover)': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: 'scale(1)',
    }
  }),
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px 0px 0px 8px',
    height: '100%',
    justifyContent: 'flex-start',
  }
}))