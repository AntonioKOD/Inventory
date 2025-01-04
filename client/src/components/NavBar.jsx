import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Auth from '../utils/auth'; // Ensure this is the correct import path for Auth
import { useQuery } from '@apollo/client';
import { ME } from '../utils/queries';



function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const {loading,error, data} = useQuery(ME);
  
 
  const user = data?.me;


  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  if(loading) return <h1>Loading</h1>
  if(error){
    console.error('Error: ', error.message)
  }

  console.log(user)
  


  return (

    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Inventory App
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {Auth.loggedIn() ? (
                <>
                  <MenuItem onClick={Auth.logout}>
                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/me" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography sx={{ textAlign: 'center' }}>My Profile</Typography>
                    </Link>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography sx={{ textAlign: 'center' }}>Signup</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography sx={{ textAlign: 'center' }}>Login</Typography>
                    </Link>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Auth.loggedIn() ? (
              <>
                <Button onClick={Auth.logout} sx={{ my: 2, color: 'white', display: 'block' }}>
                  Logout
                </Button>
                <Link to="/me" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>My Profile</Button>
                </Link>
              
              {user.role === 'admin' ? (
              <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>Dashboard</Button>
                </Link>
            ) : (
              <Link to="/managerDashboard" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>Edit Items</Button>
                </Link>
            )}
            </>
            
            ) : (
              <>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>Signup</Button>
                </Link>
                <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>Login</Button>
                </Link>
              </>
            )}
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;