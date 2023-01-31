import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import { api } from '../../../services/api'

import { CircularProgress, makeStyles, Typography, IconButton } from '@material-ui/core'

import { RaspyItem } from './RaspyItem'
import { RED_PRIMARY, RED_SECONDARY } from '../../../misc/colors'
import ExcelLogo from '../../../assets/svg/EXCEL.svg'
import { Toast } from '../../../components/toasty'

export const RaspyList = ({ Equip, selectedAnx, margemSelecionada, selectedAnxName, isFetching }) => {
  const [expandedSel, setExpandedSel] = useState(null)
  const classes = useStyles()

  const handleExpandSel = (sel) => {
    setExpandedSel(oldState => oldState === sel ? null : sel)
  }

  const handleGenExcel = async () => {
    let toastId = null
    toastId = Toast('Gerando Excel...', 'wait')

    try {
      const response = await api.get(`/raspy/excel/${selectedAnx}/${margemSelecionada.de}/${margemSelecionada.ate}`, {
        responseType: 'arraybuffer'
      });

      Toast('Excel exportado sucesso!', 'update', toastId, 'success')
      
      const blob = new Blob([response.data], { type: "application/octet-stream" });

      saveAs(blob, `Vendas ${String(selectedAnxName).trim()}.xlsx`);
    } catch (err) {
      Toast('Falha ao exportar Excel', 'update', toastId, 'error')
    }
  }

  const whichContentShow = () => {
    if (isFetching) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}
        >
          <CircularProgress />
        </div>
      )
    } else {
      return (
        <section className={classes.root}>
          {Equip.EquiCod
            ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  width: '100%',
                  backgroundImage: `linear-gradient(to top right, ${RED_PRIMARY}, ${RED_SECONDARY})`,
                  color: '#FFF',
                  padding: '8px 0px 8px 8px',
                  margin: '16px 0px 0px 0px',
                  borderRadius: '4px 4px 0px 0px',
                  boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)'
                }}
              >
                <Typography variant='h6'>Equipamento: {Equip?.EquiCod}</Typography>

                <IconButton
                  style={{
                    backgroundColor: '#FFF',
                    marginRight: '8px'
                  }}
                  onClick={handleGenExcel}
                >
                  <img
                    src={ExcelLogo}
                    width='23px'
                    height='23px'
                    alt='Excel Icon'
                  />
                </IconButton>
              </div>
            )
            : null}
          {Equip?.Selecoes?.map(s =>
            <RaspyItem
              Selecao={s}
              expandedSel={expandedSel}
              onExpandSel={handleExpandSel}
            />
          )}
        </section>
      )
    }
  }

  return whichContentShow()
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: '100%',
    background: 'rgba(0,0,0,0.08)',
    margin: '0px 0px 8px 0px'
  }
}));
