import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input,
  Box
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../context/ChatProvider.js'
import axios from "axios"
import UserListItem from '../components/UserAvatar/UserListItem.js'
import UserBadgeItem from '../components/UserAvatar/UserBadgeItem.js'



const GroupChatModal = ({ children }) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    //console.log('in handle search');
    setSearch(query);
    if (!search) { 
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
         Authorization : `Bearer ${user.token}`
       }
     }

      const { data } = await axios.get(`/api/v1/user?search=${search}`, config);
      //console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

  }
  const handleSubmit = async () => {
    //console.log(groupChatName);
    //console.log(selectedUsers);
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization : `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post('/api/v1/chat/group', {
        name: groupChatName,
        users : JSON.stringify(selectedUsers.map(u=>u._id))
      }, config)
      console.log(data);
      setChats([data, ...chats])
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  const handleDelete = (userToDelete) => {
    
    setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
  }
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    
    setSelectedUsers([...selectedUsers, userToAdd]);


  }

  return (
    <>
      <span onClick={onOpen}>{ children }</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder='chat name '
                mb={3}
                onChange={(e) => { setGroupChatName(e.target.value) }}></Input>
              
            </FormControl>
            <FormControl>
              <Input
                placeholder='search users '
                mb={1}
                onChange={(e) =>handleSearch(e.target.value) }></Input>
            </FormControl>
            {/* render all selected user */}


            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* render searched user */}

            {
              loading ? (<div>Loading...</div>) : (
                searchResult?.slice(0, 4).map(user => {
                  return (<UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>{handleGroup(user)}}
                  />)
                })
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create chat
            </Button>
            
          </ModalFooter>  
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal