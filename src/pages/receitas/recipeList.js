import React from 'react'

import { RecipeListItem } from './recipeListItem'
import { makeStyles } from '@material-ui/core'

export const RecipeList = ({ Recipes, onOpenDetailsModal }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {Recipes.map((r) =>
        <RecipeListItem
          Recipe={r}
          onOpenModal={onOpenDetailsModal}
        />
      )}
    </div>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowY: 'auto',
    maxWidth: '500px',
    maxHeight: 'calc(100% - 100px)',
    background: 'unset',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: '0px 0px 4px 4px',
    borderBottom: `5px solid #000`,
    borderLeft: `1px solid #000`,
    borderRight: `1px solid #000`,
    borderTop: `1px solid #CCC`,
    paddingTop: '8px',

    '@media (max-width: 800px)': {
      maxHeight: 'calc(100% - 150px)',
    }
  }
}))