import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, Button, Drawer, IconButton, List, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { chatApi } from '../../__fake-api__/chat-api';
import { Plus as PlusIcon } from '../../icons/plus';
import { X as XIcon } from '../../icons/x';
import { useSelector } from '../../store';
import { Scrollbar } from '../scrollbar';
import { ChatContactSearch } from './chat-contact-search';
import { ChatThreadItem } from './chat-thread-item';
import { Logo } from '../logo';

const ChatSidebarDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 380,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 380
  }
});

const ChatSidebarMobile = styled(Drawer)({
  maxWidth: '100%',
  width: 380,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 380
  }
});

export const ChatSidebar = (props) => {
  const { containerRef, onClose, open, ...other } = props;
  const router = useRouter();
  const { threads, activeThreadId } = useSelector((state) => state.chat);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const handleSelectThread = (threadId) => {
    const thread = threads.byId[threadId];
    let threadKey;

    if (thread.type === 'GROUP') {
      threadKey = thread.id;
    } else {
      // We hardcode the current user ID because the mocked that is not in sync
      // with the auth provider.
      // When implementing this app with a real database, replace this
      // ID with the ID from Auth Context.
      threadKey =
        thread.participantIds.find((participantId) => (participantId
          !== '5e86809283e28b96d2d38537'));
    }

    if (!mdUp) {
      onClose?.();
    }

    router.push(`/?threadKey=${threadKey}`).catch(console.error);
  };

  const content = (
    <div>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <NextLink
          href="/"
          passHref
        >
          <Logo
            width={40}
            height={40}
          />
        </NextLink>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="h5">
          Gabot
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            display: {
              sm: 'none'
            },
            ml: 2
          }}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <Typography variant="body1">
          Selecciona un modo de uso para comenzar
        </Typography>
      </Box>
      <Box
        sx={{
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          display: isSearchFocused ? 'none' : 'block'
        }}
      >
        <Scrollbar>
          <List disablePadding>
            {threads.allIds.map((threadId) => (
              <ChatThreadItem
                active={activeThreadId === threadId}
                key={threadId}
                onSelect={() => handleSelectThread(threadId)}
                thread={threads.byId[threadId]}
              />
            ))}
          </List>
        </Scrollbar>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <ChatSidebarDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}>
        {content}
      </ChatSidebarDesktop>
    );
  }

  return (
    <ChatSidebarMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}>
      {content}
    </ChatSidebarMobile>
  );
};

ChatSidebar.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
