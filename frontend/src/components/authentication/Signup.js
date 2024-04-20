import React, { useState } from 'react'

import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel, Input } from '@chakra-ui/react';

const Signup = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [image, setImage] = useState();
  return (
      <VStack spacing="5px" color='black'>
          <FormControl id='first-name' isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                  placeholder='Enter Your Name'
                  onChange={(e)=>{setName(e.target.value)}}
              ></Input>
          </FormControl>
          <FormControl id='email' isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                  placeholder='Enter Your Email'
                  onChange={(e) => { setEmail(e.target.value) }}
              ></Input>
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                  placeholder='Enter Your Password'
                  onChange={(e) => { setName(e.target.value) }}
              ></Input>
          </FormControl>
      </VStack>
  )
}

export default Signup