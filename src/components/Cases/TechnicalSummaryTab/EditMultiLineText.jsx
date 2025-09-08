import * as React from 'react';
import Box from '@mui/material/Box';

const EditMultiLineText = ({ value, editable, inputRef }) => {
    return (
        <Box
            component="div"
            sx={{
                width: '100%',
                height: '400px', // Adjust height as needed
                padding: '16px',
                marginBottom: "16px",
                border: editable ? '1.5px solid #E4E4E4' : '1.5px solid #E4E4E4',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                overflowY: 'auto', // Enable vertical scrolling
                fontFamily: 'Poppins',
                fontSize: '1rem',
                lineHeight: '1.5',
                color: "E4E4E4",
                // whiteSpace: 'pre-wrap', // Preserves line breaks
                '& .formatted-text': {
                    width: '100%',
                },
                '& .formatted-text h1': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 0 10px',
                    color: "E4E4E4",
                },
                '& .formatted-text h2': {
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    margin: '0 0 8px',
                    color: "E4E4E4",
                },
                '& .formatted-text h3': {
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    margin: '0 0 6px',
                    color: "E4E4E4",
                },
                '& .formatted-text p': {
                    margin: '0 0 10px', // Spacing between paragraphs
                },
                '& .formatted-text pre': {
                    whiteSpace: 'pre-wrap', // Preserve formatting for code blocks
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '4px',
                    margin: '0 0 10px',
                },
                '& .formatted-text a': {
                    color: '#29B1A8',
                    textDecoration: 'none',
                },
                '& .formatted-text a:hover': {
                    textDecoration: 'underline',
                }
            }}
            ref={inputRef}
        >
            {/* Render HTML content safely */}
            <Box
                className="formatted-text"
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </Box>
    );
}

export default EditMultiLineText;
