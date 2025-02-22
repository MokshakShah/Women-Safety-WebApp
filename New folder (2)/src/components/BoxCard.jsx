import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './BoxCard.css'; // Create a BoxCard.css for styling

function BoxCard({ title, content }) {
  return (
    <Card className="box-card">
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        {content}
      </CardContent>
    </Card>
  );
}

export default BoxCard;
