import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Alert, Avatar, Box, Button, Card, CardMedia, Link, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import TranslateIcon from '@mui/icons-material/Translate';

export const ChatMessage = (props) => {
  const { body, contentType, createdAt, authorAvatar, authorName, authorType, score, textCorrection, suggestions, isBot, translatedText, ...other } = props;
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTextToSpeech = async (text) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Usar voz de Bahn 
      utterance.lang = 'en-US';
      utterance.voice = speechSynthesis.getVoices()[15];
      utterance.rate = 1;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error(error);
    }
  };

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
      <Button
        onClick={() => handleTextToSpeech(body)}
      >
        <PlayCircleIcon
          sx={{
            color: 'primary.main',
            fontSize: 32,
            m: 'auto'
          }}
        />
      </Button>

      <Button
        onClick={() => setShowTranslation(!showTranslation)}
      >
        <TranslateIcon
          sx={{
            color: 'primary.main',
            fontSize: 32,
            m: 'auto'
          }}
        />
      </Button>
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
          {
            !showTranslation && (
              <>
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
                            - {suggestion}
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
              </>
            ) || (
              <Typography
                color="inherit"
                variant="body1"
              >
                {translatedText}
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
