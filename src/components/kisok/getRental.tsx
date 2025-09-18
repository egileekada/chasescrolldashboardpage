"use client"
import { Grid, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import CustomButton from '../general/Button'
import { LocationStroke, LocationStrokeEx } from '../svg'
import useCustomTheme from '@/hooks/useTheme'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
import httpService from '@/utils/httpService'
import LoadingAnimation from '../sharedComponent/loading_animation'
import InfiniteScrollerComponent from '@/hooks/infiniteScrollerComponent'
import { IRental } from '@/models/product'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import moment from 'moment'
import UserImage from '../sharedComponent/userimage'
import BlurredImage from '../sharedComponent/blurred_image'
import { textLimit } from '@/utils/textlimit'
import { formatNumber } from '@/utils/numberFormat'
import { IMAGE_URL, LANDINGPAGE_URL, SHARE_URL } from '@/services/urls'
import ProductImageScroller from '../sharedComponent/productImageScroller'
import { cleanup } from '@/utils/cleanupObj'
import useProductStore from '@/global-state/useCreateProduct'
import DeleteEvent from '../sharedComponent/delete_event'
import { IoMdCheckmark } from 'react-icons/io'
import { useDetails } from '@/global-state/useUserDetails'
import ShareEvent from '../sharedComponent/share_event'
export default function GetRental({ myrental, name, state, category, isSelect, selected, setSelected }: { myrental?: boolean, name?: string, state?: string, category?: string, isSelect?: boolean, selected?: any, setSelected?: any }) {

    const { primaryColor, bodyTextColor, borderColor, mainBackgroundColor } = useCustomTheme()
    const { push } = useRouter()
    const { rentaldata, updateRental } = useProductStore((state) => state);

    const userId = localStorage.getItem('user_id') + "";
    const param = useParams();
    const id = param?.slug ?? param?.id;
    const query = useSearchParams();
    const frame = query?.get('frame');

    const { results, isLoading, ref, isRefetching: refetchingList } = InfiniteScrollerComponent({
        url: `/rental/search${myrental ? `?userId=${id ? id : userId}` : ""}`, limit: 20, filter: "id", name: "getMyrental", paramsObj: cleanup({
            name: name,
            category: category?.replaceAll(" ", "_"),
            state: state
        })
    })

    const clickHandler = (item: IRental) => {
        if (frame) {
            window.parent.location.href = `${LANDINGPAGE_URL}/auth`;
        } else if (isSelect) {
            let clone = [...selected]

            if (selected?.includes(item?.id)) {
                clone = clone?.filter((subitem: string) => subitem !== item?.id)
                setSelected(clone)
            } else {
                clone = [...clone, item?.id]
                setSelected(clone)
            }
        } else {
            if (myrental && (item?.creator?.userId === userId)) {
                updateRental({
                    ...rentaldata,
                    name: item?.name,
                    description: item?.description,
                    images: item?.images,
                    price: item?.price,
                    category: item?.category,
                    location: item?.location as any,
                    maximiumNumberOfDays: item?.maximiumNumberOfDays,
                    frequency: item?.frequency + "",
                    state: item?.location?.state
                })
                push("/dashboard/kisok/edit/" + item?.id + "/rental")
            } else {
                push("/dashboard/kisok/details-rental/" + item?.id)
            }
        }
    }

    let newResult = results?.filter((item: IRental) => item?.creator?.userId !== userId)

    return (
        <LoadingAnimation loading={isLoading} length={(myrental ? results : newResult)?.length} >
            <Grid w={"full"} templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={["2", "2", "4"]}  >
                {(myrental ? results : newResult)?.map((item: IRental, index: number) => {
                    if ((myrental ? results : newResult)?.length === index + 1) {
                        return (
                            <Flex ref={ref} as={"button"} flexDir={"column"} borderColor={borderColor} onClick={() => clickHandler(item)} borderWidth={"1px"} rounded={"10px"} bgColor={mainBackgroundColor} key={index} w={"full"} pos={"relative"} >
                                {(!isSelect && (item?.creator?.userId === userId)) && (
                                    <DeleteEvent id={item?.id} isRental={true} name={item?.name + " Rental"} isOrganizer={myrental ? true : false} />
                                )}
                                {isSelect && (
                                    <Flex pos={"absolute"} zIndex={"30"} top={"3"} right={"3"} w={"5"} h={"5"} justifyContent={"center"} alignItems={"center"} bgColor={selected?.includes(item?.id) ? primaryColor : "white"} rounded={"6px"} >
                                        <IoMdCheckmark size={"15px"} color='white' />
                                    </Flex>
                                )}

                                <Flex w={"full"} h={"fit-content"} pos={"relative"} >
                                    <ProductImageScroller images={item?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.creator} />
                                    {/* {!frame && (
                                        <Flex w={"8"} h={"8"} justifyContent={"center"} alignItems={"center"} cursor={"pointer"} pos={"absolute"} bottom={"3"} bgColor={mainBackgroundColor} rounded={"full"} right={"3"} >
                                            <ShareEvent newbtn={true} showText={false} data={item} name={item?.name} id={item?.id} type="RENTAL" eventName={textLimit(item?.name + "", 17)} />
                                        </Flex>
                                    )} */}
                                </Flex>
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.name), 16)}</Text>
                                    <Text display={["flex"]} fontSize={"12px"} fontWeight={"600"} >{textLimit(item?.category?.replaceAll("_", " "), 30)}</Text>
                                    <Flex w={"full"} gap={["2px", "2px", "1"]} alignItems={"center"} justifyContent={"start"} >
                                        <Flex w={"fit-content"} >
                                            <LocationStrokeEx size="17px" color={primaryColor} />
                                        </Flex>
                                        <Text textAlign={"left"} fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["none", "none", "block"]} >{textLimit(item?.location?.locationDetails, 20)}</Text>
                                        <Text textAlign={"left"} fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["block", "block", "none"]} >{textLimit(item?.location?.locationDetails, 15)}</Text>
                                    </Flex>
                                    <Flex justifyContent={"end"} alignItems={"center"} >

                                        {(item?.dailyPrice || item?.hourlyPrice) && (
                                            <Flex flexDir={"column"} >
                                                {item?.hourlyPrice && (
                                                    <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.hourlyPrice)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{"Per hour"}</span></Text>
                                                )}
                                                {item?.dailyPrice && (
                                                    <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.dailyPrice)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{"Per day"}</span></Text>
                                                )}
                                            </Flex>
                                        )}
                                        {item?.price && (
                                            <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.price)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{item?.frequency !== "HOURLY" ? "Per day" : "Per hour"}</span></Text>
                                        )}
                                    </Flex>
                                </Flex>
                                {(myrental && (item?.creator?.userId === userId)) && (
                                    <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                        Edit Rental
                                    </Flex>
                                )}
                                {((item?.creator?.userId !== userId)) && (
                                    <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                        View Rental
                                    </Flex>
                                )}
                            </Flex>
                        )
                    } else {
                        return (
                            <Flex as={"button"} flexDir={"column"} borderColor={borderColor} onClick={() => clickHandler(item)} borderWidth={"1px"} rounded={"10px"} bgColor={mainBackgroundColor} key={index} w={"full"} pos={"relative"} >
                                {(!isSelect && (item?.creator?.userId === userId)) && (
                                    <DeleteEvent id={item?.id} isRental={true} name={item?.name + " Rental"} isOrganizer={myrental ? true : false} />
                                )}
                                {isSelect && (
                                    <Flex pos={"absolute"} zIndex={"30"} top={"3"} right={"3"} w={"5"} h={"5"} justifyContent={"center"} alignItems={"center"} bgColor={selected?.includes(item?.id) ? primaryColor : "white"} rounded={"6px"} >
                                        <IoMdCheckmark size={"15px"} color='white' />
                                    </Flex>
                                )}
                                <Flex w={"full"} h={"fit-content"} pos={"relative"} >
                                    <ProductImageScroller images={item?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.creator} />
                                    {/* {!frame && (
                                        <Flex w={"8"} h={"8"} justifyContent={"center"} alignItems={"center"} cursor={"pointer"} pos={"absolute"} bottom={"3"} bgColor={mainBackgroundColor} rounded={"full"} right={"3"} >
                                            <ShareEvent newbtn={true} showText={false} data={item} name={item?.name} id={item?.id} type="RENTAL" eventName={textLimit(item?.name + "", 17)} />
                                        </Flex>
                                    )} */}
                                </Flex>
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.name), 16)}</Text>
                                    <Text display={["flex"]} fontSize={"12px"} fontWeight={"600"} >{textLimit(item?.category?.replaceAll("_", " "), 30)}</Text>
                                    <Flex w={"full"} gap={["2px", "2px", "1"]} alignItems={"center"} >
                                        <Flex w={"fit-content"} >
                                            <LocationStrokeEx size="17px" color={primaryColor} />
                                        </Flex>
                                        <Text textAlign={"left"} fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["none", "none", "block"]} >{textLimit(item?.location?.locationDetails, 20)}</Text>
                                        <Text textAlign={"left"} fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["block", "block", "none"]} >{textLimit(item?.location?.locationDetails, 15)}</Text>
                                    </Flex>
                                    <Flex justifyContent={"end"} alignItems={"center"} h={"full"} >
                                        {(item?.dailyPrice || item?.hourlyPrice) && (
                                            <Flex flexDir={"column"} textAlign={"left"} >
                                                {item?.hourlyPrice && (
                                                    <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.hourlyPrice)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{"Per hour"}</span></Text>
                                                )}
                                                {item?.dailyPrice && (
                                                    <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.dailyPrice)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{"Per day"}</span></Text>
                                                )}
                                            </Flex>
                                        )}
                                        {item?.price && (
                                            <Text fontWeight={"600"} fontSize={"14px"} >{formatNumber(item?.price)} <span style={{ color: primaryColor, fontSize: "12px", fontWeight: "normal" }} >{item?.frequency !== "HOURLY" ? "Per day" : "Per hour"}</span></Text>
                                        )}
                                    </Flex>
                                </Flex>
                                {(myrental && (item?.creator?.userId === userId)) && (
                                    <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} marginTop={"auto"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                        Edit Rental
                                    </Flex>
                                )}
                                {((item?.creator?.userId !== userId)) && (
                                    <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} marginTop={"auto"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                        View Rental
                                    </Flex>
                                )}
                            </Flex>
                        )
                    }
                })}
            </Grid>
        </LoadingAnimation>
    )
}
