"use client"
import useCustomTheme from '@/hooks/useTheme'
import { Flex, Grid, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { IoStar } from 'react-icons/io5'
import CustomButton from '../general/Button'
import { CartIcon, Edit2Icon, SheildIcon, TruckColoredIcon } from '../svg'
import httpService from '@/utils/httpService'
import { useQuery } from 'react-query'
import LoadingAnimation from '../sharedComponent/loading_animation'
import { IProduct, IReview } from '@/models/product'
import { IMAGE_URL } from '@/services/urls'
import { formatNumber } from '@/utils/numberFormat'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import UserImage from '../sharedComponent/userimage'
import ProductRating from './productRating'
import ProductCheckout from './productCheckout'
import { useRouter, useSearchParams } from 'next/navigation'
import useProduct from '@/hooks/useProduct'
import useProductStore from '@/global-state/useCreateProduct'
import { textLimit } from '@/utils/textlimit'
import EventMap from '../event_details_component/event_map_info'
import GetCreatorData from './getCreatorData'
import DescriptionPage from '../sharedComponent/descriptionPage'
import ShareEvent from '../sharedComponent/share_event'
import ShareLoginModal from '../sharedComponent/shareLoginModal'

export default function ProductDetails({ id }: { id: string }) {

    const { primaryColor, borderColor, secondaryBackgroundColor, mainBackgroundColor } = useCustomTheme()

    const [item, setItem] = useState({} as IProduct)

    const { push } = useRouter()
    const { userId } = useProduct()
    const { productdata, updateProduct } = useProductStore((state) => state);
    const [qty, setQty] = useState(1)

    const [sizeOfText, setSizeOfText] = useState(200)


    const [reviewData, setData] = useState<Array<IReview>>([])

    const [size, setSize] = useState("")
    const [color, setColor] = useState("")

    const { isLoading } = useQuery(
        ["products", id],
        () => httpService.get(`/products/search`, {
            params: {
                id: id
            }
        }), {
        onSuccess(data) {
            setItem(data?.data?.content[0])
        }
    });

    const clickHandler = (item: IProduct) => {
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
    }

    return (
        <LoadingAnimation loading={isLoading} >
            <Flex pos={"relative"} w={"full"} px={"6"} pt={["6", "6", "6", "6"]} pb={"12"} gap={"6"} flexDir={"column"} overflowY={"auto"} overflowX={"hidden"} >

                <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]} >
                    <Flex w={"full"} flexDir={"column"} gap={"4"} >
                        <Flex gap={"1"} alignItems={"center"} >
                            <Text role='button' onClick={() => push("/dashboard/product/kiosk?type=kiosk")} fontSize={"14px"} color={primaryColor} fontWeight={"500"} >Back</Text>
                            <IoIosArrowForward />
                            <Text fontSize={"14px"} fontWeight={"500"} >Product details</Text>
                            <IoIosArrowForward />
                            <Text fontSize={"14px"} fontWeight={"500"} >{item?.name}</Text>
                        </Flex>
                        {item?.images?.length > 0 && (
                            <Flex w={"full"} h={["340px", "340px", "620px"]} bgColor={secondaryBackgroundColor} pos={"relative"} rounded={"8px"} borderWidth={"1px"} p={"1"} justifyContent={"center"} alignItems={"center"} borderColor={borderColor}  >
                                <Image src={IMAGE_URL + item?.images[0]} alt='logo' rounded={"8px"} height={"full"} objectFit={"contain"} />
                                <Grid templateColumns={["repeat(3, 1fr)"]} pos={"absolute"} gap={"3"} insetX={"4"} bottom={"4"} >
                                    {item?.images?.map((subitem: string, index: number) => {
                                        if (index !== 0 && index <= 3) {
                                            return (
                                                <Flex key={index} w={"full"} h={["100px", "150px"]} bgColor={"black"} rounded={"8px"} shadow={"md"} >
                                                    <Image src={IMAGE_URL + subitem} alt='logo' w={"full"} rounded={"8px"} height={"full"} objectFit={"cover"} />
                                                </Flex>
                                            )
                                        }
                                    })}
                                </Grid>
                            </Flex>
                        )}
                        <Flex w={"full"} display={["none", "none", "flex"]} >
                            <EventMap height={"212px"} location={item?.location?.locationDetails} latlng={item?.location?.latlng ?? ""} />
                            {/* <ProductRating item={item} reviewType="PRODUCT" /> */}
                        </Flex>
                    </Flex>
                    <Flex w={"full"} flexDir={"column"} gap={"4"} >
                        <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} >
                            <Text fontSize={["24px", "24px", "32px"]} fontWeight={"700"} >{capitalizeFLetter(item?.name)}</Text>
                            <Flex w={"8"} h={"8"} justifyContent={"center"} alignItems={"center"} bgColor={secondaryBackgroundColor} rounded={"full"} > 
                                <ShareEvent newbtn={true} showText={false} data={item} name={item?.name} id={item?.id} type="KIOSK" eventName={textLimit(item?.name, 17)} />
                            </Flex>
                        </Flex>
                        <Flex flexDir={["column-reverse", "column-reverse", "column"]} gap={"4"} >
                            <Flex display={["none", "none", "flex"]} >
                                <DescriptionPage limit={200} label='Product Details' description={item?.description} />
                            </Flex>
                            <Flex alignItems={"center"} >
                                <Text fontSize={"24px"} fontWeight={"700"} >{formatNumber(item?.price * qty)}</Text>
                            </Flex>
                        </Flex>
                        <Flex w={"full"} flexDir={["column-reverse", "column-reverse", "column"]} gap={"2"} >
                            <Flex display={["flex", "flex", "none"]} >
                                <DescriptionPage limit={100} label='Product Details' description={item?.description} />
                            </Flex>
                            <Flex w={"full"} gap={"2"}>
                                <Flex w={["fit-content", "fit-content", "full"]} >
                                    <GetCreatorData reviewdata={reviewData} userData={item?.creator} item={item?.rating} />
                                </Flex>
                                <Flex display={["flex", "flex", "none"]} w={"full"}  >
                                    {userId !== item?.creator?.userId && (
                                        <ProductCheckout qty={qty} setQty={setQty} item={item} color={color} size={size} />
                                    )}
                                </Flex>
                            </Flex>
                        </Flex>
                        {/* <GetCreatorData reviewdata={reviewData} userData={item?.creator} /> */}
                        {userId !== item?.creator?.userId && (
                            <Flex display={["none", "none", "flex"]} >
                                <ProductCheckout qty={qty} setQty={setQty} item={item} color={color} size={size} />
                            </Flex>
                        )}

                        <Flex w={"full"} gap={"3"} >
                            {item?.size?.length > 0 && (
                                <Flex w={"full"} flexDir={"column"} gap={"3"} >
                                    <Text fontWeight={"600"} >Sizes</Text>
                                    <Flex gap={"2"} flexWrap={"wrap"} >
                                        {item?.size?.map((item) => {
                                            return (
                                                <Flex key={item} w={"fit-content"} px={"3"} borderWidth={"1px"} cursor={"pointer"} onClick={() => setSize((prev) => prev === item ? "" : item)} h={"10"} justifyContent={"center"} alignItems={"center"} rounded={"lg"} bgColor={size === item ? "#F2F4FF" : mainBackgroundColor} >
                                                    {item}
                                                </Flex>
                                            )
                                        })}
                                    </Flex>
                                </Flex>
                            )}
                            {item?.color?.length > 0 &&
                                <Flex w={"full"} flexDir={"column"} gap={"3"} >
                                    <Text fontWeight={"600"} >Colors</Text>
                                    <Flex gap={"2"} flexWrap={"wrap"} >
                                        {item?.color?.map((item) => {
                                            return (
                                                <Flex key={item?.label} w={"fit-content"} gap={"1"} px={"3"} borderWidth={"1px"} cursor={"pointer"} onClick={() => setColor((prev) => prev === item?.label ? "" : item?.label)} h={"10"} justifyContent={"center"} alignItems={"center"} rounded={"lg"} bgColor={color === item?.label ? "#F2F4FF" : mainBackgroundColor} >
                                                    <Flex w={"7"} h={"7"} rounded={"full"} borderWidth={"1px"} bgColor={item?.color} />{item?.label}
                                                </Flex>
                                            )
                                        })}
                                    </Flex>
                                </Flex>
                            }
                        </Flex>

                        <Flex gap={"3"} mt={"4"} >
                            <Flex w={"28px"} h={"28px"} justifyContent={"center"} alignItems={"center"} >
                                <TruckColoredIcon />
                            </Flex>
                            <Text color={"#0CC23A"} fontWeight={"600"} >Shipping on all orders:</Text>
                        </Flex>
                        <Flex flexDir={"column"} gap={"3"} >
                            <Text fontSize={"14px"} fontWeight={"500"} >{`Seller-Fulfilled Shipping - The seller handles the entire shipping process and not Chasescroll.`}</Text>
                            <Text fontSize={"14px"} fontWeight={"500"} >Verify that items are in good condition and meet the expected quality standards before authorizing payment.</Text>
                            <Text fontSize={"14px"} fontWeight={"500"} >Please inform us if you encounter any issues at support@chasescroll.com</Text>
                        </Flex>
                        <Flex display={["flex", "flex", "flex"]} >
                            <ProductRating setData={setData} data={reviewData} item={item} reviewType="PRODUCT" />
                        </Flex>
                        <Flex w={"full"} display={["flex", "flex", "none"]} >
                            <EventMap height={"212px"} location={item?.location?.locationDetails} latlng={item?.location?.latlng ?? ""} />
                            {/* <ProductRating item={item} reviewType="PRODUCT" /> */}
                        </Flex>
                    </Flex>
                </Flex>
                <ShareLoginModal id={item?.id} type="KIOSK" />
            </Flex>
        </LoadingAnimation>
    )
}
