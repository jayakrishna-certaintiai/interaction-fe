import React from "react";
import { Link } from "react-router-dom";

const NavigationWithId = ({ children, route }) => {
  return <Link to={route} style={{color:"#00A398"}}>{children}</Link>;
};

export default NavigationWithId;
