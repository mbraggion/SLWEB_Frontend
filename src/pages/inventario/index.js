import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

import { makeStyles } from '@material-ui/core';

import { Panel } from "../../components/commom_in";
import Loading from "../../components/loading_screen";
import { DepositosList } from './depList';
import { InventarioContainer } from './invContainer';

export default function Inventario() {
  const [loaded, setLoaded] = useState(false);
  const [depositos, setDepositos] = useState([])
  const [selectedDep, setSelectedDep] = useState(null)

  const classes = useStyles();

  const LoadData = async () => {
    try {
      const response = await api.get("/deposits");

      setLoaded(true);
      setDepositos(response.data.depositos)
    } catch (err) {
    }
  }

  useEffect(() => {
    LoadData();
  }, []);

  const handleSelectDeposito = (DepId) => {
    setSelectedDep(depositos.filter(dep => dep.DepId === DepId)[0])
  }

  return !loaded
    ? (
      <Loading />
    )
    : (
      <Panel>
        <div className={classes.root}>
          <DepositosList
            Depositos={depositos}
            onSelectDeposito={handleSelectDeposito}
            SelectedDepId={selectedDep !== null ? selectedDep.DepId : null}
          />
          <InventarioContainer
            selectedDepId={selectedDep !== null ? selectedDep.DepId : null}
            selectedDepName={selectedDep !== null ? selectedDep.DepNome : null}
            onChangeSelectedDep={setSelectedDep}
          />
        </div>
      </Panel>
    );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
}));