import React, { useState, useEffect } from "react";
import { api } from "../../services/api";

import { Button, Paper, InputBase, Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { MarkunreadMailbox as MarkunreadMailboxIcon, Close as CloseIcon } from '@material-ui/icons'

//import de elementos visuais
import { convertData } from "../../misc/commom_functions";
import { Panel } from "../../components/commom_in";
import { Table } from "../../components/table";
import Loading from "../../components/loading_screen";

import { DispatchEmailsModal } from './modals/DispararEmailsModal'

const CentralEmails = () => {
  const classes = useStyles()
  const [emailHistory, setEmailHistory] = useState([]);

  const [filterWord, setFilterWord] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [dispararEmailsModalOpen, setDispararEmailsModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get("/emails/history");

        setLoaded(true);
        setEmailHistory(response.data.History)
      } catch (err) {
      }

    }
    loadData();
  }, [])

  const handleOpenDispararEmailsModal = () => {
    setDispararEmailsModalOpen(true)
  }

  const handleCloseDispararEmailsModal = () => {
    setDispararEmailsModalOpen(false)
  }

  return !loaded ? (
    <Loading />
  ) : (
    <>
      <DispatchEmailsModal
        open={dispararEmailsModalOpen}
        onClose={handleCloseDispararEmailsModal}
      />

      <Panel>
        <div
          style={{
            display: "flex",
            flexDirection: 'column',
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: 'flex-start',
            flexWrap: "nowrap",
          }}
        >
          <div
            className="YAlign"
            style={{
              flex: "unset",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Paper component="form" className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="Buscar cliente"
                inputProps={{ 'aria-label': 'buscar cliente' }}
                onChange={e => {
                  setFilterWord(e.target.value)
                }}
                value={filterWord}
                disabled={false}
              />
              <Tooltip
                title={
                  <label
                    style={{
                      fontSize: "14px",
                      color: "#FFF",
                      lineHeight: "20px"
                    }}
                  >
                    Limpar filtro
                  </label>
                }
                placement="right"
                arrow={true}
              >
                <IconButton
                  className={classes.iconButton}
                  aria-label="directions"
                  color="secondary"
                  onClick={() => {
                    setFilterWord('')
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Paper>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleOpenDispararEmailsModal}
              startIcon={<MarkunreadMailboxIcon />}
              style={{
                margin: '8px 0px 8px 0px'
              }}
            >
              Disparar emails
            </Button>
          </div>
          <Table width="100">
            <thead>
              <tr>
                <th>Data de Envio</th>
                <th>Filial</th>
                <th>Modelo</th>
                <th>Origem</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory(emailHistory, filterWord).map((reg) => (
                <tr key={`${reg.DataOcor}${reg.A1_GRPVEN}`}>
                  <td>{convertData(reg.DataOcor)}</td>
                  <td>{reg.M0_CODFIL}</td>
                  <td>{reg.msg}</td>
                  <td>{reg.origem}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Panel>
    </>
  );
}

export default CentralEmails

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

const filteredHistory = (history, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  if (filterString.trim() === '') {
    return history
  } else {
    return history.filter(hist =>
      String(hist.Email).trim().toLowerCase().match(re) ||
      String(hist.M0_CODFIL).trim().toLowerCase().match(re) ||
      String(hist.msg).trim().toLowerCase().match(re) ||
      String(hist.origem).trim().toLowerCase().match(re)
    )
  }
}