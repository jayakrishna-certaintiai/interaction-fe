import React, { useContext, useEffect, useState } from "react";

const SetUp2faStep = ({ qrCode, ...styles }) => {
    const [isAndroidHovered, setIsAndroidHovered] = React.useState(false);
    const [isIOSHovered, setIsIOSHovered] = React.useState(false);
    return (
        <>
            <div style={styles.txt}>Set-up Authenticator</div>
            <div style={styles.txt}>
                <span style={styles.bluetxt}>Step 1</span> - Download Microsoft
                Authenticator App Download Link :
                <a
                    href="https://play.google.com/store/apps/details?id=com.azure.authenticator&pcampaignid=web_share"
                    target="_blank"
                    onMouseEnter={() => setIsAndroidHovered(true)}
                    onMouseLeave={() => setIsAndroidHovered(false)}
                    style={
                        isAndroidHovered ? styles.anchor_hover : styles.anchor
                    }>
                    {" "}
                    Android{" "}
                </a>
                or
                <a
                    href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458"
                    target="_blank"
                    onMouseEnter={() => setIsIOSHovered(true)}
                    onMouseLeave={() => setIsIOSHovered(false)}
                    style={isIOSHovered ? styles.anchor_hover : styles.anchor}>
                    {" "}
                    IOS
                </a>
            </div>
            <div style={styles.txt}>
                <span style={styles.bluetxt}>Step 2</span> - Scan QR Code with
                your Authenticator App
            </div>

            <img
                src={qrCode}
                alt="QR Code"
                width="100"
                height="100"
                style={styles.img}
            />

            <div style={styles.txt}>
                <span style={styles.bluetxt}>Step 3</span> -
            </div>

        </>
    )
}

export default SetUp2faStep;