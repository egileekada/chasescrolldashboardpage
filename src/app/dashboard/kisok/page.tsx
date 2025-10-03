"use client"
import CustomButton from '@/components/general/Button'
import GetMySale from '@/components/kisok/getMySale'
import GetOrder from '@/components/kisok/getOrder'
import GetProduce from '@/components/kisok/getProduce'
import GetReciept from '@/components/kisok/getReciept'
import GetRental from '@/components/kisok/getRental'
import GetVendorReciept from '@/components/kisok/getVendorReciept'
import ModalLayout from '@/components/sharedComponent/modal_layout'
import { GlassIcon, LocationPin, LocationStroke, RentalIcon, ServiceIcon, StoreIcon } from '@/components/svg'
import useProductStore from '@/global-state/useCreateProduct'
import useCustomTheme from '@/hooks/useTheme'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import httpService from '@/utils/httpService'
import BookingsRequest from '@/Views/dashboard/booking/BookingRequest'
import Bookings from '@/Views/dashboard/booking/Bookings'
import Businesses from '@/Views/dashboard/booking/Businesses'
import MyBusiness from '@/Views/dashboard/booking/MyBusiness'
import { Box, Button, Flex, Grid, Input, Select, Text, useColorMode } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export default function KisokPage() {

    const { primaryColor, borderColor, bodyTextColor, secondaryBackgroundColor, headerTextColor, mainBackgroundColor } = useCustomTheme()

    const [tab, setTab] = useState<"kiosk" | "service" | "rental">("kiosk")
    const { colorMode, toggleColorMode } = useColorMode();
    const query = useSearchParams();
    const type = query?.get('type');

    const [initialFilter, setInitialFilter] = useState({
        state: "",
        category: "",
        name: ""
    })

    const [selectedFilter, setSelectedFilter] = useState({
        state: "",
        category: "",
        name: ""
    })

    const [open, setOpen] = useState(false)
    const { updateProduct, updateImage, updateRental } = useProductStore((state) => state);

    const { push } = useRouter()

    const { data, isLoading } = useQuery(
        ["getcategoryProduct"],
        () => httpService.get(`/products/categories`), {
    }
    );

    const { data: datarental, isLoading: loadingRental } = useQuery(
        ["getcategoryRental"],
        () => httpService.get(`/rental/categories`), {
    }
    );


    const { isLoading: loadingServices, data: serviceCategories } = useQuery(['get-business-categories'], () => httpService.get('/business-service/categories'), {
        refetchOnMount: true,
        onError: (error: any) => { },
    });

    const userId = localStorage.getItem('user_id') + "";

    const clickHandler = (item: "kiosk" | "service" | "rental") => {
        setTab(item)
        push(`/dashboard/kisok${item !== "kiosk" ? `?type=${item}` : ""}`)
    }

    const routeHandler = (item: string) => {
        push(`/dashboard/kisok${item ? `?type=${item}` : ""}`)
    }

    let stateList = [
        "abia",
        "adamawa",
        "akwa ibom",
        "anambra",
        "bauchi",
        "bayelsa",
        "benue",
        "borno",
        "cross river",
        "delta",
        "ebonyi",
        "edo",
        "ekiti",
        "enugu",
        "gombe",
        "imo",
        "jigawa",
        "kaduna",
        "kano",
        "katsina",
        "kebbi",
        "kogi",
        "kwara",
        "lagos",
        "nasarawa",
        "niger",
        "ogun",
        "ondo",
        "osun",
        "oyo",
        "plateau",
        "rivers",
        "sokoto",
        "taraba",
        "yobe",
        "zamfara",
        "federal capital territory"
    ];


    const createProduct = () => {
        updateProduct({
            creatorID: userId,
            name: "",
            description: "",
            images: [],
            price: null,
            category: "",
            quantity: null,
            hasDiscount: false,
            discountPrice: null,
            publish: true,
            location: "" as any,
            state: "",
            color: [],
            size: []
        })
        updateRental({
            "userId": userId,
            "name": "",
            "description": "",
            "category": "",
            "location": {} as any,
            "maximiumNumberOfDays": 1,
            "price": null,
            "images": [],
            frequency: "DAILY",
        } as any)
        updateImage([] as any)
        push((type === null || type === "mykisok" || type === "myorder") ? "/dashboard/kisok/create" : (type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "/dashboard/kisok/create-rental" : (type === "service" || type === "myservice" || type === "mybooking") ? "/dashboard/kisok/create-service" : "/dashboard/kisok/create")
    }

    const submitHandler = () => {
        setSelectedFilter({
            name: initialFilter?.name,
            category: initialFilter?.category,
            state: initialFilter?.state
        })
    }

    useEffect(() => {
        setSelectedFilter({
            category: "",
            name: "",
            state: ""
        })
        setInitialFilter({
            category: "",
            name: "",
            state: ""
        })
    }, [type])

    return (
        <Flex w={"full"} px={["4", "4", "6"]} pt={["6", "6", "12", "12"]} pb={"12"} flexDir={"column"} overflowY={"auto"} >
            <Flex w={"full"} alignItems={"center"} flexDirection={"column"} gap={"3"} >
                <Flex fontSize={["20px", "20px", "56px"]} alignItems={"end"} display={["flex", "flex", "none"]} fontWeight={"700"} >what are you l<Flex mb={"1"} ><GlassIcon size='17' /></Flex>king for?</Flex>
                <Flex fontSize={["16px", "16px", "56px"]} alignItems={"end"} display={["none", "none", "flex"]} fontWeight={"700"} >what are you l<Flex mb={"3"} ><GlassIcon size='45' /></Flex>king for?</Flex>
                <Flex w={"fit-content"} gap={"1"} alignItems={"center"} bgColor={secondaryBackgroundColor} p={"6px"} rounded={"full"} >
                    <CustomButton onClick={() => clickHandler("service")} text={
                        <Flex alignItems={"center"} gap={"2"} >
                            <ServiceIcon color={(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") ? "white" : headerTextColor} />
                            <Text>Service</Text>
                        </Flex>
                    } height={["38px", "38px", "48px"]} fontSize={"sm"} backgroundColor={(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") ? primaryColor : secondaryBackgroundColor} border={"0px"} borderColor={(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") ? "transparent" : borderColor} borderRadius={"32px"} fontWeight={"600"} color={(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") ? "white" : headerTextColor} width={["107px", "107px", "175px"]} />
                    <CustomButton onClick={() => clickHandler("rental")} text={
                        <Flex alignItems={"center"} gap={"2"} >
                            <RentalIcon color={(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "white" : headerTextColor} />
                            <Text>Rental</Text>
                        </Flex>
                    } height={["38px", "38px", "48px"]} fontSize={"sm"} backgroundColor={(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? primaryColor : secondaryBackgroundColor} border={"0px"} borderColor={(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "transparent" : borderColor} borderRadius={"32px"} fontWeight={"600"} color={(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "white" : headerTextColor} width={["107px", "107px", "175px"]} />
                    <CustomButton onClick={() => clickHandler("kiosk")} text={
                        <Flex alignItems={"center"} gap={"2"} >
                            <StoreIcon color={(type === null || type === "mykisok" || type === "myorder") ? "white" : headerTextColor} />
                            <Text>Kiosk</Text>
                        </Flex>
                    } height={["38px", "38px", "48px"]} fontSize={"sm"} backgroundColor={(type === null || type === "mykisok" || type === "myorder") ? primaryColor : secondaryBackgroundColor} border={"0px"} borderColor={(type === null || type === "mykisok" || type === "myorder") ? "transparent" : borderColor} borderRadius={"32px"} fontWeight={"600"} color={(type === null || type === "mykisok" || type === "myorder") ? "white" : headerTextColor} width={["107px", "107px", "175px"]} />
                </Flex>
                <Flex display={["flex", "flex", "none"]} w={"full"} gap={"3"} alignItems={"center"} >
                    <CustomButton onClick={() => setOpen(true)} text={`Filter ${(type === null || type === "mykisok" || type === "myorder") ? "Product" : (type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") ? "Service" : "Rental"} `} color={headerTextColor} fontSize={"14px"} backgroundColor={"White"} borderWidth={"1px"} borderRadius={"999px"} />
                </Flex>
                <Flex display={["none", "none", "flex"]} w={"fit-content"} borderWidth={"1px"} borderColor={borderColor} rounded={"full"} h={"fit-content"} style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }} >
                    <Select h={"80px"} bgColor={mainBackgroundColor} value={initialFilter?.category} onChange={(e) => setInitialFilter({ ...initialFilter, category: e.target?.value })} w={"200px"} outlineColor={"transparent"} outline={"none"} textAlign={"center"} placeholder='Select Category' roundedLeft={"full"} borderWidth={"0px"} borderRightWidth={"1px"} borderRightColor={borderColor} >
                        {(type === null || type === "mykisok" || type === "myorder") && (
                            <>
                                {data?.data?.sort((a: string, b: string) => {
                                    if (a > b) {
                                        return 1
                                    } else {
                                        return -1;
                                    }
                                    return 0;
                                })?.map((item: string, index: number) => (
                                    <option key={index} >{item?.replaceAll("_", " ")}</option>
                                ))}
                            </>
                        )}
                        {(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") && (
                            <>
                                {datarental?.data?.sort((a: string, b: string) => {
                                    if (a > b) {
                                        return 1
                                    } else {
                                        return -1;
                                    }
                                    return 0;
                                })?.map((item: string, index: number) => (
                                    <option key={index} >{item?.replaceAll("_", " ")}</option>
                                ))}
                            </>
                        )}
                        {(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") && (
                            <>
                                {serviceCategories?.data?.sort((a: string, b: string) => {
                                    if (a > b) {
                                        return 1
                                    } else {
                                        return -1;
                                    }
                                    return 0;
                                })?.map((item: string, index: number) => (
                                    <option key={index} >{item?.replaceAll("_", " ")}</option>
                                ))}
                            </>
                        )}
                    </Select>
                    <Select h={"80px"} bgColor={mainBackgroundColor} value={initialFilter?.state} onChange={(e) => setInitialFilter({ ...initialFilter, state: e.target?.value })} w={"200px"} rounded={"0px"} textAlign={"center"} placeholder='Select State' borderRightWidth={"1px"} borderWidth={"0px"} borderRightColor={borderColor} >
                        {stateList?.map((item) => {
                            return (
                                <option value={item} key={item} >{capitalizeFLetter(item)}</option>
                            )
                        })}
                    </Select>
                    <Input bgColor={mainBackgroundColor} placeholder={"Search business name"} onChange={(e) => setInitialFilter({ ...initialFilter, name: e.target?.value })} h={"80px"} w={"200px"} outline={"none"} rounded={"0px"} borderWidth={"0px"} borderLeftWidth={"1px"} borderRightColor={borderColor} />
                    <Button onClick={submitHandler} h={"80px"} w={"140px"} color={"white"} outline={"none"} bgColor={primaryColor} roundedRight={"full"} borderRightWidth={"1px"} borderWidth={"0px"} borderRightColor={borderColor} >
                        Search
                    </Button>
                </Flex>
            </Flex>
            <Flex w={"full"} justifyContent={"center"} >
                <Flex py={"6"} maxWidth={"745px"} w={"full"} justifyContent={"start"} alignItems={"center"} gap={"4"} >
                    {(type === null || type === "mykisok" || type === "myorder" || type === "mySales") && (
                        <Select
                            color={colorMode === "light" ? "#5465E0" : bodyTextColor} backgroundColor={colorMode === "light" ? "#F2F4FF" : secondaryBackgroundColor}
                            focusBorderColor={"#5465E0"}
                            height={"41px"}
                            fontSize={"sm"}
                            value={type ? type : ""}
                            rounded={"50px"}
                            onChange={(e) => routeHandler(e.target.value)}
                            width={["auto", "auto", "auto"]}
                            textAlign={"center"} >
                            {[{ name: "All", value: "" }, { name: "My Kiosk", value: "mykisok" }, { name: "My Orders", value: "myorder" }, { name: "My Sales", value: "mySales" }]?.map((type: any, index: number) => (
                                <option style={{ fontSize: "14px" }} key={index} value={type?.value}>
                                    {type?.name}
                                </option>
                            ))}
                        </Select>
                    )}
                    {(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") && (
                        <Select
                            color={colorMode === "light" ? "#5465E0" : bodyTextColor} backgroundColor={colorMode === "light" ? "#F2F4FF" : secondaryBackgroundColor}
                            focusBorderColor={"#5465E0"}
                            height={"41px"}
                            fontSize={"sm"}
                            value={type}
                            rounded={"50px"}
                            onChange={(e) => routeHandler(e.target.value)}
                            width={["auto", "auto", "auto"]}
                            textAlign={"center"} >
                            {[{ name: "All Services", value: "service" }, { name: "My Services", value: "myservice" }, { name: "My Booking", value: "mybooking" }, { name: "My Request", value: "myrequest" }]?.map((type: any, index: number) => (
                                <option style={{ fontSize: "14px" }} key={index} value={type?.value}>
                                    {type?.name}
                                </option>
                            ))}
                        </Select>
                    )}
                    {(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") && (
                        <Select
                            color={colorMode === "light" ? "#5465E0" : bodyTextColor} backgroundColor={colorMode === "light" ? "#F2F4FF" : secondaryBackgroundColor}
                            focusBorderColor={"#5465E0"}
                            height={"41px"}
                            fontSize={"sm"}
                            value={type}
                            rounded={"50px"}
                            onChange={(e) => routeHandler(e.target.value)}
                            width={["auto", "auto", "auto"]}
                            textAlign={"center"} >
                            {[{ name: "All Rental", value: "rental" }, { name: "My Rental", value: "myrental" }, { name: "My Reciept", value: "myreciept" }, { name: "My Request", value: "vendorreciept" }]?.map((type: any, index: number) => (
                                <option style={{ fontSize: "14px" }} key={index} value={type?.value}>
                                    {type?.name}
                                </option>
                            ))}
                        </Select>
                    )}
                    {/* {type === "mykisok" && (
                    <CustomButton onClick={() => push("/dashboard/kisok/dashboard")} text={"Dashboard"} px={"30px"} height={"48px"} fontSize={"sm"} backgroundColor={"white"} border={"1px"} borderColor={primaryColor} borderRadius={"32px"} fontWeight={"600"} color={primaryColor} width={"fit-content"} />
                )} */}

                    <Flex display={["flex", "flex", "flex"]} >
                        <CustomButton onClick={createProduct} text={
                            <Flex alignItems={"center"} gap={"2"} >
                                <Text>Create {(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "Rental" : (type === "service" || type === "myservice" || type === "mybooking") ? "Service" : "Item"}</Text>
                            </Flex>
                        } px={"15px"} height={"40px"} fontSize={"sm"} borderRadius={"32px"} fontWeight={"600"} width={"fit-content"} />
                    </Flex>
                </Flex>
            </Flex>
            {!type && (
                <GetProduce name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "mykisok" && (
                <GetProduce name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} myproduct={true} />
            )}
            {type === "rental" && (
                <GetRental name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myrental" && (
                <GetRental name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} myrental={true} />
            )}
            {type === "myorder" && (
                <GetOrder />
            )}
            {type === "mySales" && (
                <GetMySale />
            )}
            {type === "myreciept" && (
                <GetReciept />
            )}
            {type === "vendorreciept" && (
                <GetVendorReciept />
            )}
            {type === "service" && (
                <Businesses name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myservice" && (
                <MyBusiness name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "mybooking" && (
                <Bookings name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myrequest" && (
                <BookingsRequest />
            )}
            <ModalLayout open={open} close={setOpen} rounded='16px' closeIcon={true} >
                <Flex w={"full"} flexDir={"column"} gap={"3"} p={6} >
                    <Input h={"48px"} placeholder={`Search by ${(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") ? "Business" : (type === "service" || type === "myservice" || type === "mybooking") ? "Business" : "Product"} Name`} rounded={"full"} />
                    <Flex w={"full"} gap={"3"} >
                        <Select h={"48px"} value={initialFilter?.category} onChange={(e) => setInitialFilter({ ...initialFilter, category: e.target?.value })} rounded={"full"} placeholder='Select Category' w={"full"} >
                            {(type === null || type === "mykisok" || type === "myorder") && (
                                <>
                                    {data?.data?.sort((a: string, b: string) => {
                                        if (a > b) {
                                            return 1
                                        } else {
                                            return -1;
                                        }
                                        return 0;
                                    })?.map((item: string, index: number) => (
                                        <option key={index} >{item?.replaceAll("_", "")}</option>
                                    ))}
                                </>
                            )}
                            {(type === "rental" || type === "myrental" || type === "myreciept" || type === "vendorreciept") && (
                                <>
                                    {datarental?.data?.sort((a: string, b: string) => {
                                        if (a > b) {
                                            return 1
                                        } else {
                                            return -1;
                                        }
                                        return 0;
                                    })?.map((item: string, index: number) => (
                                        <option key={index} >{item?.replaceAll("_", "")}</option>
                                    ))}
                                </>
                            )}
                            {(type === "service" || type === "myservice" || type === "mybooking" || type === "myrequest") && (
                                <>
                                    {serviceCategories?.data?.sort((a: string, b: string) => {
                                        if (a > b) {
                                            return 1
                                        } else {
                                            return -1;
                                        }
                                        return 0;
                                    })?.map((item: string, index: number) => (
                                        <option key={index} >{item?.replaceAll("_", "")}</option>
                                    ))}
                                </>
                            )}
                        </Select>
                        <Select h={"48px"} value={initialFilter?.state} onChange={(e) => setInitialFilter({ ...initialFilter, state: e.target?.value })} rounded={"full"} placeholder='Select State' w={"full"} >
                            {stateList?.map((item) => {
                                return (
                                    <option value={item} key={item} >{capitalizeFLetter(item)}</option>
                                )
                            })}
                        </Select>
                    </Flex>
                    <CustomButton text={"Search"} borderRadius={"999px"} height={"58px"} />
                </Flex>
            </ModalLayout>
        </Flex>
    )
}