import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // Thank you icon

const ThankYouPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <EmojiEmotionsIcon style={{ fontSize: '80px', color: '#00A398' }} />
            <h1 style={{ marginTop: '1.5em', fontSize: '2rem', color: '#00A398' }}>Thank You!</h1>
            <p style={{ fontSize: '1.2rem', color: '#777', marginTop: '1em' }}>
                Your request has been successfully submitted. We will get back to you shortly.
            </p>
            <Link to="/login">
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '2.5em', backgroundColor: "#FD5707" }}
                >
                    <b>Go Back</b>
                </Button>
            </Link>

        </div>
    );
};

export default ThankYouPage;
