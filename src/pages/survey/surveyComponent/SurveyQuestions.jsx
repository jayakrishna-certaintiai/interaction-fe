import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Typography, Button, Box, Modal, Divider, Tooltip, tooltipClasses } from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { BaseURL } from '../../../constants/Baseurl';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import SurveyAnswer from './SuveyAnswer';

let questions = [
    { questionId: 11, question: "What is the capital of India?", answer: "New Delhi", info: 'Provide a brief description of the field of science or technology that the project relates to. The following terminology will help you complete the description. Science is the systematic study of the nature and behaviour of the physical and material universe.' },
    { questionId: 22, question: "Who wrote the book '1984'?", answer: "George Orwell", info: 'Pune' },
    { questionId: 33, question: "What is the chemical symbol for Hydrogen?", answer: "H", info: 'Kolkata' },
    { questionId: 44, question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci", info: 'Mumbai' },
];

const style = {
    stickySubmitButton: {
        display: 'flex',
        gap: 2,
        mt: 2,
        paddingBottom: '0.5rem',
        position: 'fixed',
        zIndex: 100,
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    arrowScrool: {
        position: 'fixed',
        bottom: '10rem',
        right: '4rem',
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    }
}

const SurveyQuestions = ({ questinsAswer, verifycode, cipher, lastSaved, handleSaveAnswer, handleFinalSubmit, thankYouPage, pageName = "" }) => {
    const rightPanelRef = useRef(null);
    const [maxWidth, setMaxWidth] = useState('100%');
    const [questionsResponse, setQuestionsResponse] = useState(questinsAswer);
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [confirmationPage, setConfirmationPage] = useState(false);
    const debounceTimeoutRef = useRef(null);

    useEffect(() => {
        if (rightPanelRef.current) {
            setMaxWidth(`${rightPanelRef.current.clientWidth}px`);
        }
    }, [rightPanelRef.current]);

    const handleAnswerChange = (index, event) => {
        const newAnswers = [...questionsResponse];
        newAnswers[index].answer = event.target.value;
        setQuestionsResponse(newAnswers);
        debounceSaveAnswer();
    };

    const debounceSaveAnswer = useCallback(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(saveAnswer, 5000);
    }, [questionsResponse]);

    const saveAnswer = async () => {
        handleSaveAnswer(questionsResponse);
    }


    const unanswered = questionsResponse
        ?.map((q, index) => (q.answer.trim() === "" ? index + 1 : null))
        .filter(q => q !== null);

    const handleSubmit = () => {
        if (pageName == 'interaction') {
            setConfirmationPage(true);
        } else {
            if (unanswered.length > 0) {
                setUnansweredQuestions(unanswered);
                setModalOpen(true);
            } else {

                setConfirmationPage(true);
            }
        }
    };

    const finalSubmit = async () => {
        handleFinalSubmit(questionsResponse, cipher);
    }


    const handleClose = () => {
        setModalOpen(false);
    };

    const handleEditAnswers = () => {
        setConfirmationPage(false);
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    if (thankYouPage) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4, paddingBottom: '10%' }}>
                <Typography variant="h4" gutterBottom>
                    Thank you for taking the {pageName}. Your feedback is important to us!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Thank you for taking time to complete our {pageName}. Your feedback is incredibly valuable to us and will help us improve our services.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    If you have any additional comments, please feel free to contact us.
                </Typography>
                <Typography variant="body1">
                    We appreciate your participation and look forward to serving you better.
                </Typography>
            </Box>
        );
    }

    if (confirmationPage) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Box sx={style.stickySubmitButton}>
                    <Button variant="contained" color="primary" onClick={handleEditAnswers} style={{ backgroundColor: "#29B1A8" }}>Edit Answers</Button>
                    <Button variant="contained" color="primary" onClick={finalSubmit} style={{ backgroundColor: "#29B1A8" }}>Submit Response</Button>
                </Box>
                <Box
                    onClick={scrollToBottom}
                    style={style.arrowScrool}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#29B1A8'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
                >
                    <ArrowDownwardIcon />
                </Box>
                <Typography variant="h4" gutterBottom>Review your responses before submission:</Typography>
                <Box sx={{ textAlign: 'left', m: '0 auto', width: '50%', paddingBottom: '5rem' }}>
                    {questionsResponse.map((question, index) => (
                        <Box key={question.questionId} sx={{ mb: 2 }}>
                            <Typography variant="body1" gutterBottom><strong>Q{index + 1}:</strong> {question.question}</Typography>
                            <SurveyAnswer answer={question?.answer} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    }

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} arrow placement="left" />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#f5f5f9',
            color: 'rgba(0, 0, 0, 0.87)',
            maxWidth: 800,
            fontSize: theme.typography.pxToRem(12),
            border: '1px solid #dadde9',
        },
    }));

    return (
        <Box>
            <Box
                onClick={scrollToBottom}
                style={{
                    position: 'fixed',
                    bottom: '6rem',
                    right: '4rem',
                    width: 50,
                    height: 50,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#29B1A8'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'}
            >
                <ArrowDownwardIcon />
            </Box>
            {!(pageName == 'interaction') && <div style={{ justifyContent: 'end', paddingLeft: 10 }}>Last saved: {lastSaved} </div>}
            <Box sx={{ textAlign: 'left', m: '0 auto', width: '95%' }}>
                {questionsResponse?.map((question, index) => (
                    <Box key={question?.questionId}>
                        <Typography variant="body1" gutterBottom>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: "16px" }}><strong>{index + 1}:</strong> {question?.question}</span>
                                {question?.info?.length > 0 &&
                                    <HtmlTooltip
                                        title={
                                            <React.Fragment>
                                                {question?.info?.split('.').map((sentence, index) => (
                                                    <div key={index} style={{ fontSize: '14px' }}>
                                                        {sentence.length > 3 && `• ${sentence}.`}
                                                        <br />
                                                    </div>
                                                ))}
                                            </React.Fragment>
                                        }
                                    >
                                        <InfoOutlinedIcon sx={{ cursor: 'pointer' }} />
                                    </HtmlTooltip>
                                }
                            </Box>
                        </Typography>
                        <TextareaAutosize
                            minRows={4}
                            style={{ width: '100%', border: "solid #29B1A880 1px", padding: '8px' }}
                            value={questionsResponse[index]?.answer}
                            onChange={(e) => handleAnswerChange(index, e)}
                            placeholder="Type your answers here..."
                        />
                        <Divider sx={{ borderRadius: 1, padding: "10px" }} />
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3, paddingBottom: 3 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} style={{ ...style.stickySubmitButton, backgroundColor: (pageName == 'interaction')? '#29B1A8' : (unanswered?.length > 0 ? '#9e9e9e' : '#29B1A8'), paddingInline: 40 }}>
                    Submit
                </Button>
            </Box>
            <Toaster />
            {/* Modal for unanswered questions */}
            <Modal open={modalOpen} onClose={handleClose}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #29B1A880',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '10px'
                }}>
                    <Typography variant="h6" component="h2">
                        Unanswered Questions
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Please answer the following questions:
                    </Typography>
                    <ul>
                        {unansweredQuestions.map((q, index) => (
                            <li key={index}><b>Q{q}</b></li>
                        ))}
                    </ul>
                    <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                        <Button onClick={handleClose} variant="contained" color="primary" style={{ backgroundColor: '#29B1A8' }}>
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default SurveyQuestions;
