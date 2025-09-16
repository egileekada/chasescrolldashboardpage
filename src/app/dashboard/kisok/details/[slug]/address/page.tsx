"use client"
import CustomButton from '@/components/general/Button'
import ProductMap from '@/components/kisok/productMap'
import KisokTermAndCondition from '@/components/kisok/ProductTermAndCondition'
import Fundpaystack from '@/components/settings_component/payment_component/card_tabs/fund_wallet/fundpaystack'
import LoadingAnimation from '@/components/sharedComponent/loading_animation'
import ModalLayout from '@/components/sharedComponent/modal_layout'
import { Delete2Icon, DeleteAccountIcon, Edit2Icon } from '@/components/svg'
import useProductStore from '@/global-state/useCreateProduct'
import useGetUser from '@/hooks/useGetUser'
import useProduct from '@/hooks/useProduct'
import useCustomTheme from '@/hooks/useTheme'
import { IProduct } from '@/models/product'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import httpService from '@/utils/httpService'
import { formatNumber } from '@/utils/numberFormat'
import { Checkbox, Flex, Input, Select, Text, Textarea, useToast } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, use } from 'react';
import { FaCheckCircle, FaEdit } from 'react-icons/fa'
import { ImCheckboxChecked } from 'react-icons/im'
import { IoIosAdd } from 'react-icons/io'
import { IoTrashBin } from 'react-icons/io5'
import { useQuery } from 'react-query'

interface IProps {
    "id": string,
    "createdDate": number,
    "lastModifiedBy": any,
    "createdBy": any,
    "lastModifiedDate": number,
    "isDeleted": boolean,
    "status": any,
    "statusCode": number,
    "returnMessage": string,
    "state": string,
    location: {
        "link": any,
        "address": string,
        "country": any,
        "street": any,
        "city": any,
        "zipcode": any,
        "state": any,
        "locationDetails": string,
        "latlng": string,
        "placeIds": any,
        "toBeAnnounced": any,
    },
    phone: string
    "isDefault": boolean
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function ShippingAddress(props: Props) {
    const params = use(props.params);

    const id = params.slug
    const { primaryColor, secondaryBackgroundColor, mainBackgroundColor, borderColor } = useCustomTheme();
    const query = useSearchParams();
    const type = query?.get('qty');
    const color = query?.get('color');
    const size = query?.get('size');
    const { back } = useRouter()

    const { dataID, message, createAddress, setOpen, open, payload, setPayload, userId, editAddress, setAddressId, addressId, openDelete, setOpenDelete, deleteAddress, addressDefault, setAddressDefault, createProductOrder, configPaystack, setPaystackConfig, updateAddress, singleProductData: item, setSingleProductData } = useProduct()
    const toast = useToast()
    const [address, setAddress] = useState<Array<IProps>>([])

    const { location, updateAddress: setNewAddress } = useProductStore((state) => state);

    const { user } = useGetUser()

    const { isLoading: loading } = useQuery(
        ["products", id],
        () => httpService.get(`/products/search`, {
            params: {
                id: id
            }
        }), {
        onSuccess(data) {
            setSingleProductData(data?.data?.content[0])
        }
    });

    useEffect(() => {
        setNewAddress({} as any)
    }, [open])

    const { isLoading } = useQuery(
        ["addressuser", userId],
        () => httpService.get(`/addresses/user/${userId}`), {
        onSuccess(data) {
            setAddress(data?.data)
            if (data?.data?.length === 0) {
                setAddressDefault("")
            } else {
                data?.data?.map((item: IProps) => {
                    if (item?.isDefault) {
                        setAddressDefault(item?.id)
                    }
                })
            }
        },
    }
    );

    const clickHandler = () => {
        console.log(location);

        if (payload?.phone?.length !== 11) {
            toast({
                title: "Enter A Valid Phone Number",
                description: "",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
            return
        } else if (!location?.locationDetails || !location?.latlng) {
            toast({
                title: "Please Select a location in your map",
                description: "",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top-right",
            });
        } else {
            if (addressId) {
                editAddress?.mutate({ ...payload, state: location?.state, location: location })
            } else {
                createAddress?.mutate({ ...payload, state: location?.state, location: location })
            }
        }
    }

    const editHandler = (item: any) => {
        console.log(item);

        setAddressId(item?.id)
        setPayload({
            ...payload,
            lga: item?.lga,
            phone: item?.phone
        })
        setOpen(true)
    }

    const createHandler = () => {
        setAddressId("")
        setOpen(true)
    }

    const deleteHandler = (item: any) => {
        setAddressId(item?.id)
        setOpenDelete(true)
    }

    const changeStatus = (item: IProps) => {
        setAddressId(item?.id)
        updateAddress?.mutate(
            {
                id: item?.id, payload: {
                    state: location?.state,
                    phone: item?.phone,
                    isDefault: true,
                    userId: userId,
                    location: location
                }
            }
        )
    }

    const statesInNigeria = [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara"
    ];

    return (
        <Flex w={"full"} px={"6"} pt={["6", "6", "6", "6"]} pb={"12"} flexDir={"column"} gap={"6"} overflowY={"auto"} overflowX={"hidden"} >
            <Flex gap={"1"} alignItems={"center"} >
                <Text role='button' onClick={() => back()} fontSize={"14px"} color={primaryColor} fontWeight={"500"} >Back</Text>
            </Flex>
            <Flex alignItems={"center"} gap={"1"} >
                <FaCheckCircle size={"15px"} color='#34C759' />
                <Text fontSize={"14px"} fontWeight={"600"} >Customer Address </Text>
            </Flex>
            <Flex w={"full"} gap={"6"} flexDir={["column", "column", "row"]} >
                <Flex flexDir={"column"} w={"full"} gap={"6"} >
                    <LoadingAnimation loading={isLoading} >
                        {address?.map((item, index) => {
                            return (
                                <Flex key={index} w={"full"} pos={"relative"} p={"6"} gap={"4"} bgColor={mainBackgroundColor} rounded={"8px"} flexDir={"column"} >
                                    <Flex w={"full"} justifyContent={"space-between"} >
                                        <Text fontSize={"12px"} fontWeight={"500"} >Address</Text>
                                        <Flex gap={"4"} position={"absolute"} right={"6"} top={"6"} flexDirection={'column'} >
                                            <Flex w={"45px"} h={"45px"} bgColor={secondaryBackgroundColor} justifyContent={"center"} alignItems={"center"} rounded={"full"} as={"button"} onClick={() => editHandler(item)} >
                                                <Edit2Icon />
                                            </Flex>
                                            <Flex w={"45px"} h={"45px"} bgColor={secondaryBackgroundColor} justifyContent={"center"} alignItems={"center"} rounded={"full"} as={"button"} onClick={() => deleteHandler(item)} >
                                                <Delete2Icon />
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    <Flex w={"full"} alignItems={"start"} gap={"4"} >
                                        <Flex onClick={() => changeStatus(item)} >
                                            <Checkbox isChecked={addressDefault === item?.id ? true : false} />
                                        </Flex>
                                        <Flex flexDir={"column"} gap={"1"} >
                                            <Text>{item?.state}</Text>
                                            <Text>{item?.location?.locationDetails}</Text>
                                            {addressDefault === item?.id && (
                                                <Flex fontSize={"8px"} fontWeight={"500"} px={"2"} py={"1"} bgColor={"#34C759"} rounded={"32px"} color={"white"} width={"fit-content"} >
                                                    DEFAULT ADDRESS
                                                </Flex>
                                            )}
                                            <Text fontWeight={"500"} fontSize={"12px"} mt={"3"} >Phone Number</Text>
                                            <Text fontSize={"14px"} >{item?.phone}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )
                        })}
                    </LoadingAnimation>
                    <Flex onClick={createHandler} as={"button"} bgColor={mainBackgroundColor} w={"full"} p={"6"} gap={"4"} h={"fit-content"} alignItems={"center"} rounded={"8px"} flexDir={"column"} >
                        <Flex gap={"2"} w={"full"} >
                            <IoIosAdd size={"20px"} color={primaryColor} />
                            <Text fontSize={"14px"} fontWeight={"500"} color={primaryColor} >Add Address</Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex w={["full", "full", "fit-content"]} h={"fit-content"} >
                    <Flex w={["full", "full", "292px"]} rounded={"8px"} flexDir={"column"} gap={"4"} p={"6"} bgColor={mainBackgroundColor} >
                        <Text fontWeight={"700"} >Order Summary</Text>
                        <Flex w={"full"} justifyContent={"space-between"} >
                            <Text fontSize={"14px"} fontWeight={"500"} >Item total</Text>
                            <Text fontWeight={"500"} >{type}</Text>
                        </Flex>
                        <Flex w={"full"} justifyContent={"space-between"} >
                            <Text fontSize={"14px"} fontWeight={"500"} >Item price</Text>
                            <Text fontWeight={"500"} >{formatNumber(item?.price)}</Text>
                        </Flex>
                        <Flex w={"full"} justifyContent={"space-between"} >
                            <Text fontSize={"14px"} fontWeight={"500"} >Total</Text>
                            <Text fontWeight={"500"} >{formatNumber(item?.price * Number(type))}</Text>
                        </Flex>
                        <Flex mt={"4"} flexDir={"column"} alignItems={"center"} gap={"2"} >
                            <CustomButton isLoading={createProductOrder?.isLoading} disable={addressDefault ? false : true} onClick={() => createProductOrder?.mutate({ productId: item?.id, quantity: Number(type), total: Number(item?.price * Number(type)), userId: userId + "", vendorId: item?.creator?.userId, addressId: addressDefault + "", size: size+"", color: color+"" })} text={"Confirm order"} borderRadius={"999px"} />
                            <KisokTermAndCondition />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <ModalLayout open={open} close={setOpen} title={"Add a new Address"} >
                <Flex w={"full"} gap={"4"} flexDir={"column"} p={"4"} >
                    <Flex flexDir={"column"} w={"full"} gap={"1"} >
                        <Text>Map Location</Text>
                        <ProductMap height='45px' location={location} />
                    </Flex>
                    <Flex flexDir={"column"} w={"full"} gap={"1"} >
                        <Text>Phone Number</Text>
                        <Input value={payload?.phone} type='number' placeholder='Enter Phone Number' onChange={(e) => setPayload({ ...payload, phone: e.target.value })} />
                    </Flex>
                    <Flex flexDir={"column"} w={"full"} gap={"1"} >
                        <Text>Address Detail</Text>
                        <Textarea value={location?.address} placeholder='Select Land Mark' onChange={(e) => setNewAddress({ ...location, address: e.target.value })} />
                    </Flex>
                    <CustomButton isLoading={createAddress?.isLoading || editAddress?.isLoading} onClick={clickHandler} text={"Submit"} borderRadius={"999px"} />
                </Flex>
            </ModalLayout>

            <ModalLayout open={openDelete} rounded='2xl' close={setOpenDelete} size={"xs"} >
                <Flex w={"full"} gap={"4"} flexDir={"column"} alignItems={"center"} p={"4"} >
                    <Flex pt={"5"} >
                        <Delete2Icon size='60px' />
                    </Flex>
                    <Text textAlign={"center"} >Are you sure you want to delete this Address?</Text>
                    <Flex gap={"3"} w={"full"} >
                        <CustomButton onClick={() => setOpenDelete(false)} text={"Cancel"} color={primaryColor} borderWidth={"1px"} borderColor={primaryColor} backgroundColor={"white"} fontSize={"sm"} height={"45px"} borderRadius={"999px"} />
                        <CustomButton isLoading={deleteAddress?.isLoading} onClick={() => deleteAddress?.mutate()} text={"Submit"} borderWidth={"1px"} borderColor={"red"} backgroundColor={"red"} fontSize={"sm"} height={"45px"} borderRadius={"999px"} />
                    </Flex>
                </Flex>
            </ModalLayout>
            <Fundpaystack id={dataID} config={configPaystack} setConfig={setPaystackConfig} message={message} />
        </Flex>
    )
}
