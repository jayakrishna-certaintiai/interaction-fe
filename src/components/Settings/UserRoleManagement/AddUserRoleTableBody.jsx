import {
  Checkbox,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { getFeaturePermissionAddStatus } from "../../../utils/helper/UserRoleUtils";
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

function AddUserRoleTableBody({ selectedRole = [] }) {
  const { setselectedAddRoleState, selectedAddRoleState } = useRoleContext();
  const updateStatus = (featureId, permissionId, newStatus) => {
    const status = newStatus ? "1" : "0";

    const updatedRoles = selectedAddRoleState.map((item) => {
      if (item.featureId === featureId && item.permissionId === permissionId) {
        return { ...item, status };
      }
      return item;
    });

    setselectedAddRoleState(updatedRoles);
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
                    checked={getFeaturePermissionAddStatus(
                      selectedAddRoleState,
                      row.featureId,
                      item.permissionId
                    )}
                    onChange={(e) => {
                      updateStatus(
                        row.featureId,
                        item.permissionId,
                        e.target.checked
                      );
                    }}
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

export default AddUserRoleTableBody;
