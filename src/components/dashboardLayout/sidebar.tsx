"use client"
import useCustomTheme from "@/hooks/useTheme";
import { Flex, Box, Image, Switch, Spinner, Button, useColorMode, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react"; 
import useGetUser from "@/hooks/useGetUser";
import UserImage from "../sharedComponent/userimage";
import ModalLayout from "../sharedComponent/modal_layout"; 
import useModalStore from "@/global-state/useModalSwitch";
import NotificationBar from "../notification";
import { KisokIcon, NotificationIcon, SidebarEventIcon, SidebarHomeIcon, SidebarLogoutIcon, SidebarMessageIcon, SidebarSearchIcon, SidebarWalletIcon } from "../svg/sidebarIcons";
import { EVENTPAGE_URL, LANDINGPAGE_URL } from "@/services/urls"; 
import { Login, LoginTwo } from "../svg";

export default function SideBar({count} : {count: string}) {


    type IRoute = {
        icon: ReactNode;
        text: string;
        route: string;
    }

    const router = useRouter()

    const { user, loadingUserInfo, show } = useGetUser()

    const [open, setOpen] = useState(false)
    const [activeBar, setActiveBar] = useState("")
    const { borderColor, mainBackgroundColor, secondaryBackgroundColor, primaryColor } = useCustomTheme()
    const { colorMode, toggleColorMode } = useColorMode();
    const { notifyModal, setNotifyModal } = useModalStore((state) => state);

    const logout = async () => {
        window.location.href = `${LANDINGPAGE_URL}/logout`;
    }

    const login = async () => {
        window.location.href = `${LANDINGPAGE_URL}/logout`; 

    } 

    const pathname = usePathname()
    const routes: IRoute[] = [
        {
            route: '/dashboard',
            icon: <SidebarHomeIcon color={pathname === "/dashboard" ? true : false} />,
            text: 'Home'
        },
        {
            route: '/dashboard/explore',
            icon: <SidebarSearchIcon color={pathname?.includes("explore") ? true : false} />,
            text: 'Explore'
        },
        {
            route: '/product/events',
            icon: <KisokIcon color={(pathname?.includes('product') || pathname?.includes('kiosk') || pathname?.includes('donation') || pathname?.includes('event')) ? true : false} />,
            text: 'Event Hub'
        },
        {
            route: '/dashboard/chats',
            icon: <SidebarMessageIcon color={pathname === "/dashboard/chats" ? true : false} />,
            text: 'Chats'
        },
        {
            route: '/dashboard/community',
            icon: <SidebarEventIcon color={pathname === "/dashboard/community" ? true : false} />,
            text: 'Community'
        },
        {
            route: '/dashboard/notification',
            icon: <NotificationIcon color={pathname === "/dashboard/notification" ? true : false} />,
            text: 'Notification'
        },
        {
            route: `/dashboard/settings/payment/details`,
            icon: <SidebarWalletIcon color={pathname === "/dashboard/settings/payment/details" ? true : false} />,
            text: 'Wallet'
        }
    ];
 
    const newtheme = localStorage.getItem("chakra-ui-color-mode") as string

    const clickHandler = (item: string) => {
        if (item === '/product/events') {
            window.location.href = `${EVENTPAGE_URL}/product/events?theme=${newtheme}`;
        } else {
            router.push(item)
        }
    } 

    const ToolTip = ({ content }: { content: string }) => {
        return (
            <>
                {activeBar === content && (
                    <Flex pos={"absolute"} justifyContent={"center"} alignItems={"center"} py={"1"} fontSize={"12px"} fontWeight={"medium"} rounded={"6px"} bottom={"-13px"} w={"fit"} px={"2"} bgColor={secondaryBackgroundColor}  >
                        {content}
                    </Flex>
                )}
            </>
        )
    }

    return (
        <Flex w={"fit-content"} h={"screen"} bgColor={mainBackgroundColor} display={["none", "none", "none", "flex", "flex"]} >
            <Flex w={"110px"} h={"screen"} gap={"4"} overflowY={"auto"} flexDir={"column"} py={"4"} alignItems={"center"} justifyContent={"space-between"} borderRightColor={borderColor} borderRightWidth={"1px"} >
                <Box as='button' onClick={() => router?.push("/")} >
                    <Image alt='logo' src='/images/logo.png' w={"50px"} />
                </Box>
                <Flex flexDir={"column"} alignItems={"center"} gap={"3"} >
                    {routes?.map((item, index) => (
                        <Flex cursor={"pointer"} key={index}>
                            {item?.text !== "Notification" && (
                                <Flex onMouseOver={() => setActiveBar(item?.text)} onMouseOut={() => setActiveBar("")} pos={"relative"} cursor={"pointer"} onClick={() => clickHandler(item?.route)} key={index} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                                    <Box>
                                        {item?.icon}
                                    </Box>
                                    <ToolTip content={item?.text} />
                                </Flex>
                            )}
                            {item?.text === "Notification" && (
                                <Flex onMouseOver={() => setActiveBar(item?.text)} onMouseOut={() => setActiveBar("")} onClick={() => clickHandler(item?.route)} cursor={"pointer"} key={index} w={"75px"} h={"56px"} position={"relative"} justifyContent={"center"} alignItems={"center"} >
                                    <Box>
                                        {item?.icon}
                                    </Box>
                                    <ToolTip content={item?.text} />

                                    {count && (
                                        <Flex w={"5"} h={"5"} rounded={"full"} bg={primaryColor} color={"white"} justifyContent={"center"} position={"absolute"} top={"1"} right={"2"} alignItems={"center"} fontWeight={"semibold"} fontSize={"12px"}  >
                                            {count}
                                        </Flex>
                                    )}
                                </Flex>
                            )}
                        </Flex>
                    ))}
                </Flex>

                <Flex flexDir={"column"} alignItems={"center"} >

                    <Flex position={"relative"} onMouseOver={() => setActiveBar("darkmode")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                        <Box>
                            <Switch isChecked={colorMode === 'dark'} size={'md'} onChange={() => toggleColorMode()} /> 
                        </Box>
                        <ToolTip content={"darkmode"} />
                    </Flex>
                    <Flex cursor={"pointer"} onClick={() => router?.push(`/dashboard/profile/${user?.userId}`)} position={"relative"} onMouseOver={() => setActiveBar("profile")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"72px"} justifyContent={"center"} alignItems={"center"} >
                        <Flex w={"full"} h={"60px"} justifyContent={"center"} pt={"3"} >
                            {loadingUserInfo ? (
                                <Spinner color={primaryColor} />
                            ) : (
                                <UserImage size={"36px"} border={"1px"} font={"16px"} data={user} image={user?.data?.imgMain?.value} />
                            )}
                        </Flex>
                        <ToolTip content={"profile"} />
                    </Flex>

                    <Flex cursor={"pointer"} onClick={() => setOpen(true)} position={"relative"} onMouseOver={() => setActiveBar("logout")} onMouseOut={() => setActiveBar("")} w={"75px"} h={"56px"} justifyContent={"center"} alignItems={"center"} >
                        <Box>
                            <SidebarLogoutIcon />
                        </Box>
                        <ToolTip content={"logout"} />
                    </Flex>
                </Flex>
            </Flex>

            {/* <PageLoader show={!data?.email} /> */}
            <ModalLayout size={"sm"} open={open} close={setOpen} >
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

            <ModalLayout size={"sm"} open={show} close={()=> console.log("logout")} >
                <Flex
                    width={"100%"}
                    height={"100%"}
                    justifyContent={"center"}
                
                    rounded={"lg"}
                    flexDirection={"column"}
                    bgColor={mainBackgroundColor}
                    p={"6"}
                    alignItems={"center"}
                >
                    <Flex
                        width="60px"
                        height={"60px"}
                        borderRadius={"full"}
                        justifyContent={"center"}
                        bg="#df26263b"
                        alignItems={"center"}
                    >
                        <Login />
                    </Flex>
                    <Text fontSize={"24px"} mt={"4"} fontWeight={"600"} >
                        Session Expired
                    </Text>
                    <Text fontSize={"sm"} textAlign={"center"} >Your session has expired. please log in again to continue</Text>
                    <Flex justifyContent={"center"} mt={4} roundedBottom={"lg"} gap={"3"} width={"100%"}>
                        <Button
                            borderColor={primaryColor}
                            borderWidth={"1px"}
                            rounded={"full"}
                            _hover={{ backgroundColor: primaryColor }}
                            bg={primaryColor}
                            width="60%"
                            fontWeight={"600"}
                            height={"45px"}
                            color="white"
                            onClick={login}
                        >
                            Login
                        </Button> 
                    </Flex>
                </Flex>
            </ModalLayout>
            <ModalLayout open={notifyModal} size={["full", "xl", "xl"]} title={"Notification"} close={setNotifyModal} >
                <NotificationBar />
            </ModalLayout>
        </Flex>
    )
}