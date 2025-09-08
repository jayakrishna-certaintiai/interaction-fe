import MailIcon from "@mui/icons-material/Mail";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BaseURL } from "../../constants/Baseurl";
import { useAuthContext } from "../../context/AuthProvider";
import { NotificationContext } from "../../context/NotificationContext";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import NavigationWithId from "./NavigationWithId";

const iconStyle = { ml: 1, fontSize: "18px", color: "#9F9F9F" };
function SidePanelHeader({ type, id }) {
  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const { alerts } = useContext(NotificationContext);
  let rolesInfo =
    Array.isArray(authState?.rolesInfo) && (authState?.rolesInfo).length > 0
      ? authState?.rolesInfo[0]
      : {};
  const [selectedButton, setSelectedButton] = useState("Alerts");
  const [history, setHistory] = useState([]);
  const [activity, setActivity] = useState([]);
  const [notes, setNotes] = useState([]);

  const buttonStyle = (buttonName) => ({
    textTransform: "capitalize",
    color: "#404040",
    fontSize: "11px",
    backgroundColor:
      selectedButton === buttonName ? "#03A69B1A" : "transparent",
    borderBottom: selectedButton === buttonName ? "3px solid #00A398" : "none",
    px: 1.5,
    mr: "2px",
    minHeight: "48px",
    fontWeight: 600,
    borderRadius: "0px",
    "&:hover": {
      backgroundColor: "#03A69B1A",
      borderBottom: "3px solid #00A398",
    },
  });

  const mailIconStyle = { mr: 1, fontSize: "16px", color: "black" };
  const dateTextStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
  };

  const linkStyle = {
    color: "#00A398",
    textDecoration: "underline",
    cursor: "pointer",
  };

  const renderAlerts = () => {
    if (alerts.length === 0)
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
            color: "#EA4335",
          }}
        >
          No alerts found
        </div>
      );
    return alerts.map((alert) => {
      return (
        <div
          key={alert.alertId}
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            height: "80px",
            paddingTop: "12px",
            paddingLeft: "12px",
            paddingRight: "12px",
            font: "Montserrat, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              {moment(alert?.createdTime)?.format("DD/MM/YYYY HH:mm:ss")}
            </div>
            <div>
              <Link to={"/alerts"}>
                <OpenInNewIcon sx={iconStyle} />
              </Link>
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            {alert.alertDesc}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await axios.get(
          `${BaseURL}/api/v1/platform-activity/${localStorage.getItem(
            "userid"
          )}/get-history`,
          {
            params: {
              relatedTo: type,
              relationId: id,
              // companyIds: JSON.stringify([id]),
            },
          }
        );
        setHistory(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const getAndSetActivity = async () => {
      try {
        const res = await axios.get(
          `${BaseURL}/api/v1/interactions/${localStorage.getItem(
            "userid"
          )}/hjgjhg/get-activity-with-filters`,
          {
            params: {
              relatedTo: type,
              relationId: id,
            },
          }
        );
        setActivity(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const getAndSetNotes = async () => {
      try {
        const res = await axios.get(
          `${BaseURL}/api/v1/notes/${localStorage.getItem("userid")}/get-notes`
        );
        setNotes(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    const setRequiredData = async () => {
      if (selectedButton === "History") {
        getHistory();
      }
      if (selectedButton === "Activity") {
        getAndSetActivity();
      }
      if (selectedButton === "Notes") {
        getAndSetNotes();
      }
    };
    setRequiredData();
  }, [
    selectedButton,
    rolesInfo.companyId,
    localStorage.getItem("userid"),
    type,
    id,
  ]);

  const renderActivity = () => {
    if (activity.length === 0)
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
            color: "#EA4335",
          }}
        >
          No activity found
        </div>
      );
    return activity.map((a) => {
      return (
        <div
          key={a.interactionID}
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            paddingTop: "12px",
            paddingLeft: "12px",
            paddingRight: "12px",
            font: "Montserrat, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Typography sx={dateTextStyle}>
                <MailIcon sx={mailIconStyle} />
                Interactions
              </Typography>
            </div>
            <div style={{ alignItems: "center", display: "flex" }}>
              <span>
                {a.modifiedTime
                  ? moment(a?.modifiedTime)?.format("DD/MM/YYYY HH:mm:ss")
                  : moment(a?.createdTime)?.format("DD/MM/YYYY HH:mm:ss")}
              </span>
              <Link to={"/activity"}>
                <OpenInNewIcon sx={iconStyle} />
              </Link>
            </div>
          </div>
          <div
            style={{
              fontSize: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
              }}
            >
              <div
                style={{
                  paddingRight: "30px",
                }}
              >
                <div>Activity Name</div>
                <div>To</div>
                <div>From</div>
                <div>Subject</div>
              </div>
              <div>
                <div>
                  <span>: </span>
                  <span
                    style={{
                      color: "#00A398",
                      textDecoration: "underline",
                    }}
                  >
                    {a.interactionSubject}
                  </span>
                </div>
                <div>
                  <span>: </span>
                  <span
                    style={{
                      color: "#00A398",
                      textDecoration: "underline",
                    }}
                  >
                    {
                      a && a?.interactionTo
                      // &&
                      // JSON.parse(a?.interactionTo?.replaceAll("'", '"')).join(
                      //   ", "
                      // )
                    }
                  </span>
                </div>
                <div>
                  <span>: </span>
                  <span
                    style={{
                      color: "#00A398",
                      textDecoration: "underline",
                    }}
                  >
                    {a.interactionFrom}
                  </span>
                </div>
                <div>
                  <span>: </span>
                  <span
                    style={{
                      color: "#00A398",
                      textDecoration: "underline",
                    }}
                  >
                    {`${"Information pending"}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              color: "#9F9F9F",
              whiteSpace: "nowrap",
              overflow: "hidden",
              paddingTop: "20px",
            }}
          >
            {a.interactionDesc}
          </div>
        </div>
      );
    });
  };

  const renderNotes = () => {
    if (notes.length === 0)
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
            color: "#EA4335",
          }}
        >
          No notes found
        </div>
      );
    return notes.map((note) => (
      <>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
          }}
        >
          <div style={{ color: "#9F9F9F" }}>
            <span>
              {note.modifiedTime
                ? moment(note?.modifiedTime)?.format("DD/MM/YYYY HH:mm:ss")
                : note?.createdTime
                ? moment(note?.createdTime)?.format("DD/MM/YYYY HH:mm:ss")
                : ""}
            </span>
          </div>
          <div
            style={{
              fontSize: "14px",
              paddingTop: "8px",
            }}
          >
            {note.notes}
          </div>
        </div>
      </>
    ));
  };

  const renderHistory = () => {
    if (history.length === 0)
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
            color: "#EA4335",
          }}
        >
          No history found
        </div>
      );
    return history.map((item) => {
      return (
        <div
          key={item?.id}
          style={{
            width: "100%",
            borderBottom: "1px solid #E4E4E4",
            padding: "12px",
            font: "Montserrat, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>{moment(item?.timestamp)?.format("DD/MM/YYYY HH:mm:ss")}</div>
            <div>{/* <OpenInNewIcon sx={iconStyle} /> */}</div>
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "500",
              paddingTop: "8px",
            }}
          >
            <span>{item.modifiedBy}</span>
            <span> {item?.actionPerformed} </span>
            {item.performedOnId ? (
              <NavigationWithId
                route={`/${item?.performedOnRelatedTo}/info?${
                  item?.performedOnType
                }=${encodeURIComponent(item.performedOnId)}`}
              >
                <span style={linkStyle}>{item.performedOn}</span>
              </NavigationWithId>
            ) : (
              <span>{item.performedOn}</span>
            )}
            <span> {item?.action}</span>
          </div>
        </div>
      );
    });
  };
  const arr = [
    { name: "Alerts", isAuth: useHasAccessToFeature("F041", "P000000003") },
    { name: "Activity", isAuth: useHasAccessToFeature("F023", "P000000003") },
    { name: "Notes", isAuth: true },
    // { name: "History", isAuth: true },
  ];

  const appStyle = {
    backgroundColor: "white",
    boxShadow: "0px 3px 6px #0000001F",
  };

  return (
    <>
      <Toolbar variant="dense" sx={{ borderBottom: "1px solid #E4E4E4" }}>
        {arr.map(({ name, isAuth }) => {
          if (isAuth) {
            return (
              <Button
                key={name}
                sx={buttonStyle(name)}
                onClick={() => setSelectedButton(name)}
              >
                {name}
              </Button>
            );
          }
          return null;
        })}
      </Toolbar>
      <div
        style={{
          height: "100%",
          backgroundColor: "white",
          overflowY: "scroll",
          overflow: "auto",
          borderRadius: "20px",
          paddingBottom: "10px",
        }}
      >
        {useHasAccessToFeature("F041", "P000000003") &&
          selectedButton === "Alerts" &&
          renderAlerts()}
        {useHasAccessToFeature("F023", "P000000003") &&
          selectedButton === "Activity" &&
          renderActivity()}
        {selectedButton === "Notes" && renderNotes()}
        {selectedButton === "History" && renderHistory()}
      </div>
    </>
  );
}

export default SidePanelHeader;
