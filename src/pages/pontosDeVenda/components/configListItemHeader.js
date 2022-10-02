import React from 'react';

import { makeStyles } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import NumberFormat from "react-number-format";

export const ConfigListItemHeader = ({ Sel, Produtos, ProdCod, TiposDeVenda, TVendaId, V1, V2, Receitas, RecId, Linha, onUpdateConfig, onRemoveConfig, Editing }) => {
  const classes = useStyles();

  return (
    <div className={classes.line}>
      <NumberFormat
        className={classes.Sel}
        value={Sel}
        placeholder='SEL.'
        type='text'
        allowNegative={false}
        allowLeadingZeros={false}
        decimalScale={0}
        onValueChange={(e) => onUpdateConfig('Sel', e.value, Linha)}
        disabled={true}
      />
      <select
        disabled={true}
        value={ProdCod}
        onChange={(e) => onUpdateConfig('ProdId', e.target.value, Linha)}
        className={classes.Prod}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          BEBIDA
        </option>
        {Produtos.map(prod => (
          <option
            className={classes.Opt}
            value={prod.ProdId}
          >
            {prod.Produto}
          </option>
        ))}
      </select>
      <select
        disabled={true}
        value={TVendaId}
        onChange={(e) => onUpdateConfig('TipoVenda', e.target.value, Linha)}
        className={classes.TV}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          VENDA
        </option>
        {TiposDeVenda.map(Tv => (
          <option
            className={classes.Opt}
            value={Tv.TveId}
          >
            {Tv.TveDesc}
          </option>
        ))}
      </select>
      <NumberFormat
        className={classes.Val}
        value=''
        placeholder='VAL. 1'
        type='text'
        allowNegative={false}
        allowLeadingZeros={false}
        allowEmptyFormatting={false}
        decimalSeparator=','
        decimalScale={2}
        fixedDecimalScale
        onValueChange={(e) => onUpdateConfig('Valor_1', e.floatValue, Linha)}
        disabled={true}
      />
      <NumberFormat
        className={classes.Val}
        value=''
        placeholder='VAL. 2'
        type='text'
        allowNegative={false}
        allowLeadingZeros={false}
        allowEmptyFormatting={false}
        decimalSeparator=','
        decimalScale={2}
        fixedDecimalScale
        onValueChange={(e) => onUpdateConfig('Valor_2', e.floatValue, Linha)}
        disabled={true}
      />
      <select
        disabled={true}
        value={RecId}
        onChange={(e) => onUpdateConfig('RecId', e.target.value, Linha)}
        className={classes.Rec}
      >
        <option
          className={classes.Opt}
          value={null}
          selected={true}
          disabled={true}
        >
          RECEITA
        </option>
        {Receitas.map(rec => (
          <option
            className={classes.Opt}
            value={rec.RecId}
            title={rec.det.map(d => `${String(d.GprdDesc).trim()} ${String(d.RdetQtd).trim()}${String(d.GprdUn).trim()}`)}
          >
            {rec.RecDesc}
          </option>
        ))}
      </select>
      <div className={classes.ButtonContainer}>
        <CloseIcon />
      </div>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
  line: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    minWidth: '500px',
    height: '40px',
    borderRadius: '20px',
    margin: '0px 0px 4px 0px',
    border: 'none'
  },
  Sel: {
    width: '100% !important',
    minWidth: '30px !important',
    maxWidth: '50px !important',
    textAlign: 'center',
    height: '100% !important',
    borderRadius: '18px 0px 0px 18px !important',
    borderBottom: 'none !important',
    fontSize: '100% !important',
  },
  Prod: {
    display: 'block',
    cursor: 'pointer',
    width: '300px',
    height: '100%',
    borderRadius: '0px',
    border: 'none',
    color: '#000 !important',
    appearance: 'media-slider !important',
  },
  Opt: {
    cursor: 'pointer'
  },
  TV: {
    display: 'block',
    cursor: 'pointer',
    width: '200px',
    height: '100%',
    borderRadius: '0px',
    border: 'none',
    color: '#000 !important',
    appearance: 'media-slider !important',
  },
  Val: {
    width: '100% !important',
    minWidth: '40px !important',
    maxWidth: '70px !important',
    height: '100% !important',
    borderRadius: '0px !important',
    padding: '0px 0px 0px 8px !important',
    borderBottom: 'none !important',
    fontSize: '100% !important',
  },
  Rec: {
    display: 'block',
    cursor: 'pointer',
    width: '200px',
    height: '100%',
    border: 'none',
    color: '#000 !important',
    appearance: 'media-slider !important',
  },
  ButtonContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '0px 18px 18px 0px !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'transparent',
    cursor: 'pointer'
  }
}));
