import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";

import { List, Divider, ListItem, ListItemIcon, ListItemText } from "@material-ui/core/";
import Icon from '@material-ui/core/Icon';
import { ExitToApp, Help } from "@material-ui/icons/";

import { GREY_SECONDARY } from "../../misc/colors";
import { navigateTo } from "../../misc/commom_functions";

export const SidebarLinks = ({ onCloseDrawer, onOpenFiliaisModal }) => {

  const Links = JSON.parse(window.sessionStorage.getItem('links'))

  let path = useLocation().pathname

  const handleLogout = () => {
    window.sessionStorage.clear();
    navigateTo('move', "/")
  };

  return (
    <div style={{
      display: "flex",
      flex: '1',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <div style={{
        display: "flex",
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <List>
          {Links.map(sess => (
            <>
              {sess.map(lnk => whichLinkDisplay(lnk, onOpenFiliaisModal, onCloseDrawer, path))}
              <Divider />
            </>
          ))}
          <Link
            onClick={() => navigateTo('link', "/ajuda")}
            to="/ajuda"
            style={{ color: GREY_SECONDARY }}
            title="Ajuda"
          >
            <ListItem button onClick={onCloseDrawer}>
              <ListItemIcon>
                <Help />
              </ListItemIcon>

              <ListItemText primary="Ajuda" />
            </ListItem>
          </Link>

          <ListItem button onClick={handleLogout} title="Sair">
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>

            <ListItemText primary="Sair" />
          </ListItem>
        </List>
      </div>
    </div>
  )
}

const whichLinkDisplay = (link, onOpenFiliaisModal, onCloseDrawer, actualPath) => {

  if (link.Descricao === 'Filiais') {
    //se for o botão filiais

    return (
      <ListItem button onClick={onOpenFiliaisModal} title={link.Descricao}>
        <ListItemIcon>
          <Icon>{link.Icon}</Icon>
        </ListItemIcon>

        <ListItemText primary={link.Descricao} />
      </ListItem>
    )
  } else if (link.AccessLevel === 0 && window.sessionStorage.getItem('role') !== "Franquia" && window.sessionStorage.getItem('filial_logada') === 'true') {
    //se for um botão de franqueado e o adm está logado
    return (
      <Link
        onClick={() => navigateTo('link', link.Link)}
        to={link.Link}
        style={{ color: GREY_SECONDARY }}
        title={link.Descricao}
      >
        <ListItem button onClick={onCloseDrawer}>
          <ListItemIcon>
            <Icon color={String(actualPath).startsWith(link.Link) ? 'primary' : 'secondary'}>{link.Icon}</Icon>
          </ListItemIcon>

          <ListItemText primary={link.Descricao} />
        </ListItem>
      </Link>
    )
  } else if (link.AccessLevel === 0 && window.sessionStorage.getItem('role') !== "Franquia" && window.sessionStorage.getItem('filial_logada') !== 'true') {
    return null
  } else {
    return (
      <Link
        onClick={() => navigateTo('link', link.Link)}
        to={link.Link}
        style={{ color: GREY_SECONDARY }}
        title={link.Descricao}
      >
        <ListItem button onClick={onCloseDrawer}>
          <ListItemIcon>
            <Icon color={String(actualPath).includes(link.Link) ? 'primary' : 'secondary'}>{link.Icon}</Icon>
          </ListItemIcon>

          <ListItemText primary={link.Descricao} />
        </ListItem>
      </Link>
    )
  }
}