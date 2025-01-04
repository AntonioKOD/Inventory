import {Outlet} from 'react-router-dom'
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import './App.css'
import  BottomNavbar from './components/NavBar.jsx'


const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // Absolute URL to your GraphQL endpoint
});

const authLink = setContext((_, {headers}) => {
  const token = localStorage.getItem('id_token')
  return {
    headers: {
      ...headers, 
      authorization: token ? `Bearer ${token}`: '',
    }
  }
}
)
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

// eslint-disable-next-line react/prop-types
function App() {
 

  return (
    <ApolloProvider client={client}>
      <>
      
      <BottomNavbar/>
        <Outlet/>
        
      </>
    </ApolloProvider>

    
  )
}

export default App
