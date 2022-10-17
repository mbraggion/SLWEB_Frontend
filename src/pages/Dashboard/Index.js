import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { Fab, Grow } from '@material-ui/core';
import { Add, Close, Delete, Menu } from '@material-ui/icons';
import { Panel } from "../../components/commom_in";

import { RED_PRIMARY } from '../../misc/colors';
import { roleLevel } from '../../misc/commom_functions';
import { REACT_APP_FRANQUEADO_ROLE_LEVEL } from '../../misc/role_levels';

import { CreateNews } from './dialogs/CreateNewsDialog';
import { DeleteNewsDialog } from './dialogs/DeleteNewsDialog';
import { NewsDialog } from './dialogs/NewsDialog';
import { NewVPNModal } from './dialogs/NewsDialogNovaVPN';
import News from './News';

const Dashboard = () => {
  const [newVPNModalOpen, setNewVPNModalOpen] = useState(false)
  const [newsModalOpen, setNewsModalOpen] = useState(false)
  const [createNewsModalOpen, setCreateNewsModalOpen] = useState(false);
  const [deleteNewsModalOpen, setDeleteNewsModalOpen] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [displayedNews, setDisplayedNews] = useState(null);
  const [news, setNews] = useState([]);


  useEffect(() => {
    async function LoadNews() {
      try {
        const response = await api.get('/dashboard/news')

        setNews(response.data.News)
      } catch (err) {
      }
    }
    LoadNews();
  }, [])

  useEffect(() => {
    for (let i = 0; i < news.length; i++) {
      if (news[i].ModalPrompt === true && news[i].DtConfirmacao === null) {
        handleOpenNewsModal(news[i])
        break
      }
    }
  }, [news])

  const handleOpenCreateNewsModal = () => {
    setCreateNewsModalOpen(true)
  }

  const handleCloseCreateNewsModal = () => {
    setCreateNewsModalOpen(false)
  }

  const handleOpenDeleteNewsModal = () => {
    setDeleteNewsModalOpen(true)
  }

  const handleCloseDeleteNewsModal = () => {
    setDeleteNewsModalOpen(false)
  }

  const handleMoreOptions = () => {
    setMoreOptions(oldState => !oldState)
  }

  const handleOpenNewsModal = (news) => {
    setNewsModalOpen(true)
    setDisplayedNews(news)
  }

  const handleCloseNewsModal = async () => {
    //da um check que a noticia foi vizualizada
    if (displayedNews.ReadConfirm === true && displayedNews.DtConfirmacao === null) {
      api.post('/dashboard/news/check', {
        newsId: displayedNews.NewsId
      }).then(res => {
        setNews(oldState => {
          let aux = [...oldState]

          aux.forEach((nw, i) => {
            if (nw.NewsId === displayedNews.NewsId) {
              aux[i].DtConfirmacao = new Date()
            }
          })

          return aux
        })
      }).catch(err => {
      })
    }

    setNewsModalOpen(false)
    // setDisplayedNews(null)
  }

  const handleOpenNewVPNModal = () => {
    setNewVPNModalOpen(true)
  }

  const handleCloseNewVPNModal = async () => {    
    setNewVPNModalOpen(false)
  }

  return (
    <Panel>
      <NewVPNModal
        open={newVPNModalOpen}
        onClose={handleCloseNewVPNModal}
      />
      <NewsDialog
        open={newsModalOpen}
        onClose={handleCloseNewsModal}
        title={displayedNews === null ? '' : displayedNews.ModalHeaderTitle}
        content={displayedNews === null ? '' : displayedNews.ModalContent}
      />
      <CreateNews
        open={createNewsModalOpen}
        onClose={handleCloseCreateNewsModal}
      />
      <DeleteNewsDialog
        open={deleteNewsModalOpen}
        onClose={handleCloseDeleteNewsModal}
        News={news}
        onHandleNews={setNews}
      />
      <News
        onOpenModal={handleOpenNewsModal}
        News={news}
        onOpenNewVPNModal={handleOpenNewVPNModal}
      />
      {roleLevel() <= REACT_APP_FRANQUEADO_ROLE_LEVEL ?
        null
        :
        (
          <div
            className="YAlign"
            style={{
              position: "absolute",
              right: "16px",
              bottom: "16px",
              alignItems: "flex-end",
              zIndex: "999"
            }}
          >
            <Grow
              in={moreOptions}
              style={{ transformOrigin: '0 0 0' }}
              {...(moreOptions ? { timeout: 1000 } : {})}
            >
              <Fab
                onClick={handleOpenDeleteNewsModal}
                variant="extended"
                style={{
                  backgroundColor: '#FFF',
                  margin: '0px 0px 8px 0px',
                  color: RED_PRIMARY,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Delete />
                Apagar Notícia
              </Fab>
            </Grow>
            <Grow
              in={moreOptions}
              style={{ transformOrigin: '0 0 0' }}
              {...(moreOptions ? { timeout: 500 } : {})}
            >
              <Fab
                onClick={handleOpenCreateNewsModal}
                variant="extended"
                style={{
                  backgroundColor: '#FFF',
                  margin: '0px 0px 8px 0px',
                  color: '#0062ff',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
                <Add />
                Nova Notícia
              </Fab>
            </Grow>
            <Fab
              color={moreOptions ? "primary" : "secondary"}
              onClick={handleMoreOptions}
            >
              {moreOptions ? <Close /> : <Menu />}
            </Fab>
          </div>
        )}
    </Panel>
  )
}

export default Dashboard