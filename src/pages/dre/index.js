import { saveAs } from 'file-saver';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { makeStyles } from '@material-ui/styles';

import { Despesas } from './components/despesas';
import { DespesasVariaveis } from './components/despesasVariaveis';
import { Options } from './components/options';
import { Resumo } from './components/resumo';

import { Panel } from '../../components/commom_in';
import Loading from '../../components/loading_screen';
import { Toast } from '../../components/toasty';

const DRE = () => {
  const classes = useStyles()

  const [loaded, setLoaded] = useState(true)
  const [selRef, setSelRef] = useState('')
  const [refs, setRefs] = useState([])
  const [dre, setDre] = useState([])
  const [dov, setDov] = useState([])

  const mes = moment(selRef).add(3, 'hours').month() + 1
  const ano = moment(selRef).add(3, 'hours').month() === 0 ? moment(selRef).year() + 1 : moment(selRef).year()

  const handleUpdateSelectedRef = (selref) => {
    setSelRef(selref)
  }

  const handleAddNewDOVLine = () => {
    let nextId = 1

    dov.forEach(item => {
      if (item.DOVCod >= nextId) {
        nextId = Number(item.DOVCod) + 1
      }
    })

    setDov(oldState => ([
      ...oldState,
      {
        GrpVen: null,
        DOVRef: null,
        DOVCod: nextId,
        DOVDesc: "Nova Despesa",
        DOVTipo: null,
        DOVVlr: 0
      }
    ]))
  }

  const handleUpdateLineDre = (lineID, lineValue, linePercentage) => {
    setDre(oldState => {
      let aux = [...oldState]

      aux.forEach((l, i) => {
        if (l.DreCod === lineID) {
          aux[i] = {
            ...aux[i],
            DreVlr: Number(lineValue),
            DrePorc: linePercentage
          }
        }
      })

      return aux
    })
  }

  const handleUpdateLineDov = (lineID, lineValue, lineDesc) => {
    setDov(oldState => {
      let aux = [...oldState]

      aux.forEach((l, i) => {
        if (l.DOVCod === lineID) {
          aux[i] = {
            ...aux[i],
            DOVVlr: Number(lineValue),
            DOVDesc: lineDesc
          }
        }
      })

      return aux
    })
  }

  const syncChangesDre = async (lineID, lineValue, linePercentage) => {
    api.put('/dre', {
      ano: ano,
      mes: mes,
      cod: lineID,
      vlr: Number(lineValue),
      porc: linePercentage
    }).then(response => {
      setDre(response.data.DRE)
      setDov(response.data.DOV)
    }).catch(err => {
      setDre(err.response.data.DRE)
      setDov(err.response.data.DOV)
    })
  }

  const syncChangesDov = async (lineID, lineValue, lineDesc) => {
    api.put('/dov', {
      ano: ano,
      mes: mes,
      cod: lineID,
      vlr: Number(lineValue),
      desc: lineDesc
    }).then(response => {
      setDre(response.data.DRE)
      setDov(response.data.DOV)
    }).catch(err => {
      setDre(err.response.data.DRE)
      setDov(err.response.data.DOV)
    })
  }

  const loadRefs = async () => {
    try {
      const response = await api.get(`/dre/referencia`)

      setRefs(response.data.Referencias)
    } catch (err) {
      setRefs([])
    }
  }

  const loadData = async (ano, mes) => {
    setLoaded(false)
    try {
      const response = await api.get(`/dre/${ano}/${mes}`)

      setDre(response.data.DRE)
      setDov(response.data.DOV)
      setLoaded(true)
    } catch (err) {
      setLoaded(true)
      setDre([])
      setDov([])
      setSelRef('')
    }
  }

  const handleSubmit = async () => {
    alert('qualquer coisa')
  }

  const handleDownloadExcel = async (type) => {
    let toastId = null
    toastId = Toast('Gerando excel...', 'wait')

    try {
      if (type === 'DRE') {
        const response = await api.get(
          `/dre/excel/dre/${ano}/${mes}`,
          {
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: 'application/octet-stream' });

        saveAs(blob, `DRE_${ano}_${mes}.xlsx`);

        Toast('Excel recebido!', 'update', toastId, 'success')
      } else if (type === 'BASE') {
        const response = await api.get(
          `/dre/excel/baseroy/${ano}/${mes}`,
          {
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], { type: 'application/octet-stream' });

        saveAs(blob, `Base Royalties_${ano}_${mes}.xlsx`);

        Toast('Excel recebido!', 'update', toastId, 'success')
      } else {
        throw new Error()
      }
    } catch (err) {
      Toast('Falha ao gerar excel', 'update', toastId, 'error')
    }
  }

  useEffect(() => {
    loadRefs()
  }, [])

  useEffect(() => {
    if (selRef !== '') {
      loadData(ano, mes)
    }
  }, [selRef, ano, mes])

  return !loaded
    ? <Loading />
    : (
      <Panel className={classes.panelMob}>
        <div className='YAlign' style={{ height: '100%', width: '100%', flexWrap: 'nowrap', justifyContent: 'flex-start' }}>
          <div className='XAlign' style={{ alignItems: 'flex-start' }}>
            <section className={classes.barraDeBotoes}>
              <Options
                onChange={handleUpdateSelectedRef}
                selectedRef={selRef}
                refList={refs}
                onReload={loadData}
                onSave={handleSubmit}
                onDownloadExcel={handleDownloadExcel}
              />
            </section>
            <section className={classes.metadinha}>
              <Resumo
                Res={dre.filter(d => d.DreCod < 23 || d.DreCod === 35)}
              />
            </section>
            <section className={classes.metadinha}>
              <Despesas
                Des={dre.filter(d => d.DreCod > 22 && d.DreCod !== 35)}
                onChangeValue={handleUpdateLineDre}
                onUpdateLine={syncChangesDre}
                pRef={dre.filter(d => d.DreCod === 1)[0]?.DreVlr}
                editavel={Math.abs(moment(selRef).add(3, 'hours').diff(moment().startOf('month'), 'months')) < 2}
              />
              <DespesasVariaveis
                DesV={dov}
                onAddNewLine={handleAddNewDOVLine}
                AllowAddNewLine={selRef !== ''}
                onChangeValue={handleUpdateLineDov}
                onUpdateLine={syncChangesDov}
                editavel={Math.abs(moment(selRef).add(3, 'hours').diff(moment().startOf('month'), 'months')) < 2}
              />
            </section>
          </div>
        </div>
      </Panel>
    )
}

export default DRE

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  metadinha: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '50%',
    minWidth: '300px',
    height: 'auto',

    '@media (max-width: 900px)': {
      width: '100%',
    }
  },
  barraDeBotoes: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  }
}))