import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  AvatarGroup,
  Box,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { Archive as ArchiveIcon } from '../../icons/archive';
import { Bell as BellIcon } from '../../icons/bell';
import { Ban as BanIcon } from '../../icons/ban';
import { Trash as TrashIcon } from '../../icons/trash';

export const ChatThreadToolbar = (props) => {
  const { participants, ...other } = props;
  const moreRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    id: '5e86809283e28b96d2d38537'
  };

  const recipients = participants.filter((participant) => (participant.id !== user.id));
  const name = recipients.reduce((names, participant) => [...names, participant.name],
    []).join(', ');

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        display: 'flex',
        flexShrink: 0,
        minHeight: 64,
        px: 2,
        py: 1
      }}
      {...other}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <AvatarGroup
          max={2}
          sx={{
            ...(recipients.length > 1 && {
              '& .MuiAvatar-root': {
                height: 30,
                width: 30,
                '&:nth-of-type(2)': {
                  mt: '10px'
                }
              }
            })
          }}
        >
          {recipients.map((recipient) => (
            <Avatar
              key={recipient.id}
              src={recipient.avatar || undefined}
            />
          ))}
        </AvatarGroup>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">
            {name}
          </Typography>
          {Boolean(recipients.length === 1 && recipients[0].lastActivity) && (
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Instrucciones:
              {' '}
              {recipients[0]?.lastActivity}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Menu
        anchorEl={moreRef.current}
        keepMounted
        onClose={handleMenuClose}
        open={openMenu}
      >
        <MenuItem>
          <ListItemIcon>
            <BanIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Block contact" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <TrashIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete thread" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Archive thread" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BellIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mute notifications" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

ChatThreadToolbar.propTypes = {
  participants: PropTypes.array
};

ChatThreadToolbar.defaultProps = {
  participants: []
};
