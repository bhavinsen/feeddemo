import { Typography } from "@mui/material";

import { StatusProps } from "./type";
export default function Status({ connected }: Readonly<StatusProps>) {
  return (
    <Typography
      variant="h6"
      component="div"
      sx={{ flexGrow: 1, justifyContent: "flex-start" }}
    >
      <span
        className="dot"
        style={
          connected ? { backgroundColor: "green" } : { backgroundColor: "red" }
        }
      ></span>
      {" "}
      <span>{connected ? "Connected" : "Disconnected"}</span>
    </Typography>
  );
}
