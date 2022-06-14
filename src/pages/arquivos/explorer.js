import React from 'react'

import { makeStyles } from "@material-ui/core/styles";

import { FolderList } from './components/folderList'
import { FileList } from './components/fileList'

export const Explorer = ({ Arquivos, Pastas }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <FolderList
        folderList={Pastas}
      />
      <FileList
        fileList={Arquivos}
      />
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    maxHeight: 'calc(100% - 64px)',
    // maxHeight: 'calc(100% - 100px)',
    background: 'unset',
    overflowY: 'auto',
    overflowX: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0px 0px 4px 4px',
    borderBottom: `5px solid #000`,
    borderLeft: `1px solid #000`,
    borderRight: `1px solid #000`,
    borderTop: `1px solid #CCC`,
    paddingTop: '8px'
  }
}))