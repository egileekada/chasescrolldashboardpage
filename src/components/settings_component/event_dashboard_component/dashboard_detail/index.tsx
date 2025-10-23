'use client'
import { formatNumberWithK, numberFormat, numberFormatDollar, numberFormatNaire } from '@/utils/formatNumberWithK'
import httpService from '@/utils/httpService'
import { Box, Flex, HStack, Image, Select, Text, useColorMode, useToast } from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useQuery } from 'react-query'
import { VictoryArea, VictoryChart, VictoryPie, VictoryTheme } from "victory";

import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import useCustomTheme from "@/hooks/useTheme";
import CustomButton from '@/components/general/Button'
import { URLS } from '@/services/urls'
import { IEventType, IProductTypeData } from '@/models/Event'
import { ITicket } from '@/models/Ticket'
import { PaginatedResponse } from '@/models/PaginatedResponse'
import { IHistoryData, IHistoryDataTicket } from '@/models/HistoryData'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { useDetails } from '@/global-state/useUserDetails'
// import { AreaChart, Area } from 'recharts';

interface Props {
    index: any
} 

function DashboardDetail(props: Props) {
    const {
        index
    } = props

    const {
        bodyTextColor,
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        borderColor,
    } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const toast = useToast()

    const [history, setHistory] = React.useState([] as any)
    const [historyData, setHistoryData] = React.useState<IHistoryData | null>(null)
    const [historyTickets, setHistoryTickets] = React.useState<IHistoryDataTicket[]>([])
    const [eventData, setEventData] = React.useState<IEventType>({} as IEventType);
    const [tickets, setTickets] = React.useState<IProductTypeData[]>([]);
    const [activeTicketName, setActiveTicketName] = React.useState('All');
    const router = useRouter()
 
    const { userId } = useDetails();

    React.useEffect(() => {
        if (activeTicketName === 'All') {
            setHistory(historyData)
        } else {
            const item: IHistoryDataTicket = historyTickets.filter((item) => item?.ticketType === activeTicketName)[0];
            setHistory(item);
        }
    }, [activeTicketName, historyData, historyTickets]);

    const { isLoading } = useQuery(['history' + index], () => httpService.get('/payments/analytics/tickets', {
        params: {
            typeID: index
        }
    }), {
        onError: (error: AxiosError<any, any>) => {
            console.error(error.response?.data);
        },
        onSuccess: (data) => {
            const item: IHistoryData = data?.data;
            setHistoryData(item);
            setHistoryTickets(item?.tickets);

            if (history?.length && history?.length < 1) {
                setHistory(item);
            }

        }
    })

    const { isLoading: loadingData, isRefetching: refechingDa } = useQuery(['all-events-details', index], () => httpService.get(URLS.All_EVENT + "?id=" + index), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        },
        onSuccess: (data: any) => {
            const item: PaginatedResponse<IEventType> = data.data;
            setEventData(data?.data?.content[0]);
            setTickets(item.content[0].productTypeData);
        }
    })


    const DataFormater = (number: number) => {
        if (number > 1000000000) {
            return (number / 1000000000).toString() + 'B';
        } else if (number > 1000000) {
            return (number / 1000000).toString() + 'M';
        } else if (number > 1000) {
            return (number / 1000).toString() + 'K';
        } else {
            return number.toString();
        }
    }

    const ref: any = React.useRef(null);

    const scroll = (scrolloffset: number) => {
        ref.current.scrollLeft += scrolloffset
    };

    return (
        <Flex width={"full"} flexDirection={"column"} overflowX={"hidden"} >

            <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} >
                <Flex onClick={() => router.push("/dashboard/settings/event-dashboard/" + index + "/refund")} as={"button"} width={"fit-content"} mt={"8"} gap={"2"} alignItems={"center"} bgColor={secondaryBackgroundColor} borderColor={borderColor} borderWidth={"1px"} _hover={{ background: "#5D70F9", color: "white" }} color={bodyTextColor} py={"2px"} px={"2"} fontSize={"13px"} fontWeight={"medium"} rounded={"md"} >
                    View Attendees
                </Flex>
                {/* <Flex onClick={() => router.push("/dashboard/settings/event-dashboard/" + index + "/donate")} as={"button"} width={"fit-content"} mt={"8"} gap={"2"} alignItems={"center"} bgColor={primaryColor} borderColor={borderColor} borderWidth={"1px"} _hover={{ background: "#5D70F9", color: "white" }} color={"white"} py={"2px"} px={"2"} fontSize={"13px"} fontWeight={"medium"} rounded={"md"} >
                    View Donation
                </Flex> */}
            </Flex>

            <Flex width={"full"} borderTopWidth={"1px"} borderBottomWidth={"1px"} borderColor={colorMode === 'light' ? "#D0D4EB" : borderColor} justifyContent={"center"} mt={"8"} py={"7"} >
                <Box position={"relative"} rounded={"36px"} maxW={["full", "full", "700px"]} px={["4", "4", "8"]} py={"6"} width={"full"} bgColor={colorMode === 'light' ? "#D0F2D9" : secondaryBackgroundColor} >
                    <HStack justifyContent={'space-between'} alignItems={'center'}>
                        <Flex alignItems={"center"} gap={"2"} w={"full"} justifyContent={"space-between"}>
                            <Flex width={"10"} height={"10"} bgColor={"#101828"} rounded={"full"} justifyContent={"center"} alignItems={"center"} >
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="vuesax/linear/ticket">
                                        <g id="ticket">
                                            <path id="Vector" d="M20 12.5C20 11.12 21.12 10 22.5 10V9C22.5 5 21.5 4 17.5 4H7.5C3.5 4 2.5 5 2.5 9V9.5C3.88 9.5 5 10.62 5 12C5 13.38 3.88 14.5 2.5 14.5V15C2.5 19 3.5 20 7.5 20H17.5C21.5 20 22.5 19 22.5 15C21.12 15 20 13.88 20 12.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path id="Vector_2" d="M10.5 4L10.5 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 5" />
                                        </g>
                                    </g>
                                </svg>
                            </Flex>
                            <Text fontSize={"15px"} fontWeight={"medium"} >Tickets</Text>
                        </Flex>

                        <Select onChange={(e) => setActiveTicketName(e.target.value)} value={activeTicketName} minWidth={'124px'} maxWidth={'160px'} height={'38px'} borderRadius={'32px'} borderWidth={'0.4px'} borderColor={'#878B93'}>
                            <option key={index.toString()} value={'All'} selected>All</option>
                            {tickets.map((ticket, index) => (
                                <option key={index.toString()} value={ticket.ticketType}>{ticket.ticketType}</option>
                            ))}
                        </Select>

                    </HStack>
                    <Flex ref={ref} pt={"7"} px={"4"} w={"full"} scrollBehavior={"smooth"} overflowX={"auto"} alignItems={"center"} sx={
                        {
                            '::-webkit-scrollbar': {
                                display: 'none'
                            }
                        }
                    }>
                        <Flex w={"fit-content"}   >
                            <Box pt={"3px"} px={"4"} borderRight={"1px"} borderColor={borderColor} >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >Created</Text>
                                <Text fontWeight={"medium"} fontSize={["24px", "30px", "30px"]} textAlign={"center"} className=" font-medium text-center " >{formatNumberWithK(history?.totalNumberOfTickets ? history?.totalNumberOfTickets : 0)}</Text>
                            </Box>
                            <Box pt={"3px"} w={"120px"} px={"1"} borderRight={"1px"} borderColor={borderColor} >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >No. of Tickets Sold</Text>
                                <Text fontWeight={"medium"} fontSize={["24px", "30px", "30px"]} textAlign={"center"} className=" font-medium text-center " >{formatNumberWithK((history?.qtyActiveSold || history?.qtyActiveSoldPR )? history?.qtyActiveSold+history?.qtyActiveSoldPR : 0)}</Text>
                            </Box>
                            <Box pt={"3px"} w={"120px"} px={"1"} borderRight={"1px"} borderColor={borderColor}  >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} > Escrow (24hrs)</Text>
                                <Text fontWeight={"medium"} fontSize={["24px", "30px", "30px"]} textAlign={"center"} className=" font-medium text-center " >{"₦"}{formatNumberWithK(history?.totalPendingSales+history?.totalPendingSalesPRShare)}</Text>
                            </Box>
                            <Box pt={"3px"} w={"120px"} px={"1"} borderRight={"1px"} borderColor={borderColor}  >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >{eventData?.donationEnabled ? "Donated(₦)" : "Revenue(₦)"}</Text>
                                <Text fontWeight={"medium"} fontSize={["24px", "30px", "30px"]} textAlign={"center"} className=" font-medium text-center " >{"₦"}{eventData.donationEnabled ? formatNumberWithK(eventData?.totalDonated) : formatNumberWithK(eventData?.createdBy?.userId === userId ? history?.totalActiveSales : history?.totalActiveSalesPR)}</Text>
                            </Box>
                            <Box pt={"3px"} px={"4"} borderColor={borderColor}  >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >Available</Text>
                                <Text fontWeight={"medium"} fontSize={["24px", "30px", "30px"]} textAlign={"center"} className=" font-medium text-center " >{formatNumberWithK(history?.totalNumberOfAvailableTickets ? history?.totalNumberOfAvailableTickets : 0)}</Text>
                            </Box>
                            {/* <Box pt={"3px"} px={"4"} borderRight={"1px"} borderColor={borderColor} >
                            <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >Sold</Text>
                            <Text fontWeight={"medium"} fontSize={"30px"} textAlign={"center"} className=" text-[30px]  font-medium text-center " >{"₦"}{formatNumberWithK(history?.totalActiveSales)}</Text>
                        </Box> */}
                            {/* <Box pt={"3px"} px={"4"} borderRight={"1px"} borderColor={borderColor} >
                                <Text fontWeight={"normal"} fontSize={"xs"} textAlign={"center"} >Cancelled</Text>
                                <Text fontWeight={"medium"} fontSize={"30px"} textAlign={"center"} className=" text-[30px]  font-medium text-center " >{"₦"}{formatNumberWithK(history?.totalRefunds)}</Text>
                            </Box> */}
                        </Flex>
                    </Flex>
                    <Flex zIndex={"10"} display={["flex", "flex", "none"]} justifyContent={"center"} alignItems={"center"} position={"absolute"} bottom={"10"} left={"0px"} bgColor={"white"} onClick={() => scroll(-400)} as="button" w={"40px"} h={"40px"} rounded={"full"} > 
                        <IoChevronBack size={"20px"} color='grey' />
                    </Flex>
                    <Box zIndex={"10"} display={["flex", "flex", "none"]} justifyContent={"center"} alignItems={"center"} position={"absolute"} bottom={"10"} right={"0px"} bgColor={"white"} onClick={() => scroll(400)}  as="button" w={"40px"} h={"40px"} rounded={"full"} >
                        <IoChevronForward size={"20px"} color='grey' />
                    </Box>
                </Box>
            </Flex>
            {/* <Box width={"full"} borderBottomWidth={"1px"} borderBottomColor={"#D0D4EB"} mt={"8"} py={"7"} px={"4"} >

                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        width={930} height={440}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }} 
                        data={historyTickets ?? []}
                    >
                        <XAxis tickFormatter={DataFormater} dataKey="ticketType" />
                        <YAxis />
                        <Tooltip formatter={numberFormat} />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />

                        <Bar name='Active Ticket Sold' dataKey="qtyActiveSold" stackId="a" fill="#B7B00E" />
                        <Bar name='Pending Ticket Sold' dataKey="qtyPendingSold" stackId="a" fill="#ffc658" />
                        <Bar name='Available Tickets' dataKey="totalNumberOfAvailableTickets" fill="#5D70F9" />
                    </BarChart>
                </ResponsiveContainer>
            </Box> */}
        </Flex>
    )
}

export default DashboardDetail
