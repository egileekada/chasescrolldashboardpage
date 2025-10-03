'use client'
import CustomText from '@/components/general/Text'
import { useDetails } from '@/global-state/useUserDetails';
import useCustomTheme from '@/hooks/useTheme';
import { URLS } from '@/services/urls';
import httpService from '@/utils/httpService';
import { HStack, Image, Radio, Spinner, Text, useColorMode, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query';

function Visibility() {
    const [isPrivate, setIsPrivate] = React.useState(false);

    const queryClient = useQueryClient();
    const { userId } = useDetails((state) => state);
    const router = useRouter();

    const {
        bodyTextColor,
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        borderColor,
    } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const getDetails = useQuery(['getPublicProfile', userId], () => httpService.get(`${URLS.GET_PUBLIC_PROIFLE}/${userId}`), {
        onSuccess: (data) => {
            console.log(data.data);
            setIsPrivate((data?.data?.publicProfile as any) === true ? false : true);
        }
    });

    const { mutate, isLoading: updating } = useMutation({
        mutationFn: (data: any) => httpService.put(`${URLS.UPDATE_PROFILE}`, data),
        onSuccess: (data) => {
            alert('Account privacy updated');
            queryClient.invalidateQueries(['getPublicProfile']);
        },
        onError: (error) => {
            alert('An error occured while updating the privacy, please try again later')
        }
    }) 

    return (
        <VStack width='100%' height='100%' bg={mainBackgroundColor}>
            <VStack width={['100%', '35%']} height={'100%'} alignItems={'center'}>

                <HStack width={'100%'} alignItems={'center'} marginTop={'120px'}>
                    <FiChevronLeft role="button" size={'25px'} color={bodyTextColor} onClick={() => router.back()} />
                    <Text fontSize={'18px'}>Account settings</Text>
                </HStack>

                <VStack width='100%' height={'auto'} marginTop={'20px'}>

                    <HStack width='100%' height='40px' paddingX={'20px'} borderRadius={'10px'} bg={secondaryBackgroundColor} justifyContent={'space-between'} marginBottom={'15px'}>
                        <HStack alignItems={'center'}>
                            <Image alt='peoople' src='/assets/images/people.svg' />
                            <Text fontSize={'18px'}>Public</Text>
                        </HStack>

                        {updating ? <Spinner /> : <Radio name='visibility' isChecked={isPrivate === false} onChange={() => mutate({ publicProfile: true })} />}
                    </HStack>

                    <HStack width='100%' height='40px' paddingX={'20px'} borderRadius={'10px'} bg={secondaryBackgroundColor} justifyContent={'space-between'} marginBottom={'15px'}>
                        <HStack alignItems={'center'}>
                            <Image alt='peoople' src='/assets/images/Vector.svg' />
                            <Text fontSize={'18px'}>Private</Text>
                        </HStack>

                        {updating ? <Spinner /> : <Radio name='visibility' isChecked={isPrivate === true} onChange={() => mutate({ publicProfile: false })} />}
                    </HStack>

                </VStack>
            </VStack>
        </VStack>
    )
}

export default Visibility