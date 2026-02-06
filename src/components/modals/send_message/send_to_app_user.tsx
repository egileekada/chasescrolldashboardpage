 
import CustomButton from '@/components/general/Button';
import LoadingAnimation from '@/components/sharedComponent/loading_animation';
import UserImage from '@/components/sharedComponent/userimage';
import { useDetails } from '@/global-state/useUserDetails';
import useDebounce from '@/hooks/useDebounce';
import useCustomTheme from '@/hooks/useTheme';
import { Chat } from '@/models/Chat';
import { IUser } from '@/models/User';
import { SHARE_URL, URLS, WEBSITE_URL } from '@/services/urls';
import httpService from '@/utils/httpService';
import { Avatar, Box, Checkbox, HStack, Heading, Input, InputGroup, InputLeftElement, Spinner, Text, VStack, useToast } from '@chakra-ui/react'
import React from 'react'
import { FiSearch } from 'react-icons/fi';
import { IoSearchOutline } from 'react-icons/io5';
import { useMutation, useQuery } from 'react-query';

interface Props { }

const UserCard = (props: IUser & { checked: boolean, handleCheck: (e: string) => void }) => {
    const { username, userId, data: { imgMain: { value: imgMain } }, firstName, lastName } = props;
    return (
        <HStack width='100%' height={'60px'} justifyContent={'space-between'} >
            <HStack>
                <UserImage data={props} image={props?.data?.imgMain?.value} size={"40px"} border={"2px"} font={"20px"} />
                {/* <Avatar src={`${CONFIG.RESOURCE_URL}${imgMain}`} size='sm' name={`${firstName} ${lastName}`} /> */}
                <VStack alignItems={'flex-start'} spacing={0}>
                    <Heading fontSize={'16px'} color='black'>{firstName || ''} {lastName || ''}</Heading>
                    <Text color='grey' fontSize={'14px'}>@{username || ''}</Text>
                </VStack>
            </HStack>

            <Checkbox isChecked={props.checked} onChange={(e) => props.handleCheck(userId)} />
        </HStack>
    )
}

function SendMesageModal({ onClose, id, isprofile, type }: {
    onClose: () => void,
    id: string,
    isprofile?: boolean,
    type: string
}) {

    const [search, setSearch] = React.useState('');
    const searchText = useDebounce(search, 1000);
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [userIds, setUserIds] = React.useState<string[]>([]);

    const { userId } = useDetails((state) => state);
    const toast = useToast()

    const { isLoading, isError } = useQuery(['getUserFriends', searchText, userId], () => httpService.get(`/user/get-users-connections/${userId}`, {
        params: {
            searchText
        }
    }), {
        onSuccess: (data) => {
            setUsers(data?.data.content);
        }
    });

    const { isLoading: chatCreationLoading, mutate } = useMutation({
        mutationFn: (data: any) => httpService.post(`/chat/chat`, data),
        onSuccess: (data) => {
            const chat = data?.data as Chat;
            const obj = {
                message: 
                type === "EVENT"
                  ? `${SHARE_URL}${"/event?id="}${id}` :
                    type === "RENTAL" ? `${SHARE_URL}${"/rental?id="}${id}`:
                    type === "SERVICE" ? `${SHARE_URL}${"/service?id="}${id}`:
                    type === "KIOSK" ? `${SHARE_URL}${"/product/"}${id}`:
                    type === "DONATION" ? `${SHARE_URL}${"/fundraiser?id="}${id}`
                    : `${SHARE_URL}/event?id=${id}`,
                chatID: chat?.id,
            }
            sendMessage.mutate(obj)
        }

    });

    const sendMessage = useMutation({
        mutationFn: (data: any) => httpService.post(`/chat/message`, data),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Message Sent',
                status: 'success',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            onClose()
        }
    });

    const handleShare = () => {
        userIds.forEach((idd) => {
            mutate({
                type: 'ONE_TO_ONE',
                typeID: userId,
                name: idd,
                users: [
                    idd
                ]
            });
        })
    }

    const handleCheck = (iem: string) => {
        if (userIds.includes(iem)) {
            setUserIds(userIds.filter((id) => id !== iem));
        } else {
            setUserIds([...userIds, iem]);
        }
    }

    const { bodyTextColor, primaryColor, secondaryBackgroundColor, mainBackgroundColor, borderColor } = useCustomTheme();

    return (
        <Box width={"full"} > 
            <Box px={"20px"}  marginY='20px' w={"full"} > 
                <InputGroup width={["full", "full", "full"]} zIndex={"20"} position={"relative"} >
                    <InputLeftElement pointerEvents='none'>
                        <IoSearchOutline size={"25px"} color={bodyTextColor} />
                    </InputLeftElement>
                    <Input width={["full", "full", "full"]} value={search} color={bodyTextColor} onChange={(e) => setSearch(e.target.value)} type='text' borderColor={borderColor} rounded={"12px"} focusBorderColor={'brand.chasescrollBlue'} _placeholder={{ color: bodyTextColor }} bgColor={secondaryBackgroundColor} placeholder='Search for users' />
                </InputGroup>
            </Box>

            <Box width='100%' px={"20px"} height='220px' overflowY='auto'>
                <LoadingAnimation loading={isLoading} >
                    {users.map((item, index) => (
                        <UserCard {...item} checked={userIds.includes(item.userId)} handleCheck={(e) => handleCheck(e)} key={index.toString()} />
                    ))}
                </LoadingAnimation>
            </Box>
            <Box paddingX={'20px'} shadow='lg' bg='white' paddingTop={'20px'} zIndex={10} paddingBottom={'20px'} borderTopWidth={'0.5px'} borderTopColor={'lightgrey'}>
                <CustomButton text='Share' onClick={handleShare} disable={userIds.length === 0} isLoading={chatCreationLoading || sendMessage.isLoading} width='100%' height='50px' bg='brand.chasescrollButtonBlue' color={'white'} />
            </Box>
        </Box>
    )
}

export default SendMesageModal
