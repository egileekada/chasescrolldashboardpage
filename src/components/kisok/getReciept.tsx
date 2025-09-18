import InfiniteScrollerComponent from '@/hooks/infiniteScrollerComponent';
import useCustomTheme from '@/hooks/useTheme';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import LoadingAnimation from '../sharedComponent/loading_animation';
import { Flex, Grid, HStack, Image, Text, Textarea, VStack } from '@chakra-ui/react';
import { IOrder, IReceipt } from '@/models/product';
import UserImage from '../sharedComponent/userimage';
import moment from 'moment';
import { capitalizeFLetter } from '@/utils/capitalLetter';
import { formatNumber } from '@/utils/numberFormat';
import CustomButton from '../general/Button';
import { IMAGE_URL } from '@/services/urls';
import { dateFormat, timeFormat } from '@/utils/dateFormat';
import ModalLayout from '../sharedComponent/modal_layout';
import { numberFormat } from '@/utils/formatNumberWithK';
import { textLimit } from '@/utils/textlimit';
import { IoIosClose } from 'react-icons/io';
import useProduct from '@/hooks/useProduct';
import Fundpaystack from '../settings_component/payment_component/card_tabs/fund_wallet/fundpaystack';
import { FiMinus, FiPlus } from 'react-icons/fi';
import ProductImageScroller from '../sharedComponent/productImageScroller';
import ConfirmPayment from './confirmPayment';
import Reciept from './cards/Reciept';

interface IAction {
    value: number;
    type: 'ADDITION' | 'SUBSTRACTION',
}

export default function GetReciept() {

    const { primaryColor, mainBackgroundColor, borderColor } = useCustomTheme()
    const { push } = useRouter()
    const userId = localStorage.getItem('user_id') + ""; 
    const [percentage, setPercentage] = useState(0)
    const [price, setPrice] = useState("")

    const [status, setStatus] = useState("")

    const [detail, setDetails] = useState({} as IReceipt)

    const { updateRecipt: reject, updateRecipt, configPaystack, dataID, message, setPaystackConfig, payForTicket, open, setOpen, updateReciptPrice } = useProduct(null, true)

    const { results, isLoading, ref } = InfiniteScrollerComponent({ url: `/reciept/search?userID=${userId}`, limit: 20, filter: "id", name: "getreciept" })

    const clickHander = (item: IReceipt) => {
        setDetails(item)
        setPrice(item?.price + "")
        setOpen(true)
    }

    const updateHandler = (item: "PENDING" | "ACCEPTED" | "CANCELLED") => {
        setStatus(item)
        updateRecipt?.mutate({
            payload: {
                status: item
            }, id: detail?.id
        })
    }

    useEffect(() => {
        if (!updateRecipt?.isLoading) {
            setStatus("")
        }
    }, [updateRecipt?.isLoading])


    const handlePriceChange = (itemData: IAction) => {

        let prevPer = detail?.price - (detail?.rental?.price * detail?.frequency)

        console.log();
        if (itemData.type === 'ADDITION') {
            // calculate 5% fo the inital price
            const Percentage = ((detail?.price - prevPer) / detail?.frequency) * Number((percentage + 0.05)?.toFixed(2));
            const newPrice = ((detail?.price - prevPer) / detail?.frequency) + Percentage;
            setPrice(((newPrice * detail?.frequency)  + prevPer ).toString());
            setPercentage(Number((percentage + 0.05)?.toFixed(2)))
        } else {
            const Percentage = ((detail?.price - prevPer ) / detail?.frequency) * Number((percentage - 0.05)?.toFixed(2));
            const newPrice = ((detail?.price - prevPer ) / detail?.frequency) + Percentage;
            setPrice(((newPrice * detail?.frequency) + prevPer ).toString());
            setPercentage(Number((percentage - 0.05)?.toFixed(2)))
        }
    } 

    return (
        <LoadingAnimation loading={isLoading} length={results?.length} >
            <Grid templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={["4", "4", "6"]} >
                {results?.map((item: IReceipt, index: number) => {
                    if (results?.length === index + 1) {
                        return (
                            <Flex as={"button"} ref={ref} borderColor={borderColor} flexDir={"column"} onClick={() => clickHander(item)} borderWidth={"1px"} rounded={"10px"} bgColor={mainBackgroundColor} key={index} w={"full"} >
                                <ProductImageScroller images={item?.rental?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.vendor} />
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.rental?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.rental?.name), 16)}</Text>
                                    <Flex alignItems={"center"} >
                                        <Text fontSize={["14px", "14px", "14px"]} fontWeight={"400"} >Order On {dateFormat(item?.createdDate)}</Text>
                                    </Flex>
                                </Flex>
                                <Flex as={"button"} onClick={() => clickHander(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                    {"View Details"}
                                </Flex>
                            </Flex>
                        )
                    } else {
                        return (
                            <Flex as={"button"} flexDir={"column"} borderColor={borderColor} onClick={() => clickHander(item)} borderWidth={"1px"} rounded={"10px"} bgColor={mainBackgroundColor} key={index} w={"full"} >
                                <ProductImageScroller images={item?.rental?.images} createdDate={moment(item?.createdDate)?.fromNow()} userData={item?.vendor} />
                                <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]} >
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(item?.rental?.name), 20)}</Text>
                                    <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(item?.rental?.name), 16)}</Text>
                                    <Flex alignItems={"center"} >
                                        <Text fontSize={["14px", "14px", "14px"]} fontWeight={"400"} >Order On {dateFormat(item?.createdDate)}</Text>
                                    </Flex>
                                </Flex>
                                <Flex as={"button"} onClick={() => clickHander(item)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                                    {"View Details"}
                                </Flex>
                            </Flex>
                        )
                    }
                })}
            </Grid>

            <ModalLayout size={"2xl"} open={open} close={setOpen} closeIcon={false} >
                <Reciept payForTicket={payForTicket} price={price} reject={reject} setOpen={setOpen} handlePriceChange={handlePriceChange} userId={userId} updateHandler={updateHandler} updateRecipt={updateRecipt} detail={detail} updateReciptPrice={updateReciptPrice}  />
            </ModalLayout>
            <Fundpaystack id={dataID} config={configPaystack} setConfig={setPaystackConfig} message={message} />
        </LoadingAnimation>
    )
}
