import React from "react";

import Loading from "../../components/loading_screen";

import { Panel } from "../../components/commom_in";

import { InfoContainer } from './infoContainer';
import { ReceitaModal } from './modals/detalhesReceitaModal';
import { MovimentoModal } from './modals/gravarMovimentoModal';
import { Options } from './options';

import { useConsumo } from '../../hooks/useConsumo';

function ApontaConsumo() {
  const { uiControl: { loaded } } = useConsumo()

  return !loaded ? (
    <Loading />
  ) : (
    <Panel style={{ flexWrap: 'nowrap' }}>
      <ReceitaModal />
      <MovimentoModal />
      <Options />
      <InfoContainer />
    </Panel>
  );
}

export default ApontaConsumo;
