import { Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import OTPInput from 'react-otp-input';

const SurveyOtpPage = ({ pageDetails, handleSubmit, handleGenarateOtp, isOtpSend, authError, pageName = "" }) => {
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30);
    const [disclaimerContent, setDisclaimerContent] = useState("");

    useEffect(() => {
        let interval;
        if (isOtpSend) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setResendDisabled(false);
                        return 30;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOtpSend]);
    useEffect(() => {
        if (pageDetails?.disclaimer) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageDetails.disclaimer, "text/html");
            const emTags = doc.querySelectorAll("em");
            emTags.forEach((em) => {
                em.style.color = "#FD5707";
            });
            // Apply styles to <h1> tags (font size change)
            const h1Tags = doc.querySelectorAll("h1");
            h1Tags.forEach((h1) => {
                h1.style.fontSize = "18px";
                h1.style.marginLeft = "-15px"
            });
            const bodyContent = doc.body.innerHTML;
            setDisclaimerContent(bodyContent);
        }
    }, [pageDetails?.disclaimer]);

    const handleOtp = (value) => {
        if (value.length === 6) {
            setOtpError(false);
        }
        setOtp(value);
    };
    const handle_Submit = () => {
        if (otp.length === 6) {
            handleSubmit(otp);
        } else {
            setOtpError(true);
        }
    }

    const handleResendOtp = () => {
        handleGenarateOtp();
        setResendDisabled(true);
        setTimer(30);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1em', marginTop: '10%', paddingBottom: '20%' }}>
            <div style={{ marginBottom: '0.2em', marginTop: "-60px" }}>
                <Typography variant="body1" sx={{ marginBottom: '2em' }}>Hello {pageDetails?.name}!</Typography>
                <Typography variant="body1" sx={{ marginBottom: '0.5em' }}>This {pageName} is sent by
                    &nbsp;<span style={{ fontWeight: 'bold', color: "#FD5707" }}>{pageDetails?.company}</span> for projectId
                    &nbsp;<span style={{ fontWeight: 'bold', color: "#28B1A8" }}>{pageDetails?.projectId}</span> and projectName
                    &nbsp;<span style={{ fontWeight: 'bold', color: "#28B1A8" }}>{pageDetails?.projectName}</span>.
                </Typography>
                {!isOtpSend ?
                    <Typography variant="body1" sx={{ marginBottom: '0.5em' }}>
                        Please start by generating an OTP, which will be sent to your Email ({pageDetails?.userEmail}).
                    </Typography>
                    :
                    <Typography variant="body1" sx={{ marginBottom: '0.5em' }}>
                        The OTP has been sent to your Email ({pageDetails?.userEmail}).
                    </Typography>
                }
            </div>
            {!isOtpSend ?
                <Button
                    variant="contained"
                    onClick={handleGenarateOtp}
                    sx={{ marginTop: '1em', backgroundColor: '#29B1A8', '&:hover': { backgroundColor: '#23a69f' } }}
                >
                    Generate Otp
                </Button>
                :
                <div style={{ display: 'flex', alignItems: 'center', maxWidth: '500px' }}>
                    <OTPInput
                        value={otp}
                        onChange={handleOtp}
                        numInputs={6}
                        renderSeparator={<span></span>}
                        isInputNum={true}
                        shouldAutoFocus={true}
                        inputStyle={{
                            border: "1px solid #29B1A8",
                            borderRadius: "5px",
                            padding: "10px",
                            backgroundColor: "#FAF9F6",
                            padding: "4%",
                            margin: "0.5rem 0.5rem 1rem 0",
                            width: "35%",
                            height: "100%",
                            fontSize: "1rem",
                            color: "#000",
                            fontWeight: "400",
                            caretColor: "blue",
                        }}
                        focusStyle={{
                            border: "1px solid #CFD3DB",
                            outline: "none",
                        }}
                        renderInput={(props) => <input {...props} />}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handle_Submit}
                        sx={{ backgroundColor: '#29B1A8', '&:hover': { backgroundColor: '#23a69f' } }}
                    >
                        Verify
                    </Button>
                </div>
            }
            {authError && <div style={{ color: "red" }}>{authError}</div>}
            {otpError && <div style={{ color: "red" }}>Please fill otp fields</div>}

            {isOtpSend && (
                <Button
                    variant="contained"
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    sx={{ marginTop: '0.5em', backgroundColor: '#29B1A8', '&:hover': { backgroundColor: '#23a69f' } }}
                >
                    Resend OTP {resendDisabled && `(${timer})`}
                </Button>
            )}
            {pageDetails?.disclaimer && (<Typography
                variant="body1"
                sx={{
                    marginTop: "7.5em",
                    marginLeft: "50%",
                    width: "51%",
                    marginBottom: "-15em",
                    fontSize: "14.5px"
                }}
                dangerouslySetInnerHTML={{ __html: disclaimerContent }}
            ></Typography>)}
        </div>
    )
}

export default SurveyOtpPage;
