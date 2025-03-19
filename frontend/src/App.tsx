import { useCallback, useEffect, useState } from "react";
import { toast } from "material-react-toastify";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid2";

import Status from "./components/status";
import ToolTipButton from "./components/button";
import CurrencyCard from "./components/card";
import { useSocket } from "./contexts/socket";

import { products } from "./utils/constant";

function App() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const [subscribeList, setSubscribeList] = useState([]);

  const socket = useSocket();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnected(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("ticker", (data: any) => {
      setData(data);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on("ticker-error", (data: any) => {
      toast.error(`${data.message}. ${data.reason}.`);
    });

    socket.on("disconnect", () => {
      socket.emit("unsubscribe", subscribeList);
      setSubscribeList([]);
      setConnected(false);
    });
  }, [socket]);

  const handleSubscribe = (product: string) => {
    if (!connected) {
      toast.error("Socket server is not running.");
      return;
    }
    socket.emit("subscribe", [product]);
    setSubscribeList([...subscribeList, product]);
  };

  const handleUnSubscribe = (product: string) => {
    const findList = subscribeList.filter((list: string) => list === product);
    if (data?.[product]) {
      socket.emit("unsubscribe", [subscribeList[findList]]);
      setData(null);
    }
    setSubscribeList(subscribeList.filter((list: string) => list !== product));
  };

  const checkSubscription = useCallback(
    (product: string) => {
      const findList = subscribeList.findIndex(
        (list: string) => list === product
      );
      if (findList >= 0) return true;
      return false;
    },
    [subscribeList]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Status connected />
          {products.map((product: string) => {
            return (
              <ToolTipButton
                key={product}
                checkSubscription={() => checkSubscription(product)}
                text={product}
                handleSubscribe={handleSubscribe}
              />
            );
          })}
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {subscribeList.map((list: string) => {
            return (
              <Grid size={4} key={list}>
                <CurrencyCard
                  title={list}
                  data={data?.[list]}
                  handleUnSubscribe={handleUnSubscribe}
                ></CurrencyCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default App;
