import CustomButton from '@/components/general/Button'
import AddOrRemoveUserBtn from '@/components/sharedComponent/add_remove_user_btn'
import UserImage from '@/components/sharedComponent/userimage'
import useSearchStore from '@/global-state/useSearchData' 
import httpService from '@/utils/httpService'
import {Box, Flex, Text, useColorMode, useToast} from '@chakra-ui/react'
import { AxiosError, AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useMutation, useQueryClient } from 'react-query'
import useCustomTheme from "@/hooks/useTheme";
import { useDetails } from '@/global-state/useUserDetails'

interface Props {
    person: any,
    index?: any,
    search?: boolean,
    profile?: boolean,
    connects?: boolean,
    request?: boolean,
    refund?: boolean,
    block?: boolean,
    community?: boolean,
    role?: string,
    userId?: string
}

function PeopleCard(props: Props) {
    const {
        person,
        index,
        search,
        profile,
        request,
        connects,
        refund,
        block,
        community,
        role,
        userId
    } = props

    const [isFriend, setisFriend] = React.useState(person?.joinStatus)

    const { setSearchValue } = useSearchStore((state) => state);
    const router = useRouter()
    const toast = useToast()
    // const [loading, setLoading] = React.useState("")
    const queryClient = useQueryClient()

    const { bodyTextColor, primaryColor,secondaryBackgroundColor, mainBackgroundColor, borderColor } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const refundUser = useMutation({
        mutationFn: () => httpService.get('/payments/refundEvent?eventID='+index+"&userID="+person?.userId),
        onError: (error: AxiosError<any, any>) => {
            toast({
                title: 'Error',
                description: "Error Refunding All Users",
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
        onSuccess: (data: AxiosResponse<any>) => {
            toast({
                title: 'Success',
                description: "Refunded All Users",
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });

            queryClient.invalidateQueries(['all-events-details'+index])  
            queryClient.invalidateQueries(['/events/get-event-members/'+index]) 
            
        }
    });  

    const clickHandler = React.useCallback((e: any) => {
        
        e.stopPropagation();
        refundUser.mutate()
    }, [refundUser])

    const submit =()=> {
        setSearchValue("")
        router.push("/dashboard/profile/" + person?.userId)
    } 

    return (
        <Flex as={"button"} onClick={() => submit()} _hover={{ backgroundColor: community ? "transparent" : mainBackgroundColor }} px={"2"} width={"full"} justifyContent={"space-between"} alignItems={"center"} py={"4"} borderBottomWidth={"1px"} >
            <Flex width={["60vw", "fit-content"]} gap={"2"} alignItems={"center"} >
                <Box> 
                    <UserImage fontWeight={"semibold"} border={search ? "1px" : "3px"} data={person} image={person?.data?.imgMain?.value} size={search ? "32px" : 50} font={search ? "[16px]" : '[30px]'} />
                </Box>
                <Box>
                    <Text fontSize={request ? "14px" : search ? "14px" : "15px"} textAlign={"left"} fontWeight={"medium"} >{(person?.firstName + " " + person?.lastName)?.length > 15 ? ((((!person?.firstName || person?.firstName === null) ? "" : person?.firstName)) + " " + ((!person?.lastName || person?.lastName === null) ? "" : person?.lastName))?.slice(0, 15) + "..." : (((!person?.firstName || person?.firstName === null) ? "" : person?.firstName))+" "+ ((!person?.lastName || person?.lastName === null) ? "" : person?.lastName)}</Text>
                    <Text textAlign={"start"} fontSize={search ? "10px" : "12px"} fontWeight={search ? "medium" : "semibold"} color={"brand.chasescrollTextGrey2"} >@{person?.username?.length > 15 ? person?.username?.slice(0, 15) + "..." : person?.username}</Text>
                </Box>
            </Flex>
            {(!refund && !block && !community)&& (
                <> 
                    {isFriend !== "SELF" && (
                        <AddOrRemoveUserBtn profileId={userId} index={index} connects={connects} request={request} profile={profile} search={search} width={request ? "85px" : search ? "85px" : '120px'} name={isFriend === "FRIEND_REQUEST_SENT" ? "Pending" : isFriend === "CONNECTED" ? "Disconnect" : "Connect"} setJoinStatus={setisFriend} user_index={person?.userId} />
                    )}
                </>
            )}

            {refund && (
                <CustomButton isLoading={refundUser.isLoading} borderRadius={"md"} onClick={clickHandler} text='refund' color={"white"} backgroundColor={colorMode === 'light' ? "rgb(220 38 38)": mainBackgroundColor} height={"43px"} px={"4"} width={"fit-content"} />
            )} 
            {(community && role === "ADMIN" ) && (
                <Text fontSize={"12px"} color={"#5D70F9"} fontWeight={"700"} >Admin</Text>
            )}
        </Flex>
    )
}

export default PeopleCard
