import React, {useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { w3cwebsocket as WebSocket } from 'websocket';
import { Modal, Box, Typography, LinearProgress } from '@mui/material';

function LoadingView() {

  const [message, setMessage] = useState({progress: 0, description: ""});
  const [open, setOpen] = useState(true);
  
  const handleOpen = () => {
    setOpen(true)
  };

  const handleClose = () => {
    setOpen(false)
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setMessage({progress: 0, description: "Working on it..."});
    };

    socket.onmessage = (event) => {
      setMessage(JSON.parse(event.data));
      // Update the front-end with the received message
      // ...
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setMessage({progress: 0, description: "Connection interrupted"});
    };

    // Clean up the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
    {createPortal(
    <div>
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {message.description}
        </Typography>
        <LinearProgress variant="determinate" value={message.progress} />
      </Box>
    </Modal>
  </div>, document.body)}
    </>
    );
};

export default LoadingView;
