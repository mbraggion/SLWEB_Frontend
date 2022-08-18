import React from 'react';
import moment from 'moment';

import { makeStyles, Typography } from '@material-ui/core'
import { HomeWork } from '@material-ui/icons'

import { RED_PRIMARY, GREY_SECONDARY } from '../../misc/colors'

export const PdvItem = ({ PDV, i, onOpenModal }) => {
  const classes = useStyles({
    color: PDV.PdvStatus === 'A' ? RED_PRIMARY : GREY_SECONDARY,
    background: 'unset',
    border: PDV.PdvStatus === 'A' ? `1px solid ${RED_PRIMARY}` : `1px solid ${GREY_SECONDARY}`
  })

  return (
    <div
      className={classes.box}
      onClick={() => onOpenModal(i)}
    >
      <HomeWork fontSize='large' />
      <Typography
        variant='body1'
        style={{ textAlign: 'center' }}
      >
        Cliente: {PDV.AnxDesc}
      </Typography>
      <Typography
        variant='body2'
      >
        Ativo: {PDV.EquiCod}
      </Typography>
      <Typography
        variant='body2'
      >
        Inclusão: {moment(PDV.PdvDataAtivacao).format('DD/MM/YYYY')}
      </Typography>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
  box: props => ({
    display: 'flex',
    width: '250px',
    height: '250px',
    background: props.background,
    color: props.color,
    border: props.border,
    margin: '8px 0px',
    borderRadius: '8px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

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
}))