import AppBar from "@mui/material/AppBar";
import {
  Settings,
  BarChart,
  HelpOutline,
  RestartAlt,
} from "@mui/icons-material";
import { Box, Toolbar, Typography, Button, IconButton } from "@mui/material";

export default function Header({ clear, openCover }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="bg-[#111313] border border-b-gray-600 border-[#111313]">
          <IconButton onClick={clear} size="large" edge="start" sx={{ mr: 2 }}>
            <RestartAlt className="text-white" />
          </IconButton>
          <IconButton
            onClick={openCover}
            size="large"
            edge="start"
            sx={{ mr: 2 }}
          >
            <HelpOutline className="text-white" />
          </IconButton>
          <div className="w-full flex items-center justify-center">
            <Typography
              className="text-white font-bold"
              variant="h4"
              component="div"
            >
              <b>Wordle</b>
            </Typography>
          </div>
          <IconButton size="large">
            <BarChart className="text-white" />
          </IconButton>
          <IconButton size="large">
            <Settings className="text-white" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
