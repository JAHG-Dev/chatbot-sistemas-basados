import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Alert, Avatar, Box, Card, CardMedia, Link, Typography } from '@mui/material';

export const ChatMessage = (props) => {
  const { body, contentType, createdAt, authorAvatar, authorName, authorType, score, textCorrection, suggestions, isBot, ...other } = props;
  const [expandMedia, setExpandMedia] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: authorType === 'user'
          ? 'row-reverse'
          : 'row',
        maxWidth: 500,
        ml: authorType === 'user' ? 'auto' : 0,
        mb: 2
      }}
      {...other}>
      <Avatar
        src={authorAvatar || undefined}
        sx={{
          height: 32,
          ml: authorType === 'user' ? 2 : 0,
          mr: authorType === 'user' ? 0 : 2,
          width: 32
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Card
          sx={{
            backgroundColor: authorType === 'user'
              ? 'primary.main'
              : 'background.paper',
            color: authorType === 'user'
              ? 'primary.contrastText'
              : 'text.primary',
            px: 2,
            py: 1
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Link
              color="inherit"
              sx={{ cursor: 'pointer' }}
              variant="subtitle2"
            >
              {authorName}
            </Link>
          </Box>
          {
            score && (
              <Box sx={{ mb: 1 }}>
                <Alert severity={score > 70 ? 'success' : 'warning'}>
                  Calificación: {score}
                </Alert>
                <br />
              </Box>
            )
          }
          {
            textCorrection && (
              <Typography
                color="inherit"
                variant="body1"
              >
                Corrección: {textCorrection}
                <br />
              </Typography>
            )
          }
          {
            suggestions && (
              <>
                <Typography
                  color="inherit"
                  variant="body1"
                >
                  <br />
                  Sugerencias:
                </Typography>
                {
                  suggestions.map((suggestion, key) => (
                    <Typography
                      color="inherit"
                      variant="body1"
                      key={key}
                    >
                      {key + 1}. {suggestion}
                    </Typography>
                  ))
                }
                <br />
              </>
            )
          }
          {
            !isBot && (
              <Typography
                color="inherit"
                variant="body1"
              >
                {body}
              </Typography>
            )
          }
        </Card>
      </Box>
    </Box>
  );
};

ChatMessage.propTypes = {
  authorAvatar: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorType: PropTypes.oneOf(['contact', 'user']).isRequired,
  body: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired
};
