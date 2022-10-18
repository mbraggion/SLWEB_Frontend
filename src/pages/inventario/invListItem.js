import React from 'react'

import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, ListItemText, makeStyles } from '@material-ui/core'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

export const InvListItem = ({ InvItem, expandedId, onExpandProd }) => {
  const classes = useStyles()

  return (
    <Accordion
      expanded={expandedId === InvItem.ProdId}
      TransitionProps={{ unmountOnExit: true }}
      onClick={() => onExpandProd(InvItem.ProdId)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} >
        <ListItemText
          primary={InvItem.Produto}
          secondary={`Em estoque: ${InvItem.InvQtd}`}
        />

      </AccordionSummary>
      <AccordionDetails className={classes.details}>


      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small">
          Cancel
        </Button>
        <Button size="small" color="primary">
          Save
        </Button>
      </AccordionActions>
    </Accordion>
  )
}

const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  details: {
    alignItems: 'center',
  },
}));