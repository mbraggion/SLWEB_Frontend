import React from 'react';
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, CardContent, Button, Typography, } from '@material-ui/core';
import { Launch as LaunchIcon } from '@material-ui/icons'

import { maskCNPJ } from '../../misc/commom_functions'


export const FranquiaItem = ({ Franquia, onOpenDetailsModal }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="elevation">
      <div
        style={{
          width: '100%',
          height: '4px',
          background: Franquia.Inatv === 'S' ? 'red' : 'green'
        }}
      />
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Filial <strong>{Franquia.M0_CODFIL}</strong>
        </Typography>
        <Typography className={classes.ellipsis} variant="h5" component="h2">
          {Franquia.NREDUZ}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {Franquia.GrupoVenda}
        </Typography>
        <Typography variant="body2" component="p">
          <strong>Grupo de Venda:</strong> {Franquia.A1_GRPVEN}
          <br />
          <strong>Cod TOTVs:</strong> {Franquia.A1_COD}
          <br />
          <strong>CNPJ:</strong> {maskCNPJ(Franquia.M0_CGC)}
          <br />
          <strong>UF:</strong> {Franquia.UF}
          <br />
          <strong>Data de Cadastro:</strong> {Franquia.DtCadastro !== null ? moment(Franquia.DtCadastro).format('L') : "Desconhecida"}
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          endIcon={<LaunchIcon />}
          onClick={() => onOpenDetailsModal(Franquia.A1_GRPVEN)}
        >
          Ver mais
        </Button>
      </CardActions>
    </Card>
  )
}

const useStyles = makeStyles({
  root: {
    width: '300px',
    height: '300px',
    margin: '8px 0px'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  ellipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
});