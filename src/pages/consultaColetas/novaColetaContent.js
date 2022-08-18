import React, { useEffect } from 'react'
import moment from 'moment'

import { FilterList } from '@material-ui/icons'
import { Button, MenuItem, Typography, Divider, } from '@material-ui/core';

import Select from '../../components/materialComponents/Select'
import { capitalizeMonthFirstLetter } from '../../misc/commom_functions'
import { RED_PRIMARY } from '../../misc/colors'

export const NovaColetaContent = (props) => {
  const {
    equipamentos,
    detalhes,
    classes,
    handleLookForPastData,
    leituras,
    margem,
    setMargem,
    leituraDoses,
    setLeituraDoses,
    handleGravaColeta,
    zerou,
    handleChangeZerou,
    referencia,
    handleChangeReferencia,
    defaultSelected
  } = props

  useEffect(() => {
    if (typeof defaultSelected !== 'undefined') {
      handleLookForPastData(equipamentos.filter(eq => eq.EquiCod === defaultSelected)[0])
    }
    // eslint-disable-next-line
  }, [defaultSelected])

  return (
    <>
      <section className={classes.sectionRow}>
        <Select
          width="150px"
          MBottom="8px"
          MTop="8px"
          MLeft="8px"
          label="Equipamento"
          disabled={false}
          value={detalhes.EquiCod}
          onChange={(e) => handleLookForPastData(equipamentos.filter(eq => eq.EquiCod === e.target.value)[0])}
        >
          {equipamentos.map((eq) => (
            <MenuItem
              value={eq.EquiCod}
              key={eq.EquiCod}
            >
              {eq.EquiCod}
            </MenuItem>
          ))}
        </Select>
        <div
          className={classes.infoBox}
        >
          <Typography
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            {detalhes.Cliente === null ? 'Cliente' : detalhes.Cliente}
          </Typography>
          <Typography>
            {detalhes.CNPJ === null ? 'CNPJ / CPF' : detalhes.CNPJ}
          </Typography>
        </div>
      </section>
      <Divider />
      {detalhes.EquiCod !== '' ? (
        <section className={classes.sectionRow}>
          <div className={classes.infoBox}>
            <Typography
            >
              Última Coleta
            </Typography>
            <Typography
              style={{
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {detalhes.UltimaColeta === null ? '-' : moment(detalhes.UltimaColeta).format('DD/MM/YYYY')}
            </Typography>
          </div>
          <Select
            width="200px"
            MTop="8px"
            MRight="8px"
            label="Referência"
            disabled={false}
            value={referencia}
            onChange={(e) => handleChangeReferencia(e.target.value)}
          >
            <MenuItem value={moment().subtract(1, 'month').startOf('month').format()}>
              {capitalizeMonthFirstLetter(moment().subtract(1, 'month').startOf('month').format('MMMM, YYYY'))}
            </MenuItem>
            <MenuItem value={moment().startOf('month').format()}>
              {capitalizeMonthFirstLetter(moment().startOf('month').format('MMMM, YYYY'))}
            </MenuItem>
            <MenuItem value={moment().add(1, 'month').startOf('month').format()}>
              {capitalizeMonthFirstLetter(moment().add(1, 'month').startOf('month').format('MMMM, YYYY'))}
            </MenuItem>
          </Select>
        </section>
      ) : null}
      {detalhes.EquiCod !== '' ? (
        <section
          className={classes.sectionRow}
          style={{
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            alignItems: 'center',
          }}
        >
          <Select
            width="200px"
            MBottom="8px"
            MTop="8px"
            MRight="8px"
            MLeft="8px"
            label="Leitura de:"
            disabled={margem.de === null || margem.de === margem.ate ? false : true}
            value={margem.deID === null ? '' : margem.deID}
            onChange={(e) => {
              setLeituraDoses([])
              setMargem({
                de: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].DataLeitura : null,
                deID: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].LeituraId : null,
                deCont: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].Contador : null,
                ate: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].DataLeitura : null,
                ateID: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].LeituraId : null,
                ateCont: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].Contador : null,
                excluir: null
              })
            }}
          >
            {
              leituras.map((leitura) =>
                <MenuItem
                  value={leitura.LeituraId}
                  key={leitura.DataLeitura}
                >
                  {moment(leitura.DataLeitura).utc().format("DD/MM/YYYY HH:mm:ss")}
                </MenuItem>
              )
            }
          </Select>
          <Typography
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
            &#x2192;
          </Typography>
          <Select
            width="200px"
            MBottom="8px"
            MTop="8px"
            MRight="8px"
            MLeft="8px"
            label="Leitura até:"
            disabled={margem.de === null || margem.de === margem.ate ? true : false}
            value={margem.ateID === null ? '' : margem.ateID}
            onChange={(e) => {
              setLeituraDoses([])
              setMargem(oldObj => {
                return {
                  ...oldObj,
                  ate: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].DataLeitura : null,
                  ateID: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].LeituraId : null,
                  ateCont: e.target.value !== '' ? leituras.filter(leit => leit.LeituraId === e.target.value)[0].Contador : null,
                }
              })
            }
            }
          >
            {leituras.filter(leit => leit.DataLeitura !== margem.excluir).reverse().map((leitura) =>
              <MenuItem
                value={leitura.LeituraId}
                key={leitura.DataLeitura}
              >
                {moment(leitura.DataLeitura).utc().format("DD/MM/YYYY HH:mm:ss")}
              </MenuItem>
            )}
          </Select>
        </section>
      ) : null}
      {detalhes.EquiCod !== '' && margem.ate !== null && margem.de !== null ? (
        <section className={classes.sectionRow}>
          <div className={classes.infoBox}>
            <Typography
            >
              Consumo
            </Typography>
            <Typography
              style={{
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              {
                returnConsumoTotalDoses(leituras, margem, zerou, leituraDoses)
              } DOSES
            </Typography>
          </div>
          <div
            className={classes.infoBox}
            onClick={() => handleChangeZerou()}
            style={{
              maxWidth: '200px',
              backgroundColor: zerou === 'S' ? RED_PRIMARY : '#FFF',
              color: zerou === 'S' ? '#FFF' : RED_PRIMARY,
              cursor: 'pointer',
              border: zerou === 'S' ? 'none' : `1px solid ${RED_PRIMARY}`,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <FilterList />
            <div className="XAlign">
              <Typography>
                {zerou === 'S' ? 'Máquina zerada' : 'Zerar máquina'}
              </Typography>
              <Typography
                variant='subtitle2'
              >
                {zerou === 'S' ? 'Clique para reverter' : ''}
              </Typography>
            </div>
          </div>
        </section>
      ) : null}
      <Divider />
      <section
        className='YAlign'
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'flex-start'
        }}
      >
        {leituraDoses.map(leit => (
          <div
            className='XAlign'
            style={{
              width: '100%',
              justifyContent: 'space-between',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '0px 8px 1px 8px',
              borderBottom: '1px solid #CCC',
              flexWrap: 'nowrap'
            }}
            key={leit.LeituraId}
          >
            <div
              className='YAlign'
            >
              <Typography variant='subtitle1'>
                <strong
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                  {leit.Produto}
                </strong>
              </Typography>
              <Typography variant='subtitle2'>(Seleção {leit.Selecao})</Typography>
            </div>
            <div
              className='YAlign'
              style={{
                alignItems: 'flex-end',
                flexWrap: 'nowrap',
              }}
            >
              <Typography variant='subtitle1'>
                Pagas: <strong>{zerou === 'N' ? leit.Consumo.Real : leit.Real.Agr}</strong>
              </Typography>
              <Typography variant='subtitle2'>
                Teste: <strong>{zerou === 'N' ? leit.Consumo.Teste : leit.Teste.Agr}</strong>
              </Typography>
            </div>
          </div>
        ))}
      </section>
      <Divider />
      <Button
        variant='contained'
        color='primary'
        style={{
          width: '100%',
          borderRadius: '0px 0px 4px 4px',
        }}
        // disabled={leituraDoses.length === 0 || referencia === ''}
        disabled={margem.de === null || margem.ate === null || referencia === ''}
        onClick={() => handleGravaColeta()}
      >
        GRAVAR COLETA
      </Button>
    </>
  )
}

const returnConsumoTotalDoses = (leituras, margem, zerou, doses) => {
  if (zerou === 'S' && margem.ate !== null && margem.ateID !== null && margem.ateCont !== null) {
    let acumulador = 0

    doses.forEach(leit => {
      acumulador = acumulador + leit.Real.Agr
    })

    return acumulador
  }
  else {
    return (
      leituras.filter(leit => leit.LeituraId === margem.ateID)[0] && margem.ateID !== null && margem.de !== null ?
        leituras.filter(leit => leit.LeituraId === margem.ateID)[0].Contador
        :
        0)
      -
      (leituras.filter(leit => leit.LeituraId === margem.deID)[0] && margem.deID !== null && margem.ate !== null ?
        leituras.filter(leit => leit.LeituraId === margem.deID)[0].Contador
        :
        0
      )
  }
}