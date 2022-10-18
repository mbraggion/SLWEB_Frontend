import React, { useState, useEffect } from "react";

//Meio de comunicação
import { api } from "../../services/api";

//"Placeholder" da página enquanto dados são carregados no
import Loading from "../../components/loading_screen";

//import de elementos visuais
import { Panel } from "../../components/commom_in";
// import { Toast } from "../../components/toasty";

import { PdvList } from './pdvList'
import { PdvListOptions } from './options'
import { DetailsModal } from './modals/detailsModal'

const PontosDeVenda = ({ match }) => {
  const [loaded, setLoaded] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [PDVs, setPDVs] = useState([]);
  const [targetPDV, setTargetPDV] = useState({ pdv: null, anx: null });
  const [filtro, setFiltro] = useState('');
  const [mostrarInativos, setMostrarInativos] = useState(false);

  //componentDidMount
  useEffect(() => {
    async function LoadData() {
      try {
        //requisição inicial para obter dados essenciais da pagina
        const response = await api.get("/pontosdevenda");

        setPDVs(response.data.PDVs);

        setLoaded(true);

        if (match.params.ativo !== null && typeof match.params.ativo !== 'undefined') {
          setFiltro(String(match.params.ativo))
          // setMostrarInativos(true)
        }
      } catch (err) { }
    }

    LoadData();
    // eslint-disable-next-line
  }, []);

  const handleOpenDetailsModal = (index) => {
    setTargetPDV({
      pdv: returnPDVsFilter(PDVs, mostrarInativos, filtro)[index].PdvId,
      anx: returnPDVsFilter(PDVs, mostrarInativos, filtro)[index].AnxId
    })
    setDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false)
    setTargetPDV({ pdv: null, anx: null })
  }

  return !loaded
    ? <Loading />
    :
    <Panel style={{ justifyContent: 'flex-start' }}>
      <DetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetailsModal}
        PdvId={targetPDV.pdv}
        AnxId={targetPDV.anx}
        EquiCod={
          returnPDVsFilter(PDVs, mostrarInativos, filtro).filter(pdv => pdv.PdvId === targetPDV.pdv && pdv.AnxId === targetPDV.anx).length > 0
            ? returnPDVsFilter(PDVs, mostrarInativos, filtro).filter(pdv => pdv.PdvId === targetPDV.pdv && pdv.AnxId === targetPDV.anx)[0].PdvStatus
            : null
        }
        updatePDVsArray={setPDVs}
        PdvStatus={
          returnPDVsFilter(PDVs, mostrarInativos, filtro).filter(pdv => pdv.PdvId === targetPDV.pdv && pdv.AnxId === targetPDV.anx).length > 0
            ? returnPDVsFilter(PDVs, mostrarInativos, filtro).filter(pdv => pdv.PdvId === targetPDV.pdv && pdv.AnxId === targetPDV.anx)[0].PdvStatus
            : 'I'
        }
      />
      <PdvListOptions
        onChangeFiltro={setFiltro}
        mostrarInativos={mostrarInativos}
        switchInativos={setMostrarInativos}
        defaultTarget={match.params.ativo}
      />
      <PdvList
        PDVs={returnPDVsFilter(PDVs, mostrarInativos, filtro)}
        onOpenModal={handleOpenDetailsModal}
      />
    </Panel>
}

export default PontosDeVenda;

const returnPDVsFilter = (pdvs, shouldShowInactive, filterString) => {
  var re = new RegExp(filterString.trim().toLowerCase())

  return pdvs.filter(pdv => {
    if (shouldShowInactive) {
      return true
    } else if (!shouldShowInactive && pdv.PdvStatus === 'A') {
      return true
    } else {
      return false
    }
  }).filter(pdv => {
    if (filterString.trim() === '') {
      return true
    } else if (filterString.trim() !== '' && (
      pdv.AnxDesc.trim().toLowerCase().match(re) || pdv.EquiCod.trim().toLowerCase().match(re)
    )) {
      return true
    } else {
      return false
    }
  })
}
