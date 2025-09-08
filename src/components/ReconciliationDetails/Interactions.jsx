import { Box, Button, List, ListItem, Typography } from "@mui/material";
import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { HiFilter } from "react-icons/hi";
import AddIcon from "@mui/icons-material/Add";
import { formattedDate } from "../../utils/helper/FormatDatetime";

const listItemBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  mt: 1,
};
const mailIconStyle = { mr: 1, fontSize: "18px", color: "black" };
const dateTextStyle = {
  display: "flex",
  alignItems: "center",
  fontSize: "13px",
};
const textStyle = {
  textDecoration: "none",
  color: "black",
  fontWeight: 600,
  fontSize: "13px",
  textAlign: "left",
  paddingRight: "10px",
};
const spanTextStyle = {
  color: "#00A398",
  fontSize: "13px",
  textDecoration: "underline",
};
const contentTextStyle = { fontSize: "13px", color: "#9F9F9F", mt: 1 };
const scrollableContainerStyle = {
  height: "30vw",
  overflowY: "auto",
  // scrollbarWidth: "none",
  // msOverflowStyle: "none",
  // "&::-webkit-scrollbar": {
  //   display: "none",
  // },
  borderTop: "1px solid #E4E4E4",
};
const filterIcon = {
  color: "white",
  borderRadius: "50%",
  backgroundColor: "#00A398",
  fontSize: "35px",
  padding: "5px",
  marginLeft: "16px",
  cursor: "pointer",
};
const buttonStyle = {
  textTransform: "capitalize",
  borderRadius: "20px",
  backgroundColor: "#00A398",
  mr: 2,
  "&:hover": {
    backgroundColor: "#00A398",
  },
};

const activities = [
  {
    relatedTo: "TS_Oct23",
    subject: "Uncertain Hours",
    to: "Prabhu Balakrishnan",
    from: "Adam Smith",
    content: "Lorem ipsum dolor sit amet...",
    date: "29/10/2023 12:45:34",
  },
  {
    relatedTo: "TS_Oct23",
    subject: "Uncertain Hours",
    to: "Prabhu Balakrishnan",
    from: "Adam Smith",
    content: "Lorem ipsum dolor sit amet...",
    date: "29/10/2023 12:45:34",
  },
  {
    relatedTo: "TS_Oct23",
    subject: "Uncertain Hours",
    to: "Prabhu Balakrishnan",
    from: "Adam Smith",
    content: "Lorem ipsum dolor sit amet...",
    date: "29/10/2023 12:45:34",
  },
];

function Interactions({ data }) {
  return (
    <Box sx={scrollableContainerStyle}>
      <List>
        {data?.map((activity, index) => (
          <Box
            sx={{
              borderBottom:
                index === data?.length - 1 ? "none" : "1px solid #E4E4E4",
            }}
            key={index}
          >
            <Box sx={listItemBoxStyle}>
              <Typography sx={dateTextStyle}>
                <MailIcon sx={mailIconStyle} />
                Mail
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={dateTextStyle}
              >
                {formattedDate(activity?.createdTime)}
                <OpenInNewIcon
                  sx={{
                    ml: 1,
                    fontSize: "18px",
                    color: "#9F9F9F",
                    "&:hover": { color: "#FD5707" },
                  }}
                />
              </Typography>
            </Box>
            <ListItem
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <table>
                <tbody>
                  <tr>
                    <td style={textStyle}>Related To</td>
                    <td style={{ paddingRight: "10px" }}>:</td>
                    <td>
                      <Typography
                        component="span"
                        sx={{ ...spanTextStyle, textTransform: "capitalize" }}
                      >
                        {activity?.relatedTo}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={textStyle}>To</td>
                    <td>:</td>
                    <td>
                      <Typography component="span" sx={spanTextStyle}>
                        {activity?.interactionTo}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={textStyle}>From</td>
                    <td>:</td>
                    <td>
                      <Typography component="span" sx={spanTextStyle}>
                        {activity?.interactionFrom}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td style={textStyle}>Subject</td>
                    <td>:</td>
                    <td>
                      <Typography component="span" sx={{ fontSize: "13px" }}>
                        {activity?.interactionSubject}
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography sx={contentTextStyle}>
                {activity?.interactionDesc?.length > 50
                  ? activity?.interactionDesc?.substring(0, 50) + "..."
                  : activity?.interactionDesc}
              </Typography>
            </ListItem>
          </Box>
        ))}
      </List>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "sticky",
          bottom: 0,
        }}
      >
        <HiFilter style={filterIcon} />
        <Button variant="contained" sx={buttonStyle}>
          <AddIcon /> New Interaction
        </Button>
      </Box>
    </Box>
  );
}

export default Interactions;
