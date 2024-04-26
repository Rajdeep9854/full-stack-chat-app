import React, { useState } from 'react'

import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel, Input, InputGroup, InputRightElement ,Button} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom';

const Signup = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();

    const [show, setShow] = useState(false);

    // for image uploading in cloudinary
    const postDetails = (pics) => { 
        setLoading(true);

        if (pics===undefined) {
            toast({
                title: "please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
            return;
        }

        if (pics.type === 'image/jpeg' ||
            pics.type === 'image/jpg' ||
            pics.type === 'image/png') {
            
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', "chat_app")
            data.append('cloud_name', "dywskxcm4")
            

            fetch('https://api.cloudinary.com/v1_1/dywskxcm4/image/upload', {
                method: 'post',
                body : data
            }).then(res=>res.json())
                .then(data => {
                    setImage(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                }).catch(err => {
                    console.log(err);
                    setLoading(false)
              })           
        } else {
            toast({
                title: "plaese select an image",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position : 'bottom'
            })
        }
    }

    // after submit the data 
    const submitHandler = async() => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword || !image) {
            toast({
                title: "please fill all the details",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: "passwords do not match",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            //setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            const {data} = await axios.post('/api/v1/user', {
                name , email,password,image
            }, config)
            toast({
                title: 'Registration successful',
                status: "success",
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })

            localStorage.setItem('user-info', JSON.stringify(data))
            console.log(data);
            setLoading(false)
            history.push('/chats')
        } catch (error) {
            toast({
                title: 'Error occoured',
                description:"error.response.data.message",
                status: "error",
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            setLoading(false)
        }
        
    }
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
              isLoading={loading}
          >
            Sign Up 
          </Button>
      </VStack>
  )
}

export default Signup