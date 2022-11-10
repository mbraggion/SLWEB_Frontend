import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format'
import { api } from '../../../services/api'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  useMediaQuery,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core/';
import {
  useTheme,
  withStyles,
  makeStyles
} from '@material-ui/core/styles';
import {
  Close as CloseIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import { Toast } from '../../../components/toasty'

export const NewRecipeModal = ({ open, onClose, onUpdateRecipesArray, GrupoInsumo }) => {
  const classes = useStyles()
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  const [newRecipeName, setNewRecipeName] = useState('')
  const [newRecipe, setNewRecipe] = useState(NEW_RECIPE_INITIAL_STATE)
  const [wait, setWait] = useState(false)

  const handleClose = () => {
    onClose();
    handleReset();
  }

  const handleReset = () => {
    setNewRecipe(NEW_RECIPE_INITIAL_STATE)
  }

  const handleSave = async () => {
    setWait(true)

    let toastId = null

    toastId = Toast('Criando receita...', 'wait')

    try {
      const response = await api.post('', {
        recipeName: newRecipeName,
        recipeDetails: newRecipe
      })

      Toast('Receita criada com sucesso', 'update', toastId, 'success')
      setWait(false)
      handleClose()

      onUpdateRecipesArray(oldState => ([
        {
          RecId: response.data.id,
          RecDesc: newRecipeName,
          RecStatus: 'A'
        }, ...oldState
      ]))

      handleReset()
    } catch (err) {
      Toast('Falha ao cadastrar receita', 'update', toastId, 'error')
      setWait(false)
    }
  }


  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        onClose={handleClose}
      >
        Cadastrar nova receita
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          className={classes.recipeName}
          label="Nome da receita"
          variant="standard"
          disabled={wait}
          value={newRecipeName}
          onChange={e => setNewRecipeName(e.target.value)}
        />
        <section className={classes.detContainer}>

          {newRecipe.map((det, i) => (
            <div className={classes.detLine}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id={`demo-simple-select-outlined-label-${det.RecId}`}>Produto</InputLabel>
                <Select
                  labelId={`demo-simple-select-outlined-label-${det.RecId}`}
                  id={`demo-simple-select-outlined-${det.RecId}`}
                  value={det.GrupoProduto}
                  onChange={e => setNewRecipe(oldState => {
                    let aux = [...oldState]

                    aux[i].GrupoProduto = e.target.value

                    return aux
                  })}
                  label="Produto"
                  disabled={wait}
                >
                  <MenuItem value={null}>
                    <em>Selecione...</em>
                  </MenuItem>
                  {GrupoInsumo.map(GI => (
                    <MenuItem value={GI.GprdId}>{GI.GprdDesc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <NumberFormat
                className={classes.qtdInput}
                value={det.Qtd}
                placeholder='Qtd.'
                type='text'
                prefix={GrupoInsumo.filter(GI => GI.GprdId === det.GrupoProduto).length > 0 ? 'R$' : ''}
                isNumericString
                allowNegative={false}
                allowLeadingZeros={true}
                decimalScale={4}
                onValueChange={e => setNewRecipe(oldState => {
                  let aux = [...oldState]

                  aux[i].Qtd = e.target.value

                  return aux
                })}
                disabled={wait}
                style={{
                  fontWeight: 'bold'
                }}
              />
            </div>
          ))}
        </section>
      </DialogContent>

      <DialogActions>
        <Button
          disabled={wait}
          onClick={handleReset}
          color="secondary"
          startIcon={<CloseIcon />}
        >
          Limpar
        </Button>
        <Button
          disabled={wait}
          onClick={handleSave}
          color="primary"
          startIcon={<SaveIcon />}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(theme => ({
  recipeName: {
    width: '100%',
    marginBottom: '16px',

    '&:nth-child(1) > div > input': {
      marginLeft: '8px'
    }
  },
  detContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  detLine: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #CCC'
  },
  formControl: {
    margin: '8px 0px',
    minWidth: '200px',
  },
  select: {

  },
  qtdInput: {
    width: '70px !important',
    height: '25px !important',
    textAlign: 'end',
    fontSize: '16px !important'
  }
}))

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: '300px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const NEW_RECIPE_INITIAL_STATE = [
  {
    GrupoProduto: null,
    Qtd: 0,
  }
]
