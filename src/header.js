import AppBar from "@mui/material/AppBar";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="bg-[#111313]">
          <IconButton
            onClick={() => localStorage.clear()}
            size="large"
            edge="start"
            sx={{ mr: 2 }}
          >
            <RestartAltIcon className="text-white" />
          </IconButton>
          <div className="w-full flex items-center justify-center">
            <Typography
              className="text-white font-bold"
              variant="h5"
              component="div"
            >
              Wordle
            </Typography>
          </div>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
