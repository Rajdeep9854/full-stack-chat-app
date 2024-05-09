import React, { useEffect, useState } from 'react'
import "./styles.css";
import { ChatState } from '../context/ChatProvider'
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal.js'
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal.js';
import axios from 'axios';
import ScrollableChat from './ScrollableChat.js';
//import { sendMessage } from '../../../backend/controllers/message.controller.js';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    
    const { user, selectedChat, setSelectedChat } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`/api/v1/message/${selectedChat._id}`, config)
            console.log(data);
            //console.log(messages);
            setMessages(data);
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    
    useEffect(() => {
        fetchMessages();
    }, [selectedChat])
    


    const sendMessage = async(event) => {
        if (event.key === 'Enter' && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": 'application/json',
                        Authorization : `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const {data} = await axios.post('/api/v1/message', {
                    content: newMessage,
                    chatId : selectedChat._id
                }, config)
                //console.log(data);
                setMessages([...messages, data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        } else {
            
        }
    }

    const typingHandler = (event) => {
        setNewMessage(event.target.value)
    }
  return (
      <>
          {selectedChat ? (
              <>
                  <Text
                      fontSize={{ base: "28px", md: "30px" }}
                      pb={3}
                      px={2}
                      w="100%"
                      fontFamily="Work sans"
                      display="flex"
                      justifyContent={{ base: "space-between" }}
                      alignItems="center"
                  >
                      <IconButton
                          display={{ base: "flex", md: "none" }}
                          icon={<ArrowBackIcon />}
                          onClick={() => setSelectedChat("")}
                      />
                      {
                          !selectedChat.isGroupChat ? (
                              <>
                                  {getSender(user, selectedChat.users)}
                                  <ProfileModal user={getSenderFull(user, selectedChat.users)}></ProfileModal>
                              </>) : (
                              <>
                                  {selectedChat.chatName.toUpperCase()}
                                  <UpdateGroupChatModal 
                                      fetchAgain={fetchAgain}
                                      setFetchAgain={setFetchAgain}
                                      fetchMessage={fetchMessages}
                                    />
                              </>
                          )
                      }
                  </Text>
                  <Box
                  
                      display="flex"
                      flexDir="column"
                      justifyContent="flex-end"
                      p={3}
                      bg="#E8E8E8"
                      w="100%"
                      h="100%"
                      borderRadius="lg"
                      overflowY="hidden">
                      {loading ? (<Spinner
                          size="xl"
                          w={20}
                          h={20}
                          alignSelf="center"
                          margin="auto"
                      >
                          
                      </Spinner>) : (
                              <>
                                  <div className='messages'>
                                      <ScrollableChat messages={messages}  />
                                  </div>
                              </>     
                      )}
                      <FormControl
                          onKeyDown={sendMessage}
                          isRequired
                          mt={3}
                        >
                          <Input variant="filled"
                              bg="#E0E0E0"
                              placeholder="Enter a message.."
                              onChange={typingHandler}
                              value={newMessage}
                            />
                      </FormControl>

                  </Box>
          </>) : (
              <Box display="flex"
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
              >
                  <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                      Click on a user to start chatting
                  </Text>
              </Box>
          )}
    </>
  )
}

export default SingleChat