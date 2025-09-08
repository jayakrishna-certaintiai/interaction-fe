import { Box, List, ListItem, ListItemText, Popover } from "@mui/material";
import React from "react";

function TableHeaderDropdown({anchorEl, onClose, items, handleMenuItemClick }) {
  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box>
          <List sx={{ cursor: "pointer" }}>
            {items?.map((item) => (
              <ListItem key={item} onClick={() => handleMenuItemClick(item)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}

export default TableHeaderDropdown;
