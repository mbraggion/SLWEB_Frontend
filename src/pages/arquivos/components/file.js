import React from 'react'

import { makeStyles } from "@material-ui/styles";
import { ListItem, ListItemIcon, Checkbox, Avatar, ListItemText, ListItemAvatar } from "@material-ui/core";
import { Work as WorkIcon, Image as ImageIcon, Movie as MovieIcon, Audiotrack as AudiotrackIcon, SlowMotionVideo as SlowMotionVideoIcon, MoveToInbox as MoveToInboxIcon, Description as DescriptionIcon, FormatAlignLeft as FormatAlignLeftIcon, FormatListNumbered as FormatListNumberedIcon, ContactSupport as ContactSupportIcon } from "@material-ui/icons";

import { useFiles } from '../../../hooks/useFiles'

export const File = ({ file }) => {
  const classes = useStyles();
  const {
    actions: { onMarkItem },
    data: { markedItems }
  } = useFiles()

  const handleMark = () => {
    onMarkItem(file)
  }

  return (
    <ListItem button onClick={handleMark}>
      <ListItemIcon>
        <Checkbox
          className={classes.checkbox}
          edge="start"
          checked={markedItems.map(item => item.filename).indexOf(file.filename) >= 0}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
      <ListItemAvatar>
        <Avatar>
          {whichAvatarDisplay(whichMediaType(file.filename.split(".").pop()))}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={file.filename}
        secondary={whichMediaType(file.filename.split(".").pop())}
      />
    </ListItem>
  )
}

const useStyles = makeStyles((theme) => ({
  content: {
    background: 'red',
    height: '100px',
    width: '100px',
    margin: '8px',
    padding: '8px'
  },
  checkbox: {
    transform: "scale(0.3)",
  }
}))

const whichAvatarDisplay = (type) => {
  switch (type) {
    case 'Imagem':
      return <ImageIcon color='secondary' />
    case 'Vídeo':
      return <MovieIcon color='secondary' />
    case 'Áudio':
      return <AudiotrackIcon color='secondary' />
    case 'Documento Microsoft':
      return <WorkIcon color='secondary' />
    case 'Executável':
      return <SlowMotionVideoIcon color='secondary' />
    case 'Compactado':
      return <MoveToInboxIcon color='secondary' />
    case 'Documento':
      return <DescriptionIcon color='secondary' />
    case 'Texto':
      return <FormatAlignLeftIcon color='secondary' />
    case 'Texto formatado':
      return <FormatListNumberedIcon color='secondary' />
    default:
      return <ContactSupportIcon color='secondary' />
  }
}

const whichMediaType = (type) => {
  switch (String(type).toLocaleLowerCase()) {
    //imagens
    case 'jpg':
      return 'Imagem'
    case 'jpeg':
      return 'Imagem'
    case 'png':
      return 'Imagem'
    case 'gif':
      return 'Imagem'

    //video
    case 'mp4':
      return 'Vídeo'
    case '3gp':
      return 'Vídeo'

    //audio
    case 'mp3':
      return 'Áudio'

    //microsoft
    case 'xlsx':
      return 'Documento Microsoft'
    case 'xls':
      return 'Documento Microsoft'
    case 'pptx':
      return 'Documento Microsoft'
    case 'ppt':
      return 'Documento Microsoft'
    case 'docx':
      return 'Documento Microsoft'
    case 'doc':
      return 'Documento Microsoft'
    case 'accdb':
      return 'Documento Microsoft'

    //executaveis
    case 'exe':
      return 'Executável'
    case 'msi':
      return 'Executável'

    //comprimidos
    case 'zip':
      return 'Compactado'
    case 'rar':
      return 'Compactado'

    //documentos
    case 'pdf':
      return 'Documento'

    //Textos
    case 'txt':
      return 'Texto'
    case 'log':
      return 'Texto'
    case 'logs':
      return 'Texto'

    //textos especiais
    case 'xml':
      return 'Texto formatado'
    case 'bat':
      return 'Texto formatado'
    case 'ovpn':
      return 'Texto formatado'

    default:
      return 'Outros'
  }
}