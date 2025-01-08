import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { ME } from '../utils/queries';
import { Autocomplete, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { loading, data } = useQuery(ME, { fetchPolicy: 'cache-and-network' }); // Optimize with fetch policy
  const navigate = useNavigate();

  const user = data?.me;

  useEffect(() => {
    if (loading) {
      console.log('Navbar is loading user data...');
    }
  }, [loading]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
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

          {/* Admin-only Search Bar */}
          {Auth.loggedIn() && user?.role === 'admin' && (
            <Box
              sx={{
                flexGrow: 1,
                mx: 2,
                maxWidth: '600px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: 1,
              }}
            >
              <Autocomplete
                freeSolo
                id="search-bar"
                disableClearable
                options={[]} // Placeholder for dynamic options
                onInputChange={handleSearchChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Search"
                    variant="outlined"
                    onKeyDown={handleSearchSubmit}
                    InputProps={{
                      ...params.InputProps,
                      sx: { paddingRight: '40px' },
                      endAdornment: (
                        <SearchIcon
                          sx={{ cursor: 'pointer', marginLeft: '-35px' }}
                          onClick={() => {
                            if (searchTerm.trim()) {
                              console.log(`Search initiated for: ${searchTerm}`);
                              navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                            }
                          }}
                        />
                      ),
                    }}
                  />
                )}
              />
            </Box>
          )}

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
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
                    <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography sx={{ textAlign: 'center' }}>View Dashboard</Typography>
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
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {Auth.loggedIn() ? (
              <>
                <Button onClick={Auth.logout} sx={{ my: 2, color: 'white', display: 'block' }}>
                  Logout
                </Button>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>View Dashboard</Button>
                </Link>
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