import useCustomTheme from '@/hooks/useTheme'
import { IService } from '@/models/Service'
import { IMAGE_URL, LANDINGPAGE_URL, RESOURCE_BASE_URL, SHARE_URL } from '@/services/urls'
import { VStack, HStack, Box, Text, Image, Flex, useToast, Button } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation'
import React from 'react'
import BlurredImage from '../sharedComponent/blurred_image'
import { FiMapPin } from 'react-icons/fi'
import { ArrowLeft2, Star1 } from "iconsax-react";
import { TiTick } from "react-icons/ti";
import { formatNumber } from '@/utils/numberFormat'
import UserImage from '../sharedComponent/userimage'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import { textLimit } from '@/utils/textlimit'
import ProductImageScroller from '../sharedComponent/productImageScroller'
import { LocationStroke, LocationStrokeEx } from '../svg'
import DeleteEvent from '../sharedComponent/delete_event'
import { IoMdCheckmark } from 'react-icons/io'
import { useDetails } from '@/global-state/useUserDetails'
import ShareEvent from '../sharedComponent/share_event'

function BusinessCard({ business, mybusiness, isSelect, selected, setSelected }: { business: IService, mybusiness?: boolean, isSelect?: boolean, selected?: any, setSelected?: any }) {
    const [activeImageIndex, setActiveImageIndex] = React.useState(0);

    const { userId } = useDetails((state)=> state)
    const param = useParams();
    const id = param?.slug ?? param?.id; 
    const query = useSearchParams();
    const frame = query?.get('frame');

    const toast = useToast()
    const router = useRouter();
    const path = usePathname();

    React.useEffect(() => {
        if (business?.images?.length > 1) {
            const interval = setInterval(() => {
                setActiveImageIndex((prev) => {
                    if (prev === business?.images.length - 1) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 8000);
            return () => clearInterval(interval);
        }
    }, []) 

    const {
        primaryColor,
        mainBackgroundColor, 
        borderColor
    } = useCustomTheme()

    const clickHandler = () => {
        if(frame) {
            window.parent.location.href = `${LANDINGPAGE_URL}/auth`; 
        } else if (isSelect) {
            let clone = [...selected]

            if (selected?.includes(business?.id)) {
                clone = clone?.filter((item: string) => item !== business?.id)
                setSelected(clone)
            } else {
                clone = [...clone, business?.id]
                setSelected(clone)
            }
        } else {
            if (mybusiness && (business?.vendor?.userId === userId)) {
                router.push(`/dashboard/kisok/service/${business?.id}/edit`)
            } else {
                router.push(`/dashboard/kisok/service/${business?.id}`)
            }
        }

    }


    return (
        <Flex as={"button"} flexDir={"column"}  borderColor={borderColor} pos={"relative"} onClick={() => clickHandler()} borderWidth={"1px"} bgColor={mainBackgroundColor} rounded={"10px"} w={"full"} >
            {(!isSelect && (business?.vendor?.userId === userId)) && (
                <DeleteEvent id={business?.id} isServices={true} name={business?.name + " Services"} isOrganizer={mybusiness ? true : false} />
            )}
            {isSelect && (
                <Flex pos={"absolute"} zIndex={"30"} top={"3"} right={"3"} w={"5"} h={"5"} justifyContent={"center"} alignItems={"center"} bgColor={selected?.includes(business?.id) ? primaryColor : "white"} rounded={"6px"} >
                    <IoMdCheckmark size={"15px"} color='white' />
                </Flex>
            )}
            <Flex w={"full"} h={"fit-content"} pos={"relative"} >
                <ProductImageScroller images={business?.images} createdDate={isSelect ? "" : moment(business?.createdDate)?.fromNow()} userData={business?.vendor} />
                {/* {!frame && (
                    <Flex w={"8"} h={"8"} justifyContent={"center"} alignItems={"center"} cursor={"pointer"} pos={"absolute"} bottom={"3"} bgColor={mainBackgroundColor} rounded={"full"} right={"3"} >
                        <ShareEvent newbtn={true} showText={false} data={business} name={business?.name} id={business?.id} type="SERVICE" eventName={textLimit(business?.name + "", 17)} />
                    </Flex>
                )} */}
            </Flex>
            <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", isSelect ? "2" : "0px"]}  >
                <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(business?.name), 20)}</Text>
                <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(business?.name), 16)}</Text>
                <Flex gap={"1"} w={"full"} flexDir={["column", "column", "row"]} justifyContent={"space-between"} alignItems={["start", "start", "center"]} >
                    <Flex flexDir={"column"} alignItems={'flex-start'}>
                        <Text fontWeight={400} fontSize={'12px'}>Service offering</Text>
                        <Text fontWeight={600} textAlign={"left"} fontSize={'12px'}>{textLimit(business?.category?.replaceAll("_", " "), 15)}</Text>
                    </Flex>
                    {!isSelect && (
                        <Flex gap={"2"} display={["none", "none", "flex"]} >
                            <Flex alignItems={'center'} px={"2"} h={"27px"} w={"fit-content"} rounded={"13px"} borderWidth={"0.86px"} >
                                {business.totalBooking > 0 && <Text fontWeight={400} fontSize={'8px'} >{business?.totalBooking === 0 ? 0 : business?.totalBooking} clients served</Text>}
                                {business.totalBooking === 0 && <Text fontWeight={400} color={primaryColor} fontSize={'8px'} >Ready to serve</Text>}
                            </Flex>
                            <Flex rounded={"13px"} px={"1"} h={"23px"} gap={"1"} alignItems={"center"} borderWidth={"0.86px"} >
                                <Star1 size={20} color='gold' variant="Bold" />
                                <Text fontSize={'16px'} fontWeight={600}>{business?.rating}</Text>
                            </Flex>
                        </Flex>
                    )}
                </Flex>
                {!isSelect && (

                    <Flex w={"full"} gap={["2px", "2px", "1"]} mt={["1", "1", "0px"]} alignItems={"center"} >
                        <Flex w={"fit-content"} >
                            <LocationStrokeEx size={"17px"} color={primaryColor} />
                        </Flex>
                        <Text textAlign={"left"} fontSize={["12px"]} fontWeight={"500"} color={primaryColor} display={["none", "none", "block"]} >{textLimit(business?.location?.locationDetails, 20)}</Text>
                        <Text textAlign={"left"} fontSize={["10px"]} fontWeight={"500"} color={primaryColor} display={["block", "block", "none"]} >{textLimit(business?.location?.locationDetails, 15)}</Text>
                    </Flex>
                )}
                <Flex w={"full"} justifyContent={"end"} >
                    <Text fontSize={"14px"} fontWeight={"600"} >{formatNumber(business?.price)}</Text>
                </Flex>
            </Flex>
            {(mybusiness && !isSelect && (business?.vendor?.userId === userId)) && (
                <Flex as={"button"} onClick={() => clickHandler()} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                    Edit Service
                </Flex>
            )}
            {(!isSelect && (business?.vendor?.userId !== userId)) && (
                <Flex as={"button"} onClick={() => clickHandler()} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                    View Service
                </Flex>
            )}
        </Flex>
    )
}

export default BusinessCard
