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
import { IProduct } from '@/models/product'
import BlurredImage from '../sharedComponent/blurred_image'
import { formatNumber } from '@/utils/numberFormat'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import moment from 'moment'
import UserImage from '../sharedComponent/userimage'
import InfiniteScrollerComponent from '@/hooks/infiniteScrollerComponent'
import { textLimit } from '@/utils/textlimit'
import { IMAGE_URL, SHARE_URL } from '@/services/urls'
import useProductStore from '@/global-state/useCreateProduct'
import ProductImageScroller from '../sharedComponent/productImageScroller'
import { cleanup } from '@/utils/cleanupObj'
import DeleteEvent from '../sharedComponent/delete_event'
import { useDetails } from '@/global-state/useUserDetails'
import ShareEvent from '../sharedComponent/share_event'

export default function GetProduct({ myproduct, name, category, state }: { myproduct?: boolean, name?: string, state?: string, category?: string }) {

    const { primaryColor, bodyTextColor, borderColor, secondaryBackgroundColor, mainBackgroundColor } = useCustomTheme()
    const { productdata, updateProduct } = useProductStore((state) => state);
    const { push } = useRouter()
    const userId = localStorage.getItem('user_id') + "";
    const param = useParams();

    let token = localStorage.getItem("token")
    const id = param?.slug ?? param?.id;

    const query = useSearchParams();
    const frame = query?.get('frame');

    const { results, isLoading, ref, isRefetching: refetchingList } = InfiniteScrollerComponent({
        url: `/products/search${myproduct ? `?creatorID=${id ? id : userId}` : ""}`, limit: 20, filter: "id", name: "getMyProduct" + name + category + state, paramsObj: cleanup({
            name: name,
            category: category?.replaceAll(" ", "_"),
            state: state
        })
    })

    const clickHandler = (item: IProduct) => {
        console.log(item);

        if (frame) {
            window.location.href = `${SHARE_URL}/product?id=${item?.id}`;
        } else if (myproduct && item?.createdBy?.userId === userId) {
            updateProduct({
                ...productdata,
                name: item?.name,
                description: item?.description,
                images: item?.images,
                price: item?.price,
                category: item?.category,
                location: item?.location as any,
                quantity: item?.quantity,
            })
            push("/dashboard/kisok/edit/" + item?.id)
        } else {
            push("/dashboard/kisok/details/" + item?.id)
        }


    }

    let newResult = results?.filter((item: IProduct) => item?.createdBy?.userId !== userId)

    return (
        <LoadingAnimation loading={isLoading} length={(myproduct ? results : newResult)?.length} >
            <Grid w={"full"} templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={["2", "2", "4"]} >
                {(myproduct ? results : newResult)?.map((item: IProduct, index: number) => {
                    if ((myproduct ? results : newResult)?.length === index + 1) {
                        return (
                            <Flex ref={ref} as={"button"} flexDir={"column"} bgColor={mainBackgroundColor} borderColor={borderColor} onClick={() => clickHandler(item)} borderWidth={"1px"} rounded={"10px"} key={index} w={"full"} h={"fit-content"} pos={"relative"} >
                                {item?.createdBy?.userId === userId && (
                                    <DeleteEvent id={item?.id} isProduct={true} name={item?.name + " Product"} isOrganizer={myproduct ? true : false} />
                                )}
                                <Flex w={"full"} h={"fit-content"} pos={"relative"} >
                                    <ProductImageScroller images={item?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.createdBy} />
                                    {!frame && (
                                        <Flex p={"1"} justifyContent={"center"} alignItems={"center"} cursor={"pointer"} pos={"absolute"} bottom={"3"} bgColor={mainBackgroundColor} rounded={"md"} right={"3"} >
                                            <ShareEvent newbtn={true} showText={false} data={item} name={item?.name} id={item?.id} type="KIOSK" eventName={textLimit(item?.name + "", 17)} />
                                        </Flex>
                                    )}
                                </Flex>
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.name), 16)}</Text>
                                    <Text display={["none", "none", "flex"]} fontSize={"12px"} fontWeight={"600"} >{textLimit(item?.category?.replaceAll("_", " "), 20)}</Text>
                                    <Flex alignItems={"center"} >
                                        <Text fontSize={["14px", "14px", "14px"]} fontWeight={"700"} >{formatNumber(item?.price)}</Text>
                                        <Text display={["flex"]} fontSize={"10px"} ml={"auto"} >{item?.quantity} Available</Text>
                                    </Flex>
                                    <Flex w={"full"} gap={["2px", "2px", "1"]} alignItems={"center"} >
                                        <LocationStrokeEx size="17px" color={primaryColor} />
                                        <Text fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["none", "none", "block"]} >{textLimit(item?.location?.locationDetails, 30)}</Text>
                                        <Text fontSize={["10px", "12px", "12px"]} fontWeight={"500"} color={primaryColor} display={["block", "block", "none"]} >{textLimit(item?.location?.locationDetails, 15)}</Text>
                                    </Flex>
                                </Flex>
                                <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                    {(myproduct && (item?.createdBy?.userId === userId)) ? "Edit Product" : "Order Now"}
                                </Flex>
                            </Flex>
                        )
                    } else {
                        return (
                            <Flex as={"button"} flexDir={"column"} bgColor={mainBackgroundColor} borderColor={borderColor} onClick={() => clickHandler(item)} borderWidth={"1px"} rounded={"10px"} key={index} w={"full"} h={"fit-content"} pos={"relative"} >
                                {item?.createdBy?.userId === userId && (
                                    <DeleteEvent id={item?.id} isProduct={true} name={item?.name + " Product"} isOrganizer={myproduct ? true : false} />
                                )}
                                <Flex w={"full"} h={"fit-content"} pos={"relative"} >
                                    <ProductImageScroller images={item?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.createdBy} />
                                    {!frame && (
                                        <Flex p={"1"} justifyContent={"center"} alignItems={"center"} cursor={"pointer"} pos={"absolute"} bottom={"3"} bgColor={mainBackgroundColor} rounded={"md"} right={"3"} >
                                            <ShareEvent newbtn={true} showText={false} data={item} name={item?.name} id={item?.id} type="KIOSK" eventName={textLimit(item?.name + "", 17)} />
                                        </Flex>
                                    )}
                                </Flex>
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.name), 16)}</Text>
                                    <Text display={["flex"]} fontSize={"12px"} fontWeight={"600"} >{textLimit(item?.category?.replaceAll("_", " "), 20)}</Text>
                                    <Flex alignItems={"center"} >
                                        <Text fontSize={["14px", "14px", "14px"]} fontWeight={"700"} >{formatNumber(item?.price)}</Text>
                                        <Text display={["none", "none", "flex"]} fontSize={"10px"} ml={"auto"} >{item?.quantity} Available</Text>
                                    </Flex>
                                    <Flex w={"full"} gap={["1", "1", "2"]} mt={["1", "1", "0px"]} alignItems={"center"} >
                                        <LocationStrokeEx size="17px" color={primaryColor} />
                                        <Text fontSize={["10px", "14px", "14px"]} fontWeight={"500"} color={primaryColor} display={["none", "none", "block"]} >{textLimit(item?.location?.locationDetails, 30)}</Text>
                                        <Text fontSize={["10px", "14px", "14px"]} fontWeight={"500"} color={primaryColor} display={["block", "block", "none"]} >{textLimit(item?.location?.locationDetails, 15)}</Text>
                                    </Flex>
                                </Flex>
                                <Flex as={"button"} onClick={() => clickHandler(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                    {(myproduct && (item?.createdBy?.userId === userId)) ? "Edit Product" : "Order Now"}
                                </Flex>
                            </Flex>
                        )
                    }
                })}
            </Grid>
        </LoadingAnimation>
    )
}
