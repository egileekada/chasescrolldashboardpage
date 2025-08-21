import CustomText from '@/components/general/Text'
import { DashboardMenuIcon, LoginTwo } from '@/components/svg'
import { NewChatIcon, NewWalletIcon, NotificationIcon } from '@/components/svg/sidebarIcons'
import useCustomTheme from '@/hooks/useTheme'
import { Box, Button, Flex, Switch, Text, Tooltip, VStack, useColorMode } from '@chakra-ui/react'
import { LogoutCurve, SearchNormal1, Setting, Warning2 } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import router from 'next/router'
import React, { useState } from 'react'
import { IoClose, IoArrowForward } from 'react-icons/io5'
import ModalLayout from '../modal_layout'
import { useDetails } from '@/global-state/useUserDetails'
import { signOut } from 'next-auth/react'
import useModalStore from '@/global-state/useModalSwitch'
import { LANDINGPAGE_URL } from '@/services/urls'

export default function DashboardMenuBtn({ count }: { count?: any }) {
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)

    const {
        bodyTextColor,
        primaryColor,
        mainBackgroundColor
    } = useCustomTheme()

    const router = useRouter()
    const { setGoogle, notifyModal, setNotifyModal } = useModalStore((state) => state);
    const { colorMode, toggleColorMode } = useColorMode();

    const handleClick = (item: string) => {
        if (item === "logout") {
            setShow(true)
        } else {
            router?.push(item)
        }

        setOpen(false)
    }

    const logout = async () => {
        window.location.href = `${LANDINGPAGE_URL}/logout`;
    }

    const clickHandler = () => {
        router.push("/dashboard/notification")
        setOpen(false)
    }

    return (
        <Box w={"fit-content"} h={"fit-content"} >
            <Box as='button' mt={"8px"} onClick={() => setOpen(true)} >
                <DashboardMenuIcon color={bodyTextColor} />
            </Box>
            {open && (
                <Flex zIndex={"210"} position={"absolute"} top={"70px"} flexDir={"column"} right={"2"} maxW={"170px"} w={"full"} py={"4"} px={"4"} bg={mainBackgroundColor} rounded={'8px'} >
                    <Flex zIndex={20} flexDir={"column"} gap={"3"}  >

                        <Flex onClick={() => handleClick("/dashboard/chats")} h={"20px"} gap={"1"} alignItems={"center"} as='button' >
                            <Flex justifyContent={"center"} w={"20px"} >
                                <NewChatIcon />
                            </Flex>
                            <Text fontSize={"12px"} >Message</Text>
                        </Flex>
                        <Flex onClick={() => handleClick("/dashboard/explore")} h={"20px"} gap={"1"} alignItems={"center"} as='button' >
                            <Flex justifyContent={"center"} w={"20px"} >
                                <SearchNormal1 color={bodyTextColor} size={"20px"} />
                            </Flex>
                            <Text fontSize={"12px"} >Explore</Text>
                        </Flex>

                        <Flex w={"full"} h={"20px"} gap={"2"} alignItems={"center"} >
                            <Tooltip label={"darkmode"} fontSize='sm'>
                                <Box>
                                    <Switch isChecked={colorMode === 'dark'} size={'md'} onChange={() => toggleColorMode()} />
                                </Box>
                            </Tooltip>

                            <Text fontSize={"12px"} >Dark Mode</Text>
                        </Flex>
                        <Flex onClick={() => handleClick("/dashboard/settings")} h={"20px"} gap={"2"} alignItems={"center"} as='button' >
                            <Flex justifyContent={"center"} w={"20px"} >
                                <Setting color={bodyTextColor} size={"20px"} />
                            </Flex>
                            <Text fontSize={"12px"} >Settings</Text>
                        </Flex>
                        <Flex gap={"2"} onClick={() => handleClick("logout")}  >
                            <Flex justifyContent={"center"} w={"20px"} >
                                <LogoutCurve color='red' size={'20px'} variant='Outline' />
                            </Flex>
                            <Text fontSize={"12px"} >Log Out</Text>
                        </Flex>
                    </Flex>
                </Flex>
            )}
            {open && (
                <Box position={"fixed"} onClick={() => setOpen(false)} inset={'0px'} zIndex={"200"} bg={"black"} opacity={"50%"} />
            )}

            <ModalLayout size={"sm"} open={show} close={setShow} >
                <Flex
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                    gap={6}
                    rounded={"lg"}
                    flexDirection={"column"}
                    bgColor={mainBackgroundColor}
                    p={"6"}
                    alignItems={"center"}
                >
                    <Flex
                        borderRadius={"full"}
                        justifyContent={"center"}
                        bg="#df26263b"
                        alignItems={"center"}
                    >
                        <LoginTwo />
                    </Flex>
                    <Text fontSize={"18px"} fontWeight={"600"} >
                        Are you sure you want to logout?
                    </Text>
                    <Flex justifyContent={"center"} flexDirection={"column-reverse"} roundedBottom={"lg"} gap={"3"} width={"100%"}>
                        <Button
                            // outlineColor={"brand.chasescrollButtonBlue"}
                            borderColor={primaryColor}
                            borderWidth={"1px"}
                            width="full"
                            fontWeight={"600"}
                            outline={"none"}
                            _hover={{ backgroundColor: "white" }}
                            bg={"white"}
                            rounded={"full"}
                            height={"45px"}
                            color={primaryColor}
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            borderColor={"red"}
                            borderWidth={"1px"}
                            rounded={"full"}
                            _hover={{ backgroundColor: "red" }}
                            bg="red"
                            width="full"
                            fontWeight={"600"}
                            height={"45px"}
                            color="white"
                            onClick={logout}
                        >
                            Log out
                        </Button>
                    </Flex>
                </Flex>
            </ModalLayout>
        </Box>
    )
}
