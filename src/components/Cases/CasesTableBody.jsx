import { TableBody, TableCell, TableRow } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React from "react";
import CompanyTableCell from "../Common/CompanyTableCell";
import CasesTableCell from "../Common/CasesTableCell";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NewInteractionModal from "../Common/NewInteractionModal";
import axios from "axios";
import { BaseURL } from "../../constants/Baseurl";
import toast, { Toaster } from "react-hot-toast";
import { Authorization_header } from "../../utils/helper/Constant";

const cellStyle = {
  whiteSpace: "nowrap",
  textAlign: "center",
  fontSize: "13px",
  pl: 10,
};

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    fontWeight: 400,
    boxShadow: theme.shadows[5],
    fontSize: 12,
  },
}));

function CasesTableBody({ data }) {
  const [interactionOpen, setinteractionOpen] = React.useState(false);
  const [selectedEmail, setSelectedEmail] = React.useState("");

  const handleInfoBoxHover = () => {
  };

  const handleUploadClick = (val) => {
    setSelectedEmail(val);
    setinteractionOpen(true);
  };

  const handleModalClose = () => {
    setinteractionOpen(false);
    // handleClose();

  };

  const handleSendMail = async (recieversEmail, description, subject, cc) => {
    handleModalClose("abc");
    try {
      toast.loading("Sending an Email...");
      const res = await axios.post(
        `${BaseURL}/api/v1/case/${localStorage.getItem("userid")}/mail`,
        {
          toMail: recieversEmail,
          subject: subject,
          message: description,
          ccMails: cc,
        },
        Authorization_header()
      );
      toast.dismiss();
      toast.success("Email has been sent...");
    } catch (error) {
      toast.dismiss();
      toast.error(error?.message || "Failed to send Email. Server error!");
      console.error(error);
    }
  };
  return (
    <>
      <TableBody>
        {data?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {/* <CasesTableCell name={row?.caseCode} id={row?.caseId} sCase={row} /> */}
            <TableCell sx={{ ...cellStyle, paddingTop: "7px" }}>
              {row.caseType ? (
                <>
                  {row.caseType}{" "}
                  <span>
                    <LightTooltip
                      title={
                        row?.caseTypeDescription ||
                        "QRE Claims Cases in Certainti.Ai  process a streamlined platform to assist businesses in preparing their QRE claims effectively. You can now easily compile and organize the necessary documentation and information required for your QRE claims in a simple process, guiding you. This ensures that your QRE claims are thorough and well-supported, increasing your chances of qualifying for valuable tax credits and other financial incentives offered by the government. Certainti.Ai  empowers businesses to maximize their potential benefits from QRE investments while minimizing the administrative burden of claim preparation."
                      }
                    >
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ mb: "-5px", color: "#00A398", cursor: "pointer" }}
                        onMouseOver={handleInfoBoxHover}
                      />
                    </LightTooltip>
                  </span>
                </>
              ) : (
                ""
              )}
            </TableCell>
            {/* {row?.caseCode ? (
              <CompanyTableCell
                id={row.companyId}
                name={`${row?.companyName}`}
              />
            ) : (
              <TableCell sx={cellStyle}></TableCell>
            )}
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              {row?.countryName?.charAt(0).toUpperCase() +
                row?.countryName?.slice(1) || ""}
            </TableCell>
            <TableCell sx={{ ...cellStyle, color: "#FD5707", textAlign: "left" }}>
              {row?.caseOwnerName}
            </TableCell>
            <TableCell sx={cellStyle}>{row?.createdOn}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      <NewInteractionModal
        open={interactionOpen}
        handleClose={handleModalClose}
        recieversEmail={selectedEmail}
        handleSendMail={handleSendMail}
      />
    </>
  );
}

export default CasesTableBody;
