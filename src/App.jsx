import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import muiLogo from "/mui.svg";
import { Button, Typography, Box, Link, Grid, Tooltip, Container } from "@mui/joy";
import { Add } from "@mui/icons-material";
import WebScraper from "./components/WebScraper";
import Calculator from "./components/Calculator";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Calculator />
      {/* <WebScraper/> */}
    </Container>
  );
}

export default App;
