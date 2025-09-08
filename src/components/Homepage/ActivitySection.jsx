import MailIcon from "@mui/icons-material/Mail";
import { Box, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import React from "react";
import Heading from "./Heading";
import moment from "moment";
import { getDateWithTime } from "../../utils/helper/UpdateTimeDifference";
import NavigationWithId from "../Common/NavigationWithId";
import OpenIconButton from "../button/OpenIconButton";

const containerStyle = { height: "100%" };
const boxStyle = { overflowY: "auto", height: "calc(100% - 48px)" };
const listStyle = { width: "100%" };
const listItemBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 2,
  mt: 1,
};
const mailIconStyle = { mr: 1, fontSize: "16px", color: "black" };
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
};
const spanTextStyle = {
  color: "#00A398",
  fontSize: "13px",
  textDecoration: "underline",
};
const contentTextStyle = { fontSize: "13px", color: "#9F9F9F", mt: 1 };

function ActivitySection({ data }) {
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
    // ... add more activities here
  ];
  return (
    <div style={containerStyle}>
      <Heading title={"Recent Activity"} redirectTo="/activity" />
      <Box sx={boxStyle}>
        <List sx={listStyle}>
          {data?.map((activity, index) => (
            <React.Fragment key={index}>
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
                  {getDateWithTime(activity?.modifiedTime)}
                  <NavigationWithId
                    route={`/activity/info?activityId=${encodeURIComponent(
                      activity?.interactionID
                    )}`}
                  >
                    <OpenIconButton />
                  </NavigationWithId>
                </Typography>
              </Box>
              <ListItem>
                <Grid container justifyContent="space-between">
                  <Grid item xs={6}>
                    <Typography sx={{ ...textStyle, mb: 0.5 }}>
                      Related To :{" "}
                      <Typography component="span" sx={spanTextStyle}>
                        {activity?.relatedTo}
                      </Typography>
                    </Typography>
                    <Typography sx={textStyle}>
                      To :{" "}
                      <Typography component="span" sx={spanTextStyle}>
                        {activity?.interactionTo}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "left" }}>
                    <Typography sx={{ ...textStyle, mb: 0.5 }}>
                      Subject :{" "}
                      <Typography component="span" sx={{ fontSize: "13px" }}>
                        {activity?.interactionSubject?.length <= 20
                          ? activity?.interactionSubject
                          : activity?.interactionSubject?.substring(0, 20) +
                          "..."}
                      </Typography>
                    </Typography>
                    <Typography sx={textStyle}>
                      From :{" "}
                      <Typography component="span" sx={spanTextStyle}>
                        {activity?.interactionFrom}
                      </Typography>
                    </Typography>
                  </Grid>
                  <Typography sx={contentTextStyle}>
                    {activity?.interactionDesc?.substring(0, 80) + "..."}
                  </Typography>
                </Grid>
              </ListItem>
              {index < activities.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </div>
  );
}

export default ActivitySection;
