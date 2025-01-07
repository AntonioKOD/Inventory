
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './components/Home.jsx'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme } from '@mui/material'
import Signup from './components/Signup.jsx'
import Login from './components/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Manager from './pages/Manager.jsx'
import SearchResults from './components/SearchResults.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#dc004e', // Custom secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Custom font family
  },

})


const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    errorElement: <h1 className='display-2'>Wrong Route</h1>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: '/signup',
        element: <Signup/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: 'dashboard',
        element: <Dashboard/>
      },
      {
        path: 'managerDashboard',
        element: <Manager/>
      },
      {
        path: 'search',
        element: <SearchResults/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
)
