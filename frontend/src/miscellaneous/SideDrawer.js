import {
  Box,
  Button,
  MenuButton,
  Menu,
  Text,
  Tooltip,
  Avatar,
  MenuList,
  DrawerHeader,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  
} from '@chakra-ui/react';
import axios from "axios";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider.js'
import ProfileModal from './ProfileModal.js';
import ChatLoading from '../components/ChatLoading.js';
import UserListItem from '../components/UserAvatar/UserListItem.js';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';

const SideDrawer = () => {
  
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user,setSelectedChat , chats , setChats } = ChatState();
  //console.log(user);

  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('user-info');
    history.push('/')
  }
  


  const handleSearch = async() => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization : `Bearer ${user.token}`
        }
      }

      const { data } = await axios.get(`/api/v1/user?search=${search}`, config)
      //console.log(data);
      
      setLoading(false)
      setSearchResult(data)
      //console.log(data);
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


  const accessChat = async (userId) => {
    console.log(userId);
      try {
        setLoadingChat(true);

        const config = {
          headers: {
            'Content-type' : "application/json",
            Authorization : `Bearer ${user.token}`
          }
        }

        const { data } = await axios.post('/api/v1/chat', { userId }, config);
        //console.log(data);
        if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
        }

        setSelectedChat(data);
        setLoading(false)
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }
  return (
    <>
      


      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search user to chat"
          hasArrow
          placement='bottom-end'
        >
          <Button variant='ghost' onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{base : 'none',md:'flex'}} px='4'>
              Search User
            </Text>
            
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <BellIcon fontSize="2xl" ml={2} marginTop={1.5} marginRight={2}/>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.image} />

          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
        </div>
      </Box>
      <Drawer
        placement='left'
        onClose={onClose}
        isOpen={isOpen} >
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading />) : (
              searchResult?.map(user => {
                 return (<UserListItem
                  key={user._id}
                  user={user}
                  handleFunction = {()=>accessChat(user._id)}
                />)
              })
            )}
            {loadingChat && <Spinner ml='auto' display='flex'></Spinner>}
          </DrawerBody>

        </DrawerContent>
        
      </Drawer> */}
    </>
  )
}

export default SideDrawer