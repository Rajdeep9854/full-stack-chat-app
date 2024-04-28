import React, { useEffect } from 'react'
import {
  Container, Box, Text, Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import { Login } from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import { useHistory } from 'react-router-dom'

const HomePage = () => {

  const history = useHistory();

  useEffect(() => {
    
      const user =JSON.parse(localStorage.getItem("user-info"));
      if (user) {
        history.push('/chats')
      }
    }, [history])
  
  
  return (
    <Container maxW='xl' centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      
      >
        <Text
          fontSize='4xl'
          fontFamily='work sans'
          color='black'
        >Talk-A-Tive</Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" color='black' borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             <Login></Login>
            </TabPanel>
            <TabPanel>
              <Signup></Signup>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

    </Container>
  )
}

export default HomePage