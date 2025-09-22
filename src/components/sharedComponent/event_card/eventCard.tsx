import { IEventType } from '@/models/Event';
import { Flex, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'
import ProductImageScroller from '../productImageScroller';
import moment from 'moment';
import useCustomTheme from '@/hooks/useTheme';
import { textLimit } from '@/utils/textlimit';
import ShareEvent from '../share_event';
import SaveOrUnsaveBtn from '../save_unsave_event_btn';
import InterestedUsers from '../interested_users';
import EventPrice from '../event_price';
import EventLocationDetail from '../event_location';
import { LocationStrokeEx } from '@/components/svg';
import { EVENTPAGE_URL } from '@/services/urls';

export default function EventCardNew({
    event
}: {
    event: IEventType
}) {

    const router = useRouter()

    const { primaryColor, borderColor, mainBackgroundColor } = useCustomTheme()
    const newtheme = localStorage.getItem("chakra-ui-color-mode") as string


    let token = localStorage.getItem("token")

    const clickHandler = () => {
        // if (token) { 
            window.location.href = `${EVENTPAGE_URL}/product/details/events/${event?.id}?theme=${newtheme}`;
            // router.push("/dashboard/event/details/" + event?.id
        // } else {
        //     router.push("/event/" + event?.id);
        // }
    }

    const query = useSearchParams();
    const textColor = query?.get('brandColor');
    const cardColor = query?.get('cardColor');


    return (
        <Flex as={"button"} flexDir={"column"} bgColor={cardColor ? cardColor?.replace("hex", "#") : mainBackgroundColor} onClick={() => clickHandler()} borderWidth={"1px"} borderColor={borderColor} rounded={"10px"} w={"full"} >
            <Flex w={"full"} pos={"relative"} >
                <ProductImageScroller images={[event?.currentPicUrl]} createdDate={moment(event?.createdDate)?.fromNow()} userData={event?.createdBy} />
                <Flex w={"40px"} pos={"absolute"} display={["none", "none", "flex"]} bottom={"4"} right={"4"} h={"40px"} rounded={"full"} bgColor={mainBackgroundColor} justifyContent={"center"} alignItems={"center"} >
                    <ShareEvent
                        data={event}
                        type="EVENT"
                        // size="18px"
                        showText={false}
                        id={event?.id}
                    />
                </Flex>
                <Flex w={"fit-content"} pos={"absolute"} bottom={"4"} left={"2"} display={["block", "block", "none"]} >
                    <Flex
                        width={"40px"}
                        flexDir={"column"}
                        py={"2"}
                        alignItems={"center"}
                        roundedBottom={"20px"}
                        roundedTopLeft={"20px"}
                        bgColor={"#C4C4C499"}
                        borderWidth={"1px"}
                    >
                        <Text
                            fontSize={"10px"}
                            fontWeight={"700"}
                            lineHeight={"10px"}
                            color={"white"}
                        >
                            {moment(event?.startDate).format("MMM")}
                        </Text>
                        <Text lineHeight={"16px"} fontWeight={"700"}
                            color={"white"} fontSize={"16px"}>
                            {moment(event?.startDate).format("D")}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDir={"column"} px={["1", "1", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["1", "1", "0px"]} >
                <Flex gap={"2"} >
                    <Flex w={"fit-content"} display={["none", "none", "block"]} >
                        <Flex
                            width={"50px"}
                            flexDir={"column"}
                            py={"2"}
                            alignItems={"center"}
                            roundedBottom={"20px"}
                            roundedTopLeft={"20px"}
                            borderWidth={"1px"}
                        >
                            <Text
                                fontSize={"12px"}
                                fontWeight={"700"}
                                lineHeight={"10px"}
                                color={textColor?.replace("hex", "#") ?? primaryColor}
                            >
                                {moment(event?.startDate).format("MMM")}
                            </Text>
                            <Text lineHeight={"24px"} fontWeight={"700"} fontSize={"24px"}>
                                {moment(event?.startDate).format("D")}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex flexDirection={"column"} alignItems={"start"}  >
                        <Text fontSize={"12px"} fontWeight={"700"} >{textLimit(event?.eventName, 20)}</Text>
                        <Flex display={["none", "none", "flex"]} w={"full"} gap={"1"} >
                            <Flex w={"fit-content"} mt={"2px"} >
                                <LocationStrokeEx color={textColor?.replace("hex", "#") ?? primaryColor} size='17px' />
                            </Flex>
                            <Text color={textColor?.replace("hex", "#") ?? primaryColor} textAlign={"left"} fontSize={"14px"} fontWeight={"500"} >{event?.location?.toBeAnnounced ? "To Be Announced" : textLimit(event?.location?.locationDetails+"", 25)}</Text>
                        </Flex>
                        <Flex display={["flex", "flex", "none"]} w={"full"} gap={"1"} >
                            <Flex w={"fit-content"} mt={"2px"} >
                                <LocationStrokeEx color={textColor?.replace("hex", "#") ?? primaryColor} size='17px' />
                            </Flex>
                            <Text color={textColor?.replace("hex", "#") ?? primaryColor} textAlign={"left"} fontSize={"12px"} fontWeight={"500"} >{event?.location?.toBeAnnounced ? "To Be Announced" : textLimit(event?.location?.locationDetails+"", 25)}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex borderTopWidth={"1px"} w={"full"} mt={["1", "2", "2"]} h={["50px", "50px", "50px"]} px={["2", "2", "3"]} alignItems={"center"} >
                {event?.attendeesVisibility && (
                    <InterestedUsers
                        fontSize={12}
                        // color={["#1732F7", "#1732F7", "#1732F7", "#1732F7", "#1732F7"]}
                        event={event}
                        border={"2px"}
                        size={"28px"}
                        refund={true}
                    />
                )}
                <Text color={textColor?.replace("hex", "#") ?? primaryColor} display={["block"]} ml={"auto"} fontWeight={"600"} fontSize={"14px"} >
                    <EventPrice
                        minPrice={event?.minPrice}
                        maxPrice={event?.maxPrice}
                        currency={event?.currency}
                    />
                </Text>
            </Flex>
        </Flex>
    )
}
