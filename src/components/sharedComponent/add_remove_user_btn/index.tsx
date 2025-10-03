import { AddProfileIcon } from '@/components/svg'
import { URLS } from '@/services/urls'
import httpService from '@/utils/httpService'
import { Button, Flex, Spinner, useColorMode, useToast } from '@chakra-ui/react'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import useCustomTheme from "@/hooks/useTheme";
import { useDetails } from '@/global-state/useUserDetails'

interface Props {
    name: string,
    user_index: any,
    index?: any
    setJoinStatus: any,
    width?: string,
    search?: boolean,
    icon?: boolean,
    profile?: boolean,
    request?: boolean,
    connects?: boolean,
    profileId?: string
}

function AddOrRemoveUserBtn(props: Props) {
    const {
        name,
        user_index,
        index,
        setJoinStatus,
        width,
        search,
        icon,
        profile,
        request,
        connects,
        profileId
    } = props

    const [loading, setLoading] = useState("0")
    const [loadingRejected, setLoadingRejected] = useState("0")
    const toast = useToast()
    const queryClient = useQueryClient();

    const { user } = useDetails((state) => state);

    const { bodyTextColor, primaryColor, secondaryBackgroundColor, mainBackgroundColor, borderColor } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const unfriend = useMutation({
        mutationFn: () => httpService.delete(URLS.REMOVE_FRIEND + user_index, {}),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: 'Success',
                description: data.data?.message,
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setLoading("0")
            setJoinStatus("pending")
            queryClient.invalidateQueries([URLS.GET_USER_CONNECTION_LIST + user_index])
            queryClient.invalidateQueries(['/user/friend-requests'])
            queryClient.invalidateQueries(['get-joined-network'])
        }
    });


    const rejectuser = useMutation({
        mutationFn: () => httpService.delete(URLS.REJECT_USER + "/" + index, {}),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {

            toast({
                title: 'Success',
                description: data.data?.message,
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setLoading("0")
            setJoinStatus("pending")
            queryClient.invalidateQueries([URLS.FRIEND_REQUEST])
        }
    });


    const acceptuser = useMutation({
        mutationFn: (data: any) => httpService.post(URLS.ACCEPT_USER, data),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {

            queryClient.invalidateQueries([URLS.FRIEND_REQUEST])
            toast({
                title: 'Success',
                description: data.data?.message,
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setLoading("0")
            setJoinStatus("pending")
        }
    });

    const addfriend = useMutation({
        mutationFn: (data: any) => httpService.post(URLS.ADD_FRIEND, data),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: error?.response?.data?.message,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: 'Success',
                description: data.data?.message,
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            queryClient.invalidateQueries([URLS.GET_USER_CONNECTION_LIST + user_index])
            queryClient.invalidateQueries(['/user/friend-requests'])
            queryClient.invalidateQueries(['get-joined-network'])
            setLoading("0")
            if (data?.data?.message === "Public profile auto friend") {
                setJoinStatus("CONNECTED")
            } else {
                setJoinStatus("FRIEND_REQUEST_SENT")
            }
        }
    });

    const handleadd = React.useCallback(() => {

        setLoading(user_index)
        addfriend.mutate({ toUserID: user_index })
    }, [addfriend, user_index])

    const handleaccept = React.useCallback((event: any) => {
        event.stopPropagation();
        setLoading(index)
        acceptuser.mutate({ friendRequestID: index })
    }, [acceptuser, user_index])

    const handleRemove = React.useCallback(() => {
        setLoading(user_index)
        unfriend.mutate()
    }, [unfriend, user_index])

    const handleReject = React.useCallback((event: any) => {
        event.stopPropagation();
        setLoadingRejected(index)
        rejectuser.mutate()
    }, [rejectuser, user_index])


    const clickHandler = (event: any) => {
        event.stopPropagation();
        if (name === "Pending" || name === "Disconnect") {
            handleRemove()
        } else {
            handleadd()
        }
    }


    return (
        <>
            {(!request) && (
                <>
                    {!icon && (
                        <>
                            {(profileId === user?.userId && name === "Disconnect") && (
                                <Flex disabled={loading === user_index ? true : false} px={profile ? "4" : "0px"} _disabled={{ cursor: "none" }} justifyContent={"center"} alignItems={"center"} as={"button"} onClick={clickHandler} _hover={{ backgroundColor: "#5D70F9", color: "white" }} width={width ? width : "full"} rounded={"8px"} height={search ? "35px" : "43px"} bg={name === "Disconnect" ? "brand.chasescrollRed" : "white"} borderColor={(name === "Disconnect") ? "" : "brand.chasescrollBlue"} borderWidth={(name === "Disconnect") ? "0px" : "1px"} color={name === "Disconnect" ? "white" : "brand.chasescrollBlue"} fontSize={search ? "11px" : "sm"} fontWeight={"semibold"}  >
                                    {(loading === user_index) ? "Loading..." : name}
                                </Flex>
                            )}
                            {(name !== "Disconnect") && (
                                <Flex disabled={loading === user_index ? true : false} px={profile ? "4" : "0px"} _disabled={{ cursor: "none" }} justifyContent={"center"} alignItems={"center"} as={"button"} onClick={clickHandler} _hover={{ backgroundColor: "#5D70F9", color: "white" }} width={width ? width : "full"} rounded={"8px"} height={search ? "35px" : "43px"} bg={name === "Pending" ? "#fff3e7" : name === "Disconnect" ? "brand.chasescrollRed" : "white"} borderColor={(name === "Pending" || name === "Disconnect") ? "" : "brand.chasescrollBlue"} borderWidth={(name === "Pending" || name === "Disconnect") ? "0px" : "1px"} color={name === "Pending" ? "#f78b26" : name === "Disconnect" ? "white" : "brand.chasescrollBlue"} fontSize={search ? "11px" : "sm"} fontWeight={"semibold"}  >
                                    {(loading === user_index) ? "Loading..." : name}
                                </Flex>
                            )}
                        </>
                    )}
                    {(icon && name !== "Connect") ? (
                        <Flex disabled={loading === user_index ? true : false} _disabled={{ cursor: "none" }} as={"button"} justifyContent={"center"} px={["1", "1", "3"]} alignItems={"center"} _hover={{ backgroundColor: mainBackgroundColor }} width={width ? width : "full"} rounded={"8px"} height={search ? "35px" : ["35px", "35px", "43px"]} bg={name === "Pending" ? mainBackgroundColor : name === "Disconnect" ? mainBackgroundColor : mainBackgroundColor} borderColor={(name === "Pending" || name === "Disconnect") ? "" : "white"} borderWidth={(name === "Pending" || name === "Disconnect") ? "0px" : "0px"} color={name === "Pending" ? "#f78b26" : name === "Disconnect" ? "brand.chasescrollBlue" : "brand.chasescrollBlue"} fontSize={search ? "11px" : ["xs", "xs", "sm"]} fontWeight={["medium", "medium", "semibold"]}  >
                            {(loading === user_index) ? "Loading..." : name === "Disconnect" ? "Connected" : name}
                        </Flex>
                    ) : (
                        <>
                            {icon && (
                                <Flex disabled={loading === user_index ? true : false} as={"button"} _disabled={{ cursor: "none" }} onClick={clickHandler}>
                                    {(loading === user_index) ? (
                                        <Spinner size={"sm"} />
                                    ) :
                                        <AddProfileIcon />
                                    }
                                </Flex>
                            )}
                        </>
                    )}
                </>
            )}
            {request && (
                <Flex gap={"3"} fontSize={"sm"} >
                    <Button isDisabled={loading === index ? true : false} onClick={(e) => handleaccept(e)} fontSize={"sm"} width={"100px"} bgColor={primaryColor} color={'white'} height={"40px"} >
                        {(loading === index) ? "Loading..." : "Accept"}
                    </Button>
                    <Button isDisabled={loadingRejected === index ? true : false} onClick={(e) => handleReject(e)} fontSize={"sm"} width={"100px"} bgColor={"#FCE7F3"} height={"40px"} color={"#DD2B2C"} >
                        {(loadingRejected === index) ? "Loading..." : "Decline"}
                    </Button>
                </Flex>
            )}
        </>
    )
}

export default AddOrRemoveUserBtn
