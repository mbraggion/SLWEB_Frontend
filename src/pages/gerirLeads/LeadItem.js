import React from 'react';
import moment from 'moment';

import {
  makeStyles,
  Typography,
  ListItem,
  ListItemText,
} from '@material-ui/core'

export const LeadItem = ({ Lead, i, onOpenModal }) => {
  const classes = useStyles()

  return (
    <>
      <ListItem
        button={true}
        onClick={() => onOpenModal(i)}
        className={classes.nested}
      >
        <ListItemText
          primary={<strong>{moment(Lead.Insercao).fromNow(false)}</strong>}
          secondary={<div style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}>
            {mountString(Lead)}
          </div>}
        />
        <Typography variant='body1' color={Lead.Filial !== null ? 'primary' : 'secondary'}>
          {Lead.Filial !== null ? Lead.Filial : 'Disponível'}
        </Typography>

      </ListItem>
    </>
  )
}


const useStyles = makeStyles((theme) => ({
  box: props => ({
    display: 'flex',
    width: '300px',
    height: '100px',
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
  },
  nested: {
    paddingLeft: theme.spacing(4),
    borderBottom: '1px solid #ccc'
  }
}))

const mountString = (dados) => {
  let variavel = ``;

  if (dados.Nome_Fantasia !== "") {
    variavel += dados.Nome_Fantasia;
  } else {
    variavel += "???";
  }

  if (dados.Municipio !== "") {
    variavel += `, ${dados.Municipio}`;
  } else {
    variavel += ", ???";
  }

  if (dados.Estado !== "") {
    variavel += ` - ${dados.Estado}`;
  } else {
    variavel += " - ???";
  }

  if (dados.AtividadeDesc !== "" && dados.AtividadeDesc !== null) {
    variavel += `, ${dados.AtividadeDesc}`;
  }

  return variavel;
};