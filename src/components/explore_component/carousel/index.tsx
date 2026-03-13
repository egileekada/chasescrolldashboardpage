import { CustomCarousel } from '@/components/customCarousel';
import GetEventTicket from '@/components/event_details_component/get_event_ticket';
import BlurredImage from '@/components/sharedComponent/blurred_image';
import EventLocationDetail from '@/components/sharedComponent/event_location';
import EventPrice from '@/components/sharedComponent/event_price';
import InterestedUsers from '@/components/sharedComponent/interested_users';
import SaveOrUnsaveBtn from '@/components/sharedComponent/save_unsave_event_btn';
import ShareEvent from '@/components/sharedComponent/share_event';
import { EVENTPAGE_URL, IMAGE_URL } from '@/services/urls';
import httpService from '@/utils/httpService';
import { textLimit } from '@/utils/textlimit';
import { Box, Flex, Image, useToast, Text, useColorMode, Skeleton } from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { focusManager, useQuery } from 'react-query';
import useCustomTheme from "@/hooks/useTheme";
import LoadingAnimation from '@/components/sharedComponent/loading_animation';
import ProductImageScroller from '@/components/sharedComponent/productImageScroller';

interface Props { }

function ExploreCarousel(props: Props) {
    const { } = props

    const toast = useToast()
    const [data, setData] = React.useState([] as any)
    const router = useRouter();
    const newtheme = localStorage.getItem("chakra-ui-color-mode") as string

    const {
        bodyTextColor,
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        borderColor,
        headerTextColor
    } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    focusManager.setFocused(false)
    // react query
    const { isLoading, isRefetching } = useQuery(['get-top-events'], () => httpService.get('/events/get-top-events'), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        },
        onSuccess: (data) => {
            setData(data.data.content);
        }
    })

    const clickHandler = (id: string) => {
        // if (token) { 
            window.location.href = `${EVENTPAGE_URL}/product/details/events/${id}?theme=${newtheme}`;
            // router.push("/dashboard/event/details/" + event?.id
        // } else {
        //     router.push("/event/" + event?.id);
        // }
    }

    return (
        <LoadingAnimation loading={isLoading} customLoader={
            <Skeleton w={"full"} roundedBottom={["32px", "32px", "32px", "32px", "32px"]} roundedTopLeft={"32px"} height={["411px", "411px", "449px", "449px", "449px"]} />
        } >
            <Box width={"full"} position={"relative"} height={["380px", "380px", "480px"]} pb={"10"} >
                {(!isLoading && !isRefetching) && (
                    <CustomCarousel
                        slides={
                            data?.map((item: any, index: any) => {
                                return (
                                    <>
                                        <Box onClick={() => clickHandler(item?.id)} key={index} role='button' bg={secondaryBackgroundColor} rounded={"32px"} roundedTopRight={"0px"} width={"full"} height={["fit-content", "fit-content", "fit-content"]} p={"3"} >
                                            <Box position={"relative"} width={"full"} >

                                            <ProductImageScroller images={[item?.currentPicUrl]}rounded='16px' height={["256px", "256px", "350px"]} />
                                                {/* <BlurredImage height={["256px", "256px", "350px"]} image={item?.currentPicUrl} /> */}
                                                {/* <Image style={{ borderTopRightRadius: "0px", borderRadius: "32px" }} objectFit="cover" alt={item?.currentPicUrl} width={"full"} height={["256px", "256px", "350px"]} src={IMAGE_URL + item?.currentPicUrl} /> */}
                                                <Box color={colorMode === 'light' ? "#121212" : bodyTextColor} zIndex={"30"} roundedBottom={"8px"} roundedTopLeft={"8px"} alignItems={"center"} justifyContent={"center"} display={"flex"} flexDirection={"column"} fontWeight={"semibold"} position={"absolute"} bottom={"4"} left={"4"} width={["57px", "57px", "57px"]} height={["57px", "57px", "51px"]} shadow={"lg"} bgColor={secondaryBackgroundColor} >
                                                    <Text fontSize={["24px", "24px", "24px"]} >{moment(item?.startDate).format("D")}</Text>
                                                    <Text fontSize={["13px", "13px", "13px"]} mt={"-8px"} >{moment(item?.startDate).format("MMM")}</Text>
                                                </Box>
                                            </Box>
                                            <Flex width={"full"} pt={"4"} pb={"1"} px={"1"} flexDirection={"column"} gap={"1"} >
                                                <Flex color={colorMode === 'light' ? "#121212" : bodyTextColor} flexDir={["column", "column", "row"]} fontSize={["16px", "16px", "20px"]} bg={secondaryBackgroundColor} alignItems={["start", "start", "center"]} justifyContent={"space-between"} fontWeight={"medium"} gap={"1"} >
                                                    <Text fontSize={"large"} display={["none", "none", "block"]} fontWeight={"semibold"} >{textLimit(item?.eventName, 40)}</Text>
                                                    <Text fontSize={"large"} display={["block", "block", "none"]} fontWeight={"semibold"} >{textLimit(item?.eventName, 20)}</Text>
                                                    <EventPrice minPrice={item?.minPrice} maxPrice={item?.maxPrice} currency={item?.currency} />
                                                </Flex>
                                                <Flex alignItems={"start"} flexDir={"column"} width={"full"} gap={"2"} justifyContent={"space-between"} >
                                                    <Box display={"flex"} flexDirection={"column"} gap={"2"} > 
                                                        <EventLocationDetail height='fit-content' fontWeight={"medium"} fontsize={"16px"} color={headerTextColor} location={item?.location} locationType={item?.locationType} length={20} isLimited={true} />
                                                    </Box>
                                                    <Flex alignItems={"center"} w={"full"} justifyContent={"space-between"} gap={"3"} >
                                                        {item?.attendeesVisibility && (
                                                            <InterestedUsers refund={true} fontSize={14} event={item} border={"2px"} size={"32px"} />
                                                        )}
                                                        <Flex ml={"auto"} alignItems={"center"} gap={"3"}  >
                                                            {/* {(userId && email) && ( */}
                                                            <SaveOrUnsaveBtn event={item} color={headerTextColor} /> 
                                                            {/* )} */}
                                                            <ShareEvent data={item} type="EVENT" size='18px' id={item?.id} eventName={item?.eventName} />
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                    </>
                                )
                            })
                        }
                        autoplay={true} interval={5000}
                    />
                )}
            </Box>
        </LoadingAnimation>
    )
}

export default ExploreCarousel
