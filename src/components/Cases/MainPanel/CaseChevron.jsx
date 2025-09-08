import React, { useState, useEffect } from "react";
import "./CaseChevron.css";
import { LinearProgress } from "@mui/joy";
import { Stepper, Step, StepLabel } from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import { BaseURL } from "../../../constants/Baseurl";
import { Authorization_header } from "../../../utils/helper/Constant";

const ChevronIcon = (comId = "") => {
  const [activeStep, setActiveStep] = useState(0);
  const [opacity, setOpacity] = useState([100, 100, 100, 100, 100, 100]);
  const [stepsData, setStepsData] = useState(0);

  const addProjectFormik = useFormik({
    initialValues: {
      companyId: null,
    },

    onSubmit: (values) => {
      // addCase(values, false);
    },
  });

  const companyId = comId !== "" ? comId : addProjectFormik.values?.companyId;
  useEffect(() => {
    const fetchStepsData = async (values, isForceAdd) => {
      try {
        const response = await axios.post(
          `${BaseURL}/api/v1/case/${localStorage.getItem(
            "userid"
          )}/${companyId}/create`,
          {
            caseDetails: values,
            forceCaseCreate: isForceAdd,
          },
          Authorization_header()
        );
        setStepsData(response.data);
        const newOpacity = [100, 20, 0, 0, 0, 0];
        setOpacity(newOpacity);
      } catch (error) {
        console.error("Error fetching steps data:", error);
      }
    };

    fetchStepsData();
  }, [localStorage?.getItem("keys")]);

  useEffect(() => {
    const newOpacity = opacity.map((values, index) =>
      index <= activeStep ? 100 : 20
    );
    setOpacity(newOpacity);
  }, [activeStep]);

  return (
    <>
      <Box className="progress-tracker">
        <Box className="stepper" alternativeLabel>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Step
              key={index}
              className={`stepper__item ${activeStep >= index ? "complete" : ""
                }`}
            >
              <StepLabel
                className={`stepper-text ${activeStep === index ? "active-step" : "inactive-step"
                  }`}
                style={{ opacity: `${opacity[index]}%` }}
              >
                {/* {stepNames} */}
                {
                  [
                    "Initiate",
                    "DataCollection",
                    "FinancialAccounting",
                    "Documentation",
                    "Review",
                    "Claims",
                  ][index]
                }
              </StepLabel>
            </Step>
          ))}
        </Box>
        <ul className="progress-bar">
          <LinearProgress
            sx={{
              width: "97%",
              marginLeft: "0.8%",
              height: "0.5rem",
              marginTop: "-1%",
              borderRadius: "0px",
              color: "#FD5707",
            }}
            determinate
            // value={activeStep * 20}
            value={10}
          />
        </ul>
      </Box>
    </>
  );
};

export default ChevronIcon;
