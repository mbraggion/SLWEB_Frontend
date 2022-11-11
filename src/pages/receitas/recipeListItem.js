import React from 'react';
import moment from 'moment';

import { makeStyles, Typography } from '@material-ui/core'
import { LocalCafe as LocalCafeIcon } from '@material-ui/icons'

import { RED_PRIMARY, GREY_SECONDARY } from '../../misc/colors'

export const RecipeListItem = ({ Recipe, onOpenModal }) => {
  const classes = useStyles(
    {
        color: Recipe.RecStatus === 'A' ? RED_PRIMARY : GREY_SECONDARY,
        background: 'unset',
        border: Recipe.RecStatus === 'A' ? `1px solid ${RED_PRIMARY}` : `1px solid ${GREY_SECONDARY}`
      }
  )

  return (
    <div
      className={classes.box}
      onClick={() => onOpenModal(Recipe.RecId)}
    >
      <LocalCafeIcon fontSize='large' />
      <div className={classes.infoContainer}>
        <Typography
          variant='body1'
          style={{ textAlign: 'right' }}
        >
          {Recipe.RecDesc}
        </Typography>
      </div>
    </div>
  )
}


const useStyles = makeStyles((theme) => ({
  box: props => ({
    display: 'flex',
    width: '90%',
    height: '100px',
    background: props.background,
    color: props.color,
    border: props.border,
    margin: '8px 0px',
    borderRadius: '8px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 8px',

    '&:hover': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: 'scale(1.05)',
      cursor: 'pointer',
      background: props.color,
      color: '#FFF',
      border: 'none',
    },

    '&:not(hover)': {
      transition: "150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      transform: 'scale(1)',
    }
  }),
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px 0px 0px 8px',
    height: '100%',
    justifyContent: 'flex-start',
  }
}))