import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CompanySelector from "../../FilterComponents/CompanySelector";
import TitleSelector from "../../FilterComponents/TitleSelector";
import { FilterListContext } from "../../../context/FiltersListContext";
import UserRoleSelector from "../../FilterComponents/UserRoleSelector";
import StatusSelector from "../../FilterComponents/StatusSelector";
import SigninActivitySelector from "../../FilterComponents/SigninActivitySelector";
import { UserManagementContext } from "../../../context/UserManagementContext";
import { titles } from "../../../constants/Titles";

const statuses = ["Active", "Pending", "Inactive"];

const roles = ["User", "Consultant"];

function UserManagementFilters() {
  const { clientList, userRolesList } = useContext(FilterListContext);
  const { userFilterState, setUserFilterState, clearUserFilterCounter } =
    useContext(UserManagementContext);
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [signin, setSignin] = useState("");

  useEffect(() => {
    setUserFilterState({
      ...userFilterState,
      clients: [
        clientList?.find((client) => client?.companyName === company)
          ?.companyId,
      ],
      clientName: company,
    });
  }, [company]);

  useEffect(() => {
    setUserFilterState({
      ...userFilterState,
      title: [title],
      titleName: title,
    });
  }, [title]);

  useEffect(() => {
    setUserFilterState({
      ...userFilterState,
      role: [userRolesList?.find((user) => user?.role === role)?.roleId],
      roleType: role,
    });
  }, [role]);

  useEffect(() => {
    setUserFilterState({
      ...userFilterState,
      status: status,
      statusType: status,
    });
  }, [status]);

  useEffect(() => {
    setCompany("");
    setTitle("");
    setRole("");
    setStatus("");
  }, [clearUserFilterCounter]);



  return (
    <Box>
      <CompanySelector
        clients={clientList}
        company={company}
        setCompany={setCompany}
      />
      <TitleSelector titles={titles} title={title} setTitle={setTitle} />
      <UserRoleSelector userRolesList={userRolesList} role={role} setRole={setRole} />
      <StatusSelector
        statuses={statuses}
        status={status}
        setStatus={setStatus}
        placeholder="Select Status"
        heading="Status"
      />
      {/* <SigninActivitySelector
        signinActivities={signinActivities}
        signin={signin}
        setSignin={setSignin}
      /> */}
    </Box>
  );
}

export default UserManagementFilters;
