import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { CurrencyCardProps } from "./type";

export default function CurrencyCard({
  title,
  data,
  handleUnSubscribe,
}: Readonly<CurrencyCardProps>) {
  return (
    <div style={{ margin: "5%" }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h3" gutterBottom style={{ textAlign: "center" }}>
            {title}
          </Typography>

          <Typography variant="body1">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">price</TableCell>
                    <TableCell align="right">best_ask</TableCell>
                    <TableCell align="right">best_ask_size</TableCell>
                    <TableCell align="right">best_bid</TableCell>
                    <TableCell align="right">best_bid_size</TableCell>
                    <TableCell align="right">high_24h</TableCell>
                    <TableCell align="right">last_size</TableCell>
                    <TableCell align="right">low_24h</TableCell>
                    <TableCell align="right">open_24h</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{data?.price}</TableCell>
                    <TableCell align="right">{data?.best_ask}</TableCell>
                    <TableCell align="right">{data?.best_ask_size}</TableCell>
                    <TableCell align="right">{data?.best_bid}</TableCell>
                    <TableCell align="right">{data?.best_bid_size}</TableCell>
                    <TableCell align="right">{data?.high_24h}</TableCell>
                    <TableCell align="right">{data?.last_size}</TableCell>
                    <TableCell align="right">{data?.low_24h}</TableCell>
                    <TableCell align="right">{data?.open_24h}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
          <Typography variant="body1">
            <div style={{paddingTop: '10px'}} className={data?.side === "buy" ? "buy" : "sell"}>
              {data?.product_id}: {data?.size} @ {data?.price} ({data?.side}) at{" "}
              {data?.time}
            </div>
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Button
            style={{ textAlign: "center" }}
            variant="contained"
            size="small"
            onClick={() => handleUnSubscribe(title)}
          >
            UnsubScribe
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
