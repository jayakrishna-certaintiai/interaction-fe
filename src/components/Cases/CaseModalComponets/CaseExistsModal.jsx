import { Box, Button, Modal, Typography } from "@mui/material";

const style = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        bgcolor: 'background.paper',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
        borderRadius: '12px',
    },
    caseIds: {
        backgroundColor: '#808080',
        color: '#ffffff'
    }

};

const CaseExitsModal = ({ forceCaseAdd, isCaseExist, existCases, handleCaseExistModal }) => {
    const handleClose = () => {
        handleCaseExistModal(false);
    }

    const handleYes = () => {
        forceCaseAdd();
        handleClose();
    };

    const handleNo = () => {
        handleClose();
    };

    return (
        <Modal
            open={isCaseExist}
            onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                    handleClose();
                }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style.modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    A case with the provided required composition already exists.
                </Typography>
                <Typography id="modal-modal-title">
                    Existing Cases - {existCases?.map((caseItem, index) => {
                        return <span key={caseItem}><span style={style.caseIds}>[{caseItem}]</span> </span>
                    })}
                </Typography>
                <Typography id="modal-modal-title" >
                    Do you want to create another Case?
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" style={{ backgroundColor: '#00A398', marginRight: '10px' }} onClick={handleYes}>YES</Button>
                    <Button variant="contained" style={{ backgroundColor: '#808080', color: '#ffffff' }} onClick={handleNo}>NO</Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default CaseExitsModal;
