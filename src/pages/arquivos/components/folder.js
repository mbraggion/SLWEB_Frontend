import React from "react";

import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import { FolderOpen as FolderOpenIcon, KeyboardReturn as KeyboardReturnIcon, FolderShared as FolderSharedIcon, Delete as DeleteIcon, PermMedia as PermMediaIcon } from '@material-ui/icons'

import { useFiles } from '../../../hooks/useFiles'

export const Folder = ({ type, folder }) => {
  const classes = useStyles();
  const {
    actions: { onNavigate, onNavigateBackwards }
  } = useFiles()

  const handleOpen = async () => {
    if (type === 'folder') {
      await onNavigate(encodeURI(folder.path))
    } else {
      onNavigateBackwards()
    }
  }

  // const handleDelete = async () => {
  //   alert('apagar pasta')
  // }

  return (
    <div className={classes.content} onClick={handleOpen}>
      {whichIconDisplay(type, folder)}
      <Typography
        className={classes.label}
        variant='caption'>
        {folder.folder}
      </Typography>
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: '#ccc',
    height: '100px',
    width: '200px',
    margin: '8px',
    padding: '8px',
    flexShrink: 0,
    borderRadius: '4px',
    border: '1px solid #333',
    transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",

    '&:hover': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      cursor: 'pointer',
      background: '#333',
      color: '#ccc'
    }
  },
  label: {
    textAlign: 'center',
  }
}))

const whichIconDisplay = (type, folder) => {
  if (type === 'empty') {
    return <KeyboardReturnIcon style={{ fontSize: 40 }} />
  } else if (folder.folder === 'Franqueado') {
    return <FolderSharedIcon style={{ fontSize: 40 }} />
  } else if (folder.folder === 'Lixeira') {
    return <DeleteIcon style={{ fontSize: 40 }} />
  } else if (folder.folder === 'SL CAFES') {
    return <PermMediaIcon style={{ fontSize: 40 }} />
  } else {
    return <FolderOpenIcon style={{ fontSize: 40 }} />
  }
}