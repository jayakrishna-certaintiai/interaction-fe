
import React, { useEffect, useState } from 'react';
import { CompanyLogo } from "../../constants/Baseurl";
import CertaintiIcon from "../../assets/login-certainti.png";
import defaultCompanyLogo from "../../assets/artificial-intelligence.png";
import SurveyQuestions from './surveyComponent/SurveyQuestions';
import SurveyOtpPage from './surveyComponent/SurveyOtpPage';
import { Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { BaseURL } from "../../constants/Baseurl";
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";

const Survey = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const verifycode = queryParams.get('verifycode');
    const [isValidate, setIsValidate] = useState(false);
    const [pageDetails, setPageDetails] = useState({
        name: 'Sharad Kelkar',
        company: 'RESDEV Tax Consultants',
        userEmail: 'sh***.***kar@in******sols.uk',
        supportEmail: 'support@certainti.ai',
        projectName: 'Auto Generation of Health Records',
        clientName: 'Infinity Solutions, United Kingdom',
        projectId: '234234',
        projectManager: 'Richard malik',
        technicalContact: 'John joyguru',
        assesmentYear: '2024'
    });
    const [authOtpError, setAuthOtpError] = useState();
    const [urlValid, setUrlValid] = useState(false);
    const [verifyMessage, setVerifyMessage] = useState("Please wait...");
    const [questinsAswer, setQuestionAnswer] = useState([]);
    const [cipher, setCipher] = useState();
    const [lastSaved, SetLastSaved] = useState();
    const [thankYouPage, setThankYouPage] = useState(false);
    const [isOtpSend, setIsOtpSend] = useState(false);

    const verifyUrl = async () => {
        try {
            const response = await axios.get(
                `${BaseURL}/api/v1/survey/${verifycode}/authenticate`,
            );
            setUrlValid(true);
            setPageDetails(response?.data?.data);
        } catch (error) {
            setUrlValid(false);
            setVerifyMessage(error?.response?.data?.message || 'Server error!');
        }
    }

    useEffect(() => {
        verifyUrl();
    }, []);

    const handleGenarateOtp = async () => {
        toast.loading("Sending Otp...");
        try {
            const response = await axios.get(
                `${BaseURL}/api/v1/survey/${verifycode}/authenticate?genarateotp=true`,
            );
            setCipher(response?.data?.data?.cipher);
            setIsOtpSend(true);
            toast.dismiss();
            toast.success(`OTP sent successfully.`);
        } catch (error) {
            setIsOtpSend(false);
            toast.dismiss();
            toast.error(error?.response?.data.message || 'Failed to sent otp!');
            console.error(error);
        }
    }

    const verifyOtp = async (otp) => {
        toast.loading('Verifying otp...');
        try {
            const response = await axios.post(
                `${BaseURL}/api/v1/survey/${verifycode}/verifyotp`,
                {
                    cipher: cipher,
                    otp: otp
                }
            );
            const questionsAndANswers = response?.data?.data?.questionsAndANswers?.map((element, index) => {
                if (element?.answer === null) {
                    return (
                        {
                            "questionId": element.questionId,
                            "question": element.question,
                            "answer": '',
                            "sequence": element.sequence,
                            "info": element.info
                        }
                    )
                }
                return (
                    {
                        "questionId": element.questionId,
                        "question": element.question,
                        "answer": element.answer,
                        "sequence": element.sequence,
                        "info": element.info
                    }
                )
            })
            setQuestionAnswer(questionsAndANswers);
            setIsValidate(true);
            setCipher(response?.data?.data?.cipher);
            SetLastSaved(response?.data?.data?.lastSaved)
            toast.dismiss();
            toast.success(`OTP verified successfully.`);
        } catch (error) {
            setIsValidate(false);
            setAuthOtpError("Otp invalid");
            toast.dismiss();
            toast.error(error?.response?.data.message || 'Failed to verify otp. Server Error !');
        }
    }

    const handleOtpSubmit = (otp) => {
        verifyOtp(otp);
    };

    const handleSaveAnswer = async (questionsResponse) => {
        try {
            const response = await axios.post(
                `${BaseURL}/api/v1/survey/${verifycode}/save`,
                {
                    cipher: cipher,
                    answers: questionsResponse
                }
            );
            SetLastSaved(response?.data?.data?.lastSaved);
            toast.dismiss();
            toast.success(`Answer Saved`);
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data.message || 'Failed to save answer!');
            console.error(error);
        }
    };

    const handleFinalSubmit = async (questionsResponse, cipher) => {
        try {
            const response = await axios.post(
                `${BaseURL}/api/v1/survey/${verifycode}/save`,
                {
                    submit: true,
                    cipher: cipher,
                    answers: questionsResponse
                }
            );
            setThankYouPage(true);
        } catch (error) {
            toast.dismiss();
            toast.success(error?.response?.data.message || 'Failed to save answer!');
            console.error(error);
        }
    };

    return (<>
        {!urlValid ?
            <div style={{
                justifyContent: 'center',
                fontSize: 26,
                color: '#29B1A8',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                height: '100vh',
                textAlign: 'center',
                paddingTop: '10%',
            }}>
                {verifyMessage}
            </div>

            :
            <div>
                <header style={{ top: 0, zIndex: 100, padding: '2em', width: '100%', textAlign: 'center' }}>
                    <img src={CompanyLogo || defaultCompanyLogo} alt="RESDEV Logo" style={{ width: '150px' }} />
                    {isValidate &&
                        <>
                            <div style={{ fontSize: '24px', padding: '5px' }}>{pageDetails?.clientName}</div>
                            <Divider style={{ borderColor: '#29B1A8', }} />
                            <div style={{ padding: '5px' }}>
                                <div style={{ fontSize: '18px', padding: '4px' }}>Project QRE Assessment Survey - FY{pageDetails?.assesmentYear}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '14px' }}>Project ID: {pageDetails?.projectId}</div>
                                        <div style={{ fontSize: '14px' }}>Project Name: {pageDetails?.projectName}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px' }}>Project Manager: {pageDetails?.projectManager}</div>
                                        <div style={{ fontSize: '14px' }}>Technical Contact: {pageDetails?.technicalContact}</div>
                                    </div>
                                </div>
                            </div>
                            <Divider style={{ borderColor: '#29B1A8', borderWidth: '1.5px', }} />
                        </>
                    }
                </header>

                {isValidate ?
                    <SurveyQuestions
                        questinsAswer={questinsAswer}
                        cipher={cipher}
                        verifycode={verifycode}
                        lastSaved={lastSaved}
                        handleSaveAnswer={handleSaveAnswer}
                        handleFinalSubmit={handleFinalSubmit}
                        thankYouPage={thankYouPage}
                        pageName={"survey"}
                    />
                    :
                    <SurveyOtpPage
                        pageDetails={pageDetails}
                        handleSubmit={handleOtpSubmit}
                        authError={authOtpError}
                        pageName={"survey"}
                        handleGenarateOtp={handleGenarateOtp}
                        isOtpSend={isOtpSend}
                    />
                }

                <Divider style={{ borderColor: '#29B1A8', position: "sticky" }} />
                <footer style={{ zIndex: 100, bottom: 0, left: 0, right: 0, padding: '1em', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ paddingRight: '4px', fontSize: '10px' }}> Powered by </span>
                            <img src={CertaintiIcon} alt="Certaintini Logo" style={{ width: '150px' }} />
                        </div>
                        <div>
                            For any queries, please contact -
                            <a href={`mailto:${pageDetails?.supportEmail}`} style={{ color: '#29B1A8' }}> {pageDetails?.supportEmail}</a>
                        </div>
                    </div>
                </footer>
                <Toaster />
            </div>
        }
    </>
    );
};

export default Survey;
