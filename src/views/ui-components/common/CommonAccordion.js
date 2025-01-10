import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CommonAccordion = ({expandIcon=<ExpandMoreIcon />, defaultExpanded=false, title, content}) => {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary
        expandIcon={expandIcon}
        aria-controls='panel1-content'
        id='panel1-header'
      >
        <Typography component='span'>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {content}
      </AccordionDetails>
    </Accordion>
  );
};

export default CommonAccordion