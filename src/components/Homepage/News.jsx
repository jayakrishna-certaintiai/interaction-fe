import React from "react";
import Heading from "./Heading";
import { Box, Typography, List, Divider } from "@mui/material";

const containerStyle = { height: "100%" };
const boxStyle = { overflowY: "auto", height: "calc(100% - 48px)", mt: 1 };
const listStyle = { width: "100%" };
const newsItemBoxStyle = {
  display: "flex",
  px: 2,
  alignItems: "start",
  mt: 1,
  mb: 1,
};
const imageBoxStyle = { overflow: "hidden", flexShrink: 0, mr: 2 };
const imageStyle = { borderRadius: "20px" };
const newsContentBoxStyle = { flexGrow: 1 };
const headlineStyle = { fontSize: "18px", fontWeight: 600 };
const datetimeStyle = { mb: 1, fontSize: "13px" };
const contentStyle = { fontSize: "13px", color: "#9F9F9F" };

function News() {
  const news = [
    {
      datetime: "December 10, 2022 10:35 AM",
      content:
        "A cornerstone of U.S. tax policy (and for many other countries) has been to encourage and support research and development (QRE) in this country. Policymakers on bothsides of the aisle have long recognized the importance of incentivizing companies to engage in QRE. Innovation and improved productivity are the hallmarks of a growing economy, job creation and higher wages. The tax code has supported QRE primarily through two policies: 1) allow forcompanies to elect to expense QRE costs (i.e. deduct in the first year); and, 2) …Read More",
      headline:
        "QRE Tax Credit — An Update On A Lifeline For Small And Medium Business",
      image: "assets/news.png",
      magazine: "Forbes",
    },
    {
      datetime: "December 10, 2022 10:35 AM",
      content:
        "A cornerstone of U.S. tax policy (and for many other countries) has been to encourage and support research and development (QRE) in this country. Policymakers on bothsides of the aisle have long recognized the importance of incentivizing companies to engage in QRE. Innovation and improved productivity are the hallmarks of a growing economy, job creation and higher wages. The tax code has supported QRE primarily through two policies: 1) allow forcompanies to elect to expense QRE costs (i.e. deduct in the first year); and, 2) …Read More",
      headline:
        "QRE Tax Credit — An Update On A Lifeline For Small And Medium Business",
      image: "assets/news.png",
      magazine: "Forbes",
    },
  ];

  return (
    <div style={containerStyle}>
      <Heading title={"Latest News"} redirectTo="/news" />
      <Box sx={boxStyle}>
        <List sx={listStyle}>
          {news.map((item, index) => (
            <React.Fragment key={index}>
              <Box sx={newsItemBoxStyle}>
                <Box sx={imageBoxStyle}>
                  <img
                    src={item.image}
                    alt="news"
                    width="240px"
                    height="188px"
                    style={imageStyle}
                  />
                </Box>
                <Box sx={newsContentBoxStyle}>
                  <Typography sx={headlineStyle}>{item.headline}</Typography>
                  <Typography sx={datetimeStyle}>
                    {item.datetime} &bull; {item.magazine}
                  </Typography>
                  <Typography sx={contentStyle}>{item.content}</Typography>
                </Box>
              </Box>
              {index < news.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </div>
  );
}

export default News;
