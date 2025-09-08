import {
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { getFeaturePermissionStatus } from "../../../utils/helper/UserRoleUtils";
import { useRoleContext } from "../../../context/UserRoleManagementContext";
import { wrapText } from "../../../utils/helper/WrapText";

const cellStyle = {
  whiteSpace: "nowrap",
  borderRight: "1px solid #ddd",
  textAlign: "center",
  py: 0.5,
  fontSize: "13px",
  fontWeight: "400",
};

const headerCheckboxStyle = {
  color: "#00A398",
  "&.Mui-checked": { color: "#00A398" },
};

function UserRoleManagementTableBody({ selectedRole = [], edit, roleId }) {
  const {
    selectedEditRoleState,
    setselectedEditRoleState,
    changedPermission,
    setChangedPermission,
  } = useRoleContext();
  const updateStatus = (roleId, featureId, permissionId, newStatus) => {
    const status = newStatus ? "1" : "0";

    setChangedPermission((prevChanges) => {
      const existingIndex = prevChanges.findIndex(
        (change) =>
          change.roleId === roleId &&
          change.featureId === featureId &&
          change.permissionId === permissionId
      );

      if (existingIndex > -1) {
        const updatedChanges = [...prevChanges];
        updatedChanges[existingIndex].status = status;
        return updatedChanges;
      } else {
        return [...prevChanges, { roleId, featureId, permissionId, status }];
      }
    });

    const updatedRoles = selectedEditRoleState.map((item) => {
      if (
        item.roleId === roleId &&
        item.featureId === featureId &&
        item.permissionId === permissionId
      ) {
        return { ...item, status };
      }
      return item;
    });

    setselectedEditRoleState(updatedRoles);
  };

  return (
    <>
      <TableBody>
        {selectedRole?.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell sx={{ ...cellStyle, textAlign: "left" }}>
              <Typography sx={{ color: "#404040", fontSize: "13px" }}>
                {row?.feature}
              </Typography>
              <Typography sx={{ color: "#9F9F9F", fontSize: "13px" }}>
                {row?.description}
              </Typography>
            </TableCell>
            {row?.permissions?.map((item, index) => {
              return (
                <TableCell key={index} sx={cellStyle}>
                  <Checkbox
                    id={item.permissionId}
                    sx={headerCheckboxStyle}
                    checked={getFeaturePermissionStatus(
                      selectedEditRoleState,
                      roleId,
                      row.featureId,
                      item.permissionId
                    )}
                    onChange={(e) => {
                      updateStatus(
                        roleId,
                        row.featureId,
                        item.permissionId,
                        e.target.checked
                      );
                    }}
                    disabled={!edit}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

export default UserRoleManagementTableBody;
