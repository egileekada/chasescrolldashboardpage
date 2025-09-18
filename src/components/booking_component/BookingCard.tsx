import usePaystackStore from '@/global-state/usePaystack'
import { useDetails } from '@/global-state/useUserDetails'
import useCustomTheme from '@/hooks/useTheme'
import { IBooking } from '@/models/Booking'
import { IService } from '@/models/Service'
import { IMAGE_URL } from '@/services/urls'
import httpService from '@/utils/httpService'
import { VStack, HStack, Box, Text, Image, Flex, useToast, Button } from '@chakra-ui/react'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PaginatedResponse } from '@/models/PaginatedResponse';
import Fundpaystack from '../settings_component/payment_component/card_tabs/fund_wallet/fundpaystack'
import { FiMinus, FiPlus } from 'react-icons/fi'
import UserImage from '../sharedComponent/userimage'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import { textLimit } from '@/utils/textlimit'
import { dateFormat } from '@/utils/dateFormat'
import ModalLayout from '../sharedComponent/modal_layout'
import CustomButton from '../general/Button'
import { IoIosClose } from 'react-icons/io'
import { formatNumber } from '@/utils/numberFormat'
import ProductImageScroller from '../sharedComponent/productImageScroller'
import { SuccessIcon } from '../svg'
import useProduct from '@/hooks/useProduct'

export interface ICategory {
    id: string;
    category: string;
}

interface IAction {
    value: number;
    type: 'ADDITION' | 'SUBSTRACTION',
}

const ServiceCard = ({ serviceID }: { serviceID: string }) => {

    const {
        primaryColor, secondaryBackgroundColor,
        headerTextColor,
        bodyTextColor,
        mainBackgroundColor,
        borderColor
    } = useCustomTheme();




    return (
        <VStack w='auto' h='25px' px='10px' backgroundColor={'#EFF1FE'} borderRadius={'full'} borderWidth={'1px'} borderColor={borderColor} justifyContent={'center'} alignItems={'center'} flexShrink={0}>
            <Text fontWeight={300} fontSize='16px' color={primaryColor}>{serviceID}</Text>
        </VStack>
    )
}

function BookingCard({ business, booking, isVendor = false, shouldNavigate = true, showBorder = true }: { business: IService, booking: IBooking, isVendor?: boolean, shouldNavigate?: boolean, showBorder?: boolean }) {
    const toast = useToast()
    const router = useRouter();
    const { userId } = useDetails((state) => state);
    // const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false)

    const [bookingState, setBookingState] = React.useState(booking);
    const [percentage, setPercentage] = useState(0)
    const [price, setPrice] = React.useState(bookingState?.price + "");
    const [updatedPrice, setUpdatedPrice] = React.useState(bookingState?.price + "");
    const [service, setService] = React.useState<IService | null>(null);

    const { payForTicket, open, setOpen } = useProduct(null, false, false, true)

    const [loading, setLoading] = useState(false)
    const [loadingReject, setLoadingReject] = useState(false);

    React.useEffect(() => {
        if (bookingState?.price !== parseInt(updatedPrice)) {
            setUpdatedPrice(bookingState?.price + "");
        }
    }, [bookingState?.price]);


    const items: IAction[] = [
        {
            value: 500,
            type: 'ADDITION',
        },
        {
            value: 1000,
            type: 'ADDITION',
        },
        {
            value: 10000,
            type: 'ADDITION',
        },
        {
            value: 500,
            type: 'SUBSTRACTION',
        },
        {
            value: 1000,
            type: 'SUBSTRACTION',
        },
        {
            value: 10000,
            type: 'SUBSTRACTION',
        },
    ];

    const {
        primaryColor, secondaryBackgroundColor,
        headerTextColor,
        bodyTextColor,
        mainBackgroundColor,
        borderColor
    } = useCustomTheme();

    const queryClient = useQueryClient();

    // queries
    const { isLoading: isLoadingBoking } = useQuery([`get-booking-${booking?.id}`, booking?.id], () => httpService.get("/booking/search", {
        params: {
            id: booking?.id,
        }
    }), {
        refetchInterval: 2000,
        onSuccess: (data: any) => {
            const item: PaginatedResponse<IBooking> = data?.data;

            if (item?.content?.length > 0) {
                setBookingState(item.content[0]);
            }
        },
        onError: (error: any) => { },
    });

    const { isLoading: isLoadingBusiness } = useQuery([`get-business-${business?.id}`, business?.id], () => httpService.get("/business-service/search", {
        params: {
            id: business?.id,
        }
    }), {
        onSuccess: (data: any) => {
            const item: PaginatedResponse<IService> = data?.data;

            if (item?.content?.length > 0) {
                setService(item.content[0]);
            }
        },
        onError: (error: any) => { },
    });

    // mutations
    const userUpdatePrice = useMutation({
        mutationFn: () => httpService.put('/booking/update-price', {
            bookingID: booking?.id,
            isVendor: false,
            newPrice: price
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);

            setLoading(false)
            setOpen(false)
            setLoadingReject(false)
        }
    });

    const vendorUpdatePrice = useMutation({
        mutationFn: () => httpService.put('/booking/update-price', {
            bookingID: booking?.id,
            isVendor: true,
            newPrice: price
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);
            setLoading(false)
            setLoadingReject(false)
        }
    });

    const vendorAcceptOrDecline = useMutation({
        mutationFn: (data: boolean) => httpService.put('/booking/accept-or-decline', {
            bookingID: booking?.id,
            accepted: data,
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);
            setLoading(false)
            setLoadingReject(false)
        }
    });

    const vendorMarkAsDone = useMutation({
        mutationFn: () => httpService.put('/booking/vendor-mark-as-done', {
            bookingID: booking?.id,
            vendorID: booking?.vendor?.id,
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            });
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);

        }
    });

    const userMarkAsDone = useMutation({
        mutationFn: (data: boolean) => httpService.put('/booking/user-mark-as-done', {
            bookingID: booking?.id,
            completedWithIssues: data,
            userID: userId,
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);
            setOpen(false)
            // setShow(true)

        }
    });

    const cancelBooking = useMutation({
        mutationFn: () => httpService.put('/booking/cancel-booking', {
            bookingID: booking?.id,
            userID: userId,
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries([`get-booking-${booking?.id}`]);
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error?.message,
                status: 'error',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
        }
    });

    const deleteBooking = useMutation({
        mutationFn: () => httpService.delete(`/booking/delete/${booking?.id}`),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: data?.data?.message,
                status: 'success',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
            queryClient.invalidateQueries(['get-my-bookings']);
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error?.message,
                status: 'error',
                position: 'top-right',
                isClosable: true,
                duration: 5000,
            })
        }
    });

    const clickHandle = (item: boolean) => {
        if (item) {
            setLoading(true)
        } else {
            setLoadingReject(true)
        }
        vendorAcceptOrDecline.mutate(item)
    }
    const PAYSTACK_KEY: any = process.env.NEXT_PUBLIC_PAYSTACK_KEY;
    const { } = usePaystackStore((state) => state);


    const handlePayment = () => {
        payForTicket.mutate({
            seller: booking?.businessOwner?.userId,
            price: Number(booking?.price),
            currency: "NGN",
            orderType: "BOOKING",
            typeID: booking?.id + ""
        })
    }

    const handlePriceChange = (item: IAction) => {
        // calculate 5% fo the inital price

        const diff = (bookingState?.price - bookingState?.service?.price)

        if (item?.type === "ADDITION") {
            const Percentage = (bookingState?.price - diff) * (percentage + 0.05);
            const newPrice = (bookingState?.price - diff) + Percentage;
            setPrice((newPrice + diff).toString());
            setPercentage(percentage + 0.05)
        } else {
            const Percentage = (bookingState?.price - diff) * (percentage - 0.05);
            const newPrice = (bookingState?.price - diff) + Percentage;
            setPrice((newPrice + diff).toString());
            setPercentage(percentage - 0.05)
        }
    }

    const [textSize, setTextSize] = useState(40)


    useEffect(() => {
        setPercentage(0)
    }, [open])

    return (
        <Flex as={"button"} flexDir={"column"} borderColor={borderColor} onClick={() => setOpen(true)} borderWidth={"1px"} bgColor={mainBackgroundColor} rounded={"10px"} w={"full"} >
            <ProductImageScroller images={bookingState?.service?.images} createdDate={moment(bookingState?.createdDate)?.fromNow()} userData={bookingState?.createdBy?.userId === userId ? bookingState?.businessOwner : bookingState?.createdBy} />
            <Flex flexDir={"column"} px={["2", "2", "3"]} pt={["2", "2", "3"]} gap={"1"} pb={["2", "2", "0px"]}  >
                <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["none", "none", "block"]} >{textLimit(capitalizeFLetter(bookingState?.service?.name), 20)}</Text>
                <Text fontSize={["14px", "14px", "17px"]} fontWeight={"600"} textAlign={"left"} display={["block", "block", "none"]} >{textLimit(capitalizeFLetter(bookingState?.service?.name), 16)}</Text>
                <Flex w='full' >
                    <Text w={"50px"} textAlign={"left"} display={"flex"} justifyContent={"start"} fontSize={'14px'}>Email:</Text>
                    <Text fontSize={'14px'}>{bookingState?.service?.email}</Text>
                </Flex>
                <Flex w='full' >
                    <Text w={"50px"} textAlign={"left"} display={"flex"} justifyContent={"start"} fontSize={'14px'}>Phone:</Text>
                    <Text fontSize={'14px'}>{bookingState?.service?.phone ?? 'None'}</Text>
                </Flex>
            </Flex>
            <Flex as={"button"} onClick={() => setOpen(true)} w={"full"} display={["none", "none", "flex"]} color={primaryColor} borderTopWidth={"1px"} fontFamily={"14px"} mt={2} fontWeight={"600"} py={"2"} justifyContent={"center"} >
                View Request
            </Flex>
            <ModalLayout size={"2xl"} open={open} close={setOpen} >

                <Flex w='full' px="4" pb={"5"} py={"5"} h={["fit-content", "fit-content", "fit-content"]} flexDir={["column"]} borderColor={borderColor} borderRadius={'15px'} alignItems={'flex-start'} overflowX={'hidden'} gap={"3"}>

                    <Flex as={"button"} onClick={() => setOpen(false)} w={"fit-content"} pos={"absolute"} top={"1"} right={"2"} >
                        <IoIosClose size={"25px"} />
                    </Flex>
                    <Flex w={"full"} gap={"4"} flexDir={["column", "column", "column"]} >

                        <Flex w={"full"} gap={"4"} flexDir={["column", "column", "row"]} >
                            <Flex w={["full", "full", "fit-content"]} >
                                <Flex flexDir={"column"} gap={"2"} w={["full", "full", "300px"]} >
                                    <Flex w={["full", "full", "300px"]} h={"157px"} rounded={"8px"} bgColor={"#00000066"} position={"relative"} justifyContent={"center"} alignItems={"center"} >
                                        {bookingState?.createdBy?.userId === userId && (
                                            <Flex w={"fit-content"} h={"fit-content"} p={"6px"} pr={"5"} rounded={"24px"} pos={"absolute"} top={"3"} left={"3"} borderWidth={"1px"} borderColor={"white"} alignItems={"center"} gap={2} zIndex={"20"} >
                                                <UserImage image={bookingState?.businessOwner?.data?.imgMain?.value} font={"16px"} data={bookingState?.businessOwner} border={"1px"} size={"32px"} />
                                                <Flex flexDir={"column"} alignItems={"start"} color={"white"} >
                                                    <Text fontSize={"12px"} fontWeight={"700"} >
                                                        {capitalizeFLetter(bookingState?.businessOwner?.firstName) + " " + capitalizeFLetter(bookingState?.businessOwner?.lastName)}
                                                    </Text>
                                                    <Text fontSize={"10px"} color={"white"} fontWeight={"600"} >
                                                        Vendor
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        )}
                                        {bookingState?.createdBy?.userId !== userId && (
                                            <Flex w={"fit-content"} h={"fit-content"} p={"6px"} pr={"5"} rounded={"24px"} pos={"absolute"} top={"3"} left={"3"} borderWidth={"1px"} borderColor={"white"} alignItems={"center"} gap={2} zIndex={"20"} >
                                                <UserImage image={bookingState?.createdBy?.data?.imgMain?.value} font={"16px"} data={bookingState?.createdBy} border={"1px"} size={"32px"} />
                                                <Flex flexDir={"column"} alignItems={"start"} color={"white"} >
                                                    <Text fontSize={"12px"} fontWeight={"700"} >
                                                        {capitalizeFLetter(bookingState?.createdBy?.firstName) + " " + capitalizeFLetter(bookingState?.createdBy?.lastName)}
                                                    </Text>
                                                    <Text fontSize={"10px"} color={"white"} fontWeight={"600"} >
                                                        Client
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        )}
                                        <Flex pos={"absolute"} inset={"0px"} bgColor={"black"} opacity={"20%"} zIndex={"10"} rounded={"8px"} />
                                        <Image borderColor={"#D0D4EB"} objectFit={"cover"} alt={bookingState?.service?.images[0]} w={["full", "full", "300px"]} h={"157px"} src={bookingState?.service?.images[0].startsWith('https://') ? bookingState?.service?.images[0] : (IMAGE_URL as string) + bookingState?.service?.images[0]} />
                                    </Flex>
                                    <Flex flexDir={"column"} gap={"1"} w={"full"} >
                                        <Flex justifyContent={["start", "start", "space-between"]} w={"full"} p={"5px"} bgColor={secondaryBackgroundColor} flexDir={["column", "column", "column"]} >
                                            <Text fontWeight={400} fontSize={'12px'}>Service Details:</Text>
                                            <Text fontSize={"12px"} fontWeight={"600"} >{textLimit(capitalizeFLetter(bookingState?.description), textSize)}<span role='button' style={{ color: primaryColor, fontSize: "12px", fontWeight: "600" }} onClick={() => setTextSize((prev) => prev === 40 ? bookingState?.description?.length + 1 : 40)} >{bookingState?.description?.length > 40 ? (textSize < bookingState?.description?.length ? "show more" : "show less") : ""}</span></Text>
                                        </Flex>
                                        <Flex justifyContent={["start", "start", "start"]} w={"full"} flexDir={["row", "row", "row"]} gap={"1"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Booking Date:</Text>
                                            <Text fontSize={"12px"} >{dateFormat(bookingState?.date?.millis)}</Text>
                                        </Flex>

                                        <Flex justifyContent={["start", "start", "start"]} alignItems={"center"} w={"full"} flexDir={["row", "row", "row"]} gap={"1"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Service Initial Price:</Text>
                                            <Flex pos={"relative"}  >
                                                <Flex w={"full"} h={"1.5px"} pos={"absolute"} top={"11px"} bgColor={"black"} />
                                                <Text fontSize={"14px"} fontWeight={"600"} textDecor={""} >{formatNumber(bookingState?.service?.price)}</Text>
                                            </Flex>
                                            <Text fontSize={"12px"} fontWeight={"500"}  >{((bookingState?.service?.price - bookingState?.price) * 100) / bookingState?.service?.price > 0 ? "by" : "plus"} {((bookingState?.service?.price - bookingState?.price) * 100) / bookingState?.service?.price > 0 ? (((bookingState?.service?.price - bookingState?.price) * 100) / bookingState?.service?.price) : (((bookingState?.service?.price - bookingState?.price) * 100) / bookingState?.service?.price)?.toString()?.replace("-", "")}%</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex w={"full"} flexDir={"column"} gap={"2"} >
                                {isVendor && (
                                    <Flex w={"full"} h={"157px"} flexDir={"column"} gap={"1"} >
                                        <Flex flexDir={"row"} gap={"1"} w={"fit-content"} alignItems={"center"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Reciept ID:</Text>
                                            <Text fontWeight={400} fontSize={'12px'} bgColor={secondaryBackgroundColor} p={"2px"} rounded={"8px"} px={"4px"} >{bookingState?.service?.id}</Text>
                                        </Flex>
                                        <Flex flexDir={"column"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Client Name</Text>
                                            <Text fontWeight={600} fontSize={'16px'}>{bookingState?.createdBy?.firstName + " " + bookingState?.createdBy?.lastName}</Text>
                                        </Flex>
                                        <Flex gap={"1"} flexDir={"column"} >
                                            <HStack w='full' justifyContent={'flex-start'} >
                                                <Text w={"50px"} fontSize={'14px'}>Email:</Text>
                                                <Text fontSize={'14px'}>{bookingState?.createdBy?.email}</Text>
                                            </HStack>

                                            <HStack w='full' justifyContent={'flex-start'} >
                                                <Text w={"50px"} fontSize={'14px'}>Phone:</Text>
                                                <Text fontSize={'14px'}>{bookingState?.createdBy?.data?.mobilePhone?.value ?? 'None'}</Text>
                                            </HStack>
                                        </Flex>
                                    </Flex>
                                )}
                                {!isVendor && (
                                    <Flex w={"full"} h={"157px"} flexDir={"column"} gap={"1"} >
                                        <Flex flexDir={"row"} gap={"1"} w={"fit-content"} alignItems={"center"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Reciept ID:</Text>
                                            <Text fontWeight={400} fontSize={'12px'} bgColor={secondaryBackgroundColor} p={"2px"} rounded={"8px"} px={"4px"} >{bookingState?.service?.id}</Text>
                                        </Flex>
                                        <Flex flexDir={"column"} >
                                            <Text fontWeight={400} fontSize={'12px'}>Business Name</Text>
                                            <Text fontWeight={600} fontSize={'16px'}>{capitalizeFLetter(bookingState?.service?.name)}</Text>
                                        </Flex>
                                        <Flex gap={"1"} flexDir={"column"} >
                                            <HStack w='full' justifyContent={'flex-start'} >
                                                <Text w={"50px"} fontSize={'14px'}>Email:</Text>
                                                <Text fontSize={'14px'}>{bookingState?.service?.email}</Text>
                                            </HStack>

                                            <HStack w='full' justifyContent={'flex-start'} >
                                                <Text w={"50px"} fontSize={'14px'}>Phone:</Text>
                                                <Text fontSize={'14px'}>{bookingState?.service?.phone ?? 'None'}</Text>
                                            </HStack>
                                        </Flex>
                                    </Flex>
                                )}
                                <Flex flexDir={"column"} px={"3"} gap={"3"} w={"full"} h={"full"} >
                                    {(!bookingState?.hasPaid && bookingState?.bookingStatus !== "CANCELLED" && bookingState?.bookingStatus !== "COMPLETED" && !isVendor) && (
                                        <VStack spacing={5} mt='10px' alignItems="center">
                                            <Text fontSize={'14px'}>You can negotiate this price by 5%</Text>
                                            <HStack width={'120px'} height={'35px'} borderRadius={'50px'} overflow={'hidden'} backgroundColor={'#DDE2E6'}>
                                                <Flex cursor={'pointer'} onClick={() => handlePriceChange({ type: 'SUBSTRACTION', value: 0 })} w={"full"} height={'100%'} borderRightWidth={'1px'} borderRightColor={'gray'} justifyContent={'center'} alignItems={'center'}>
                                                    <FiMinus size={12} color='black' />
                                                </Flex>
                                                <Flex cursor={'pointer'} onClick={() => handlePriceChange({ type: 'ADDITION', value: 0 })} w={"full"} height={'100%'} justifyContent={'center'} alignItems={'center'}>
                                                    <FiPlus size={12} color='black' />
                                                </Flex>
                                            </HStack>
                                        </VStack>
                                    )}
                                    <Flex flexDir={["row", "row"]} justifyContent={'end'} gap={"5"} mt={"auto"} w='full' alignItems={'center'}>
                                        <Text fontSize={'14px'}>Total Price:</Text>
                                        <Text fontSize={'23px'} fontWeight={700}>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(parseInt(price) || 0)}</Text>
                                    </Flex>

                                </Flex>
                            </Flex>

                        </Flex>
                        <Flex flexDir={"column"} w={'full'} gap={"3"} >
                            <Flex px={"3"} flexDir={"column"} w={"full"} >
                                {!isVendor && (
                                    <>
                                        {bookingState.bookingStatus === 'PENDING' && (
                                            <VStack width='100%'>
                                                <Flex w={"full"} gap={"4"} >
                                                    <Button _hover={{ backgroundColor: primaryColor }} isDisabled={(bookingState?.price === Number(price)) ? true : false} onClick={() => userUpdatePrice.mutate()} isLoading={userUpdatePrice.isLoading} w='full' minHeight={'45px'} h='50px' borderRadius='full' borderWidth={'1px'} color={'white'} bg={primaryColor}>
                                                        <Text fontSize={'14px'} color={'white'}>Update Price</Text>
                                                    </Button>

                                                    <Button w='full' h='50px' borderRadius='full' _hover={{ backgroundColor: "#FF9500" }} borderWidth={'1px'} borderColor={"#FF9500"} bg={"#FF9500"}>
                                                        <Text fontSize={'14px'} color={"white"}>Pending Approval</Text>
                                                    </Button>
                                                </Flex>

                                                <Button onClick={() => cancelBooking.mutate()} isLoading={cancelBooking.isLoading} w='100%' h='50px' borderRadius='full' borderWidth={'0px'} bg={"transparent"}>
                                                    <Text fontSize={'14px'} color={'red'}>Cancel Booking</Text>
                                                </Button>
                                            </VStack>
                                        )}
                                        {bookingState.bookingStatus === 'REJECTED' && (
                                            <>
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={'red'}>
                                                    <Text fontSize={'14px'} color={'white'}>Rejected</Text>
                                                </Button>
                                            </>
                                        )}
                                        {bookingState.bookingStatus === 'APPROVED' && !bookingState?.hasPaid && (
                                            <Flex w={"full"} gap={"4"} flexDirection={"column"} >
                                                <Flex gap={"3"} w={"full"} justifyContent={"center"} >
                                                    <Button _hover={{ backgroundColor: primaryColor }} isDisabled={(bookingState?.price === Number(price)) ? true : false} onClick={() => userUpdatePrice.mutate()} isLoading={userUpdatePrice.isLoading} w='200px' minHeight={'45px'} h='50px' borderRadius='full' borderWidth={'1px'} color={'white'} bg={primaryColor}>
                                                        <Text fontSize={'14px'} color={'white'}>Update Price</Text>
                                                    </Button>
                                                    <Button isLoading={payForTicket?.isLoading} isDisabled={payForTicket?.isLoading} onClick={() => handlePayment()} w='200px' minHeight={'45px'} h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor} >
                                                        <Text fontSize={'14px'} color={'white'}>Make Payment</Text>
                                                    </Button>

                                                </Flex>

                                                <Button onClick={() => cancelBooking.mutate()} isLoading={cancelBooking.isLoading} w='100%' h='50px' borderRadius='full' borderWidth={'0px'} bg={"transparent"}>
                                                    <Text fontSize={'14px'} color={'red'}>Cancel Booking</Text>
                                                </Button>
                                            </Flex>
                                        )}
                                        {bookingState.bookingStatus === 'IN_PROGRESS' && (
                                            <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} minHeight={'45px'} bg={primaryColor}>
                                                <Text fontSize={'14px'} color={'white'}>{bookingState?.bookingStatus?.replaceAll('_', ' ')}</Text>
                                            </Button>
                                        )}
                                        {bookingState.bookingStatus === 'AWAITING_CONFIRMATION' && bookingState.isCompleted && (
                                            // <> /
                                            <Button isLoading={userMarkAsDone.isLoading} onClick={() => userMarkAsDone.mutate(false)} w='full' h='50px' minHeight={'45px'} borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                <Text fontSize={'14px'} color={'white'}>Approve</Text>
                                            </Button>
                                        )}

                                        {
                                            bookingState.bookingStatus === "COMPLETED" && (
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w={'50%'} h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                    <Text fontSize={'14px'} color={'white'}>Completed</Text>
                                                </Button>
                                            )
                                        }
                                        {
                                            bookingState.bookingStatus === "COMPLETED_WITH_ISSUES" && (
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                    <Text fontSize={'14px'} color={'white'}>Raise Complain</Text>
                                                </Button>
                                            )
                                        }
                                        {
                                            bookingState.bookingStatus === "CANCELLED" && (
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={'red'}>
                                                    <Text fontSize={'14px'} color={'white'}>CANCELLED</Text>
                                                </Button>
                                            )
                                        }
                                    </>
                                )}

                                {isVendor && (
                                    <>
                                        {bookingState.bookingStatus === 'PENDING' && (
                                            <VStack width='100%'>
                                                <HStack width='100%' spacing={10}>
                                                    {/* <Button _hover={{ backgroundColor: primaryColor }} isDisabled={(bookingState?.price === Number(price)) ? true : false} onClick={() => vendorUpdatePrice.mutate()} isLoading={vendorUpdatePrice.isLoading} w='full' h='50px' borderRadius='full' borderWidth={'1px'} color={'white'} bg={primaryColor}>
                                                        <Text fontSize={'14px'} color={'white'}>Update Price</Text>
                                                    </Button> */}

                                                    <Button isLoading={vendorAcceptOrDecline.isLoading || loadingReject} onClick={() => { clickHandle(false), setOpen(false) }} w='full' h='50px' borderRadius='full' borderWidth={'1px'} borderColor={'red'} bg={mainBackgroundColor} _hover={{ backgroundColor: mainBackgroundColor }} >
                                                        <Text fontSize={'14px'} color={'red'}>Decline</Text>
                                                    </Button>
                                                    <Button isLoading={vendorAcceptOrDecline.isLoading || loading} onClick={() => { clickHandle(true), setOpen(false) }} w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={"#F7FBFE"} _hover={{ backgroundColor: "#F7FBFE" }}>
                                                        <Text fontSize={'14px'} color={primaryColor}>Accept Request</Text>
                                                    </Button>
                                                </HStack>

                                            </VStack>
                                        )}
                                        {bookingState.bookingStatus === 'IN_PROGRESS' && bookingState.hasPaid && (
                                            <Button isLoading={vendorMarkAsDone.isLoading} onClick={() => { vendorMarkAsDone.mutate(), setOpen(false) }} w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                <Text fontSize={'14px'} color={'white'}>Mark As Done</Text>
                                            </Button>
                                        )}
                                        {bookingState.bookingStatus === 'APPROVED' && !bookingState?.hasPaid && (
                                            <Flex w={"full"} gap={"4"} >
                                                {/* <Button _hover={{ backgroundColor: primaryColor }} isDisabled={(bookingState?.price === Number(price)) ? true : false} onClick={() => userUpdatePrice.mutate()} isLoading={userUpdatePrice.isLoading} w='full' minHeight={'45px'} h='50px' borderRadius='full' borderWidth={'1px'} color={'white'} bg={primaryColor}>
                                                    <Text fontSize={'14px'} color={'white'}>Update Price</Text>
                                                </Button> */}
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                    <Text fontSize={'14px'} color={'white'}>Awaiting Payment</Text>
                                                </Button>
                                            </Flex>
                                        )}
                                        {bookingState.bookingStatus === 'AWAITING_CONFIRMATION' && bookingState.isCompleted && (
                                            <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                <Text fontSize={'14px'} color={'white'}>Awaiting User Confirmation</Text>
                                            </Button>
                                        )}
                                        {
                                            bookingState.bookingStatus === "COMPLETED" && (
                                                <Button cursor={'not-allowed'} ml={"auto"} disabled w='250px' h='50px' borderRadius='full' borderWidth={'1px'} bgColor={"white"} color={primaryColor} borderColor={primaryColor}>
                                                    <Text fontSize={'14px'} >Completed</Text>
                                                </Button>
                                            )
                                        }
                                        {
                                            bookingState.bookingStatus === "COMPLETED_WITH_ISSUES" && (
                                                <Button disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={primaryColor}>
                                                    <Text fontSize={'14px'} color={'white'}>Raise Complain</Text>
                                                </Button>
                                            )
                                        }
                                        {
                                            bookingState.bookingStatus === "CANCELLED" && (
                                                <Button cursor={'not-allowed'} opacity={0.4} disabled w='full' h='50px' borderRadius='full' borderWidth={'1px'} bg={'red'}>
                                                    <Text fontSize={'14px'} color={'white'}>CANCELLED</Text>
                                                </Button>
                                            )
                                        }
                                    </>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </ModalLayout>
            <ModalLayout open={show} size={"xs"} close={setShow} >
                <> <Flex flexDir={"column"} alignItems={"center"} py={"8"} px={"14"} >
                    <SuccessIcon />
                    <Text fontSize={["18px", "20px", "24px"]} color={headerTextColor} lineHeight={"44.8px"} fontWeight={"600"} mt={"2"} mb={"4"} >{"Thank you"}</Text>
                    {/* <Text fontSize={"12px"} color={bodyTextColor} maxWidth={"351px"} textAlign={"center"} mb={"4"} >{`You can rate this product.`}</Text> */}

                    <CustomButton onClick={() => router.push(`/dashboard/kisok/service/${bookingState?.service?.id}?type=true`)} color={"#FFF"} text={'Leave a review'} w={"full"} borderRadius={"99px"} />
                </Flex>
                </>
            </ModalLayout>
        </Flex>
    )
}

export default BookingCard
