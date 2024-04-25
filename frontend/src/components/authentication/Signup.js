import React, { useState } from 'react'

import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel, Input, InputGroup, InputRightElement ,Button} from '@chakra-ui/react';

const Signup = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [image, setImage] = useState();

    const [show, setShow] = useState(false);

    const postDetails = (pics) => { }
    const submitHandler = ()=>{}
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
              <InputGroup>
                  <Input
                      placeholder='Enter Your Password'
                      onChange={(e) => { setPassword(e.target.value) }}
                      type={show ? "text" : "password"}
                  ></Input>

                  <InputRightElement width="4.5rem">
                      <Button
                          h="1.5rem" size="sm"
                          onClick={()=>setShow((prev)=>!prev)}
                      >
                          {show ? "hide" : "show"}
                      </Button>
                  </InputRightElement>
                 
              </InputGroup>
              
          </FormControl>
          <FormControl id='password' isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                  <Input
                      placeholder='Confirm  Your Password'
                      onChange={(e) => { setConfirmPassword(e.target.value) }}
                      type={show ? "text" : "password"}
                  ></Input>

                  <InputRightElement width="4.5rem">
                      <Button
                          h="1.5rem" size="sm"
                          onClick={() => setShow((prev) => !prev)}
                      >
                          {show ? "hide" : "show"}
                      </Button>
                  </InputRightElement>
              </InputGroup>
          </FormControl>

          <FormControl id='pic'>
              <FormLabel>Upload Your picture</FormLabel>
              <Input
                  type='file'
                  p={1.5}
                  accept='image/*'
                  onChange={(e) => postDetails(e.target.files[0])}
                  
              ></Input>
          </FormControl>
          <Button
              colorScheme="blue"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={submitHandler}
          >
            Sign Up 
          </Button>
      </VStack>
  )
}

export default Signup