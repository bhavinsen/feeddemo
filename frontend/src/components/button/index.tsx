import { useMemo } from "react";
import { Tooltip, Button } from "@mui/material";

import { ButtonProps } from "./type";
export default function ToolTipButton({
  checkSubscription,
  text,
  handleSubscribe,
}: Readonly<ButtonProps>) {
  const check = useMemo(() => {
    return checkSubscription(text);
  }, [checkSubscription, text]);

  return (
    <Tooltip title={check ? `Subscribed to ${text}` : `Subscribe to ${text}`}>
      {" "}
      <Button
        style={{ marginRight: 10 }}
        color="inherit"
        disabled={check}
        variant="outlined"
        onClick={() => handleSubscribe(text)}
      >
        {text}
      </Button>
    </Tooltip>
  );
}
