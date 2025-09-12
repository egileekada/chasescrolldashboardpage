import CustomButton from '@/components/general/Button'
// import PeopleCard from '@/components/search_component/other_components/people_card'
import CopyRightText from '@/components/sharedComponent/CopyRightText'
import EventImage from '@/components/sharedComponent/eventimage'
import LoadingAnimation from '@/components/sharedComponent/loading_animation'
import RefundBtn from '@/components/sharedComponent/refundbtn'
// import UserImage from '@/components/sharedComponent/userimage'
// import InfiniteScrollerComponent from '@/hooks/infiniteScrollerComponent'
import httpService from '@/utils/httpService'
import {
    Box,
    Button,
    Checkbox,
    Flex,
    Select,
    Spinner,
    Switch,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    useColorMode,
    useToast,
    Image,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'

import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { FcApproval, FcRight } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print'


// import { DownloadTableExcel } from 'react-export-table-to-excel';
import { CSVLink } from 'react-csv'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import { dateFormat, dateFormatDashboad, timeFormat } from '@/utils/dateFormat'
import EventLocationDetail from '@/components/sharedComponent/event_location'
import EventDate from '@/components/event_details_component/event_date'
import { IoIosArrowDropright, IoMdArrowDropright, IoMdCloseCircle } from 'react-icons/io'
import useCustomTheme from "@/hooks/useTheme";
import { textLimit } from '@/utils/textlimit'
import InterestedUsers from '@/components/sharedComponent/interested_users'
import { EVENTPAGE_URL, IMAGE_URL, URLS } from '@/services/urls'
import { ArrowRight, BoxArrowIcon, LocationIcon, TicketBtnIcon } from '@/components/svg'
import { eventNames } from 'process'
import { useRouter, useSearchParams } from 'next/navigation'
import ModalLayout from '@/components/sharedComponent/modal_layout'
import { PaginatedResponse } from '@/models/PaginatedResponse'
import { IEventType } from '@/models/Event'
import moment from 'moment'
import { useDetails } from '@/global-state/useUserDetails'
import { ICommunity } from '@/models/Communitty'
import CustomText from '@/components/general/Text'
import { formatTimeAgo } from '@/utils/helpers'
import router from 'next/router'
import { uniqBy } from 'lodash'
import { IEvent } from '@/models/Events'
import { ITicket } from '@/models/Ticket'
import { FiChevronDown } from 'react-icons/fi'
import CreateCommunityModal from '@/components/Community/CreateCommunityModal'
import { IEventAnalysis } from '@/models/IEventAnalysis'
import DescriptionPage from '@/components/sharedComponent/descriptionPage'

interface Props {
    index: any
}

function DashboardRefund(props: Props) {
    const {
        index
    } = props

    const {
        bodyTextColor,
        borderColor
    } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const toast = useToast()
    const [size, setSize] = React.useState(20)
    const [showBtn, setShowBtn] = React.useState(false)
    const [page, setPage] = React.useState(0)
    const [newData, setNewData] = React.useState([] as any)
    const [filteredData, setFilteredData] = React.useState([] as any)
    const [memberRole, setMemberRoles] = React.useState("")
    const [showUserName, setShowUserName] = React.useState(true)
    const [showEmail, setShowEmail] = React.useState(true)
    const [showDate, setShowDate] = React.useState(true)
    const [showTicketType, setShowTicketType] = React.useState(true)
    const [showNumberOfTicket, setShowNumberOfTicket] = React.useState(true)
    const [showStatus, setShowStatus] = React.useState(true);
    const [showCommunityModal, setShowCommunityModal] = React.useState(false);
    const [communities, setCommunities] = React.useState<ICommunity[]>([]);
    const [communityPage, setCommunityPage] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    const [event, setEvent] = React.useState<IEventType | null>(null);
    const [tickets, setTickets] = React.useState<ITicket[]>([]);
    const [selectedTicketType, setSelectedTicketType] = React.useState('All');
    const [showCommunityCreationModal, setShowCommunityCreationModal] = React.useState(false);
    const [eventAnaylysis, setEventAnalysis] = React.useState<IEventAnalysis | null>(null);

    const { userId } = useDetails();


    const {
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        headerTextColor
    } = useCustomTheme();

    // react query

    const communityQuery = useQuery(['get-communities', userId], () => httpService.get(`${URLS.GROUP}`, {
        params: {
            creatorID: userId,
            size: 30,
        }
    }), {
        onSuccess: (data) => {
            const item: PaginatedResponse<ICommunity> = data?.data;
            setCommunities((prev) => uniqBy([...prev, ...item?.content], 'id'));
            if (item?.last) {
                setHasMore(false);
            }
            console.log(item);
        }
    });

    const analysisQuery = useQuery(['get-analysis', index], () => httpService.get(`${URLS.eventAnalysis}`, {
        params: {
            typeID: index
        }
    }), {
        onSuccess: (data) => {
            setEventAnalysis(data?.data);
        }
    });

    const getTicketsQuery = useQuery(['get-tikcets', index], () => httpService.get(`${URLS.tickets}`, {
        params: {
            eventID: index
        }
    }), {
        onSuccess: (data) => {
            const item: PaginatedResponse<ITicket> = data?.data;
            setTickets((prev) => uniqBy([...prev, ...item?.content], 'id'));
        },
        onError: (error) => {
            toast({
                title: 'Error occured while getting tickets',
                description: 'An error occured while getting tickets',
                status: 'error',
                position: "top-right",
            })
        }
    })

    const getEvent = useQuery([`get-event-by-event-id-${index}`, index], () => httpService.get(`${URLS.GET_EVENTS}`, {
        params: {
            id: index
        }
    }), {
        onSuccess: (data) => {
            const item: PaginatedResponse<any> = data?.data;
            setEvent(item?.content[0]);
        }
    })

    const { isLoading, isRefetching, data } = useQuery(['get-event-members' + size + page, index, memberRole], () => httpService.get('/events/get-event-members/' + index, {
        params: {
            size: size,
            page: page,
            eventMemberRole: memberRole
        }
    }), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        }
    })

    const [open, setOpen] = useState(false)

    const [dataInfo, setData] = useState([] as any)
    const [eventData, setEventData] = useState({} as IEventType)

    const { } = useQuery(['all-events-details' + index], () => httpService.get(URLS.All_EVENT + "?id=" + index), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        },
        onSuccess: (data: any) => {
            setData(data?.data?.content[0]);
        }
    })

    const { isLoading: loadingcsv, refetch } = useQuery(['downloadcsv'], () => httpService.get("/events/download-event-members/" + index), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        },
        onSuccess: (data: any) => {

            // Split the CSV string into rows
            const rows = data?.data.trim().split('\n');

            // Extract the header row
            const header = rows.shift().split(',');

            // Function to parse the date fields properly
            const parseDate = (dateString: string) => {
                const dateParts = dateString.split(',');
                const timePart = dateParts.slice(3).join(',');
                const datePart = dateParts.slice(1, 3).join(' ');
                return `${dateParts[0]}, ${datePart}${timePart}`;
            };

            // Convert each row into an object
            const datacsv = rows.map((row: any) => {
                const fields = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map((field: any) => field.replace(/"/g, ''));
                return {
                    name: fields[0],
                    username: fields[1],
                    email: fields[2],
                    tickettype: fields[3] === 'ORGANIZER' || fields[3] === 'VOLUNTEER' || fields[3] === 'ADMIN' ? '' : fields[3],
                    ticketsbought: parseInt(fields[4]),
                    date: parseDate(fields.slice(5).join(','))
                };
            });
 
            setNewData(datacsv)


        }
    });

    const addCommunityFunnel = useMutation({
        mutationFn: (data: string) => httpService.put(`${URLS.UPDATE_EVENT}`, {
            id: index,
            eventFunnelGroupID: data,
        }),
        onSuccess: (data) => {
            toast({
                title: 'Success',
                description: 'Community Funnel Added successfully',
                position: 'top-right',
                status: 'success'
            })
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: 'An Error occured while trying to convert the attendee list',
                position: 'top-right',
                status: 'error'
            })
        }
    })

    useEffect(() => {

        const filteredData = newData.map((item: any) =>
            Object.keys(item).reduce((acc: any, key: any) => {
                if ((key !== 'email' && !showEmail)) {
                    acc[key] = item[key];
                } else if ((key !== 'username' && !showUserName)) {
                    acc[key] = item[key];
                } else if ((key !== 'tickettype' && !showTicketType)) {
                    acc[key] = item[key];
                } else if ((key !== 'date' && !showDate)) {
                    acc[key] = item[key];
                } else if ((key !== 'ticketsbought' && !showNumberOfTicket)) {
                    acc[key] = item[key];
                }
                return acc;
            }, {})
        );

        setFilteredData(filteredData);
        console.log(filteredData);
        (filteredData);

    }, [showDate, showNumberOfTicket, showEmail, showStatus, showStatus, showTicketType, showUserName])
    const newtheme = localStorage.getItem("chakra-ui-color-mode") as string
    
    const query = useSearchParams(); 
    const frame = query?.get('frame');


    const { isLoading: loadingData, isRefetching: refechingDa } = useQuery(['all-events-details', index], () => httpService.get(URLS.All_EVENT + "?id=" + index), {
        onError: (error: any) => {
            toast({
                status: "error",
                title: error.response?.data,
            });
        },
        onSuccess: (data: any) => {
            // const item: PaginatedResponse<IEventType> = data.data;
            setEventData(data?.data?.content[0]);
        }
    })


    // const componentRef: any = React.useRef(null);

    const tableRef: any = React.useRef(null);


    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef, 
        documentTitle: capitalizeFLetter(eventData?.eventName),
        pageStyle: `
          @page {
            size: Legal landscape
          }   
        `, });

    // const handlePrint = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: capitalizeFLetter(eventData?.eventName),
    //     pageStyle: `
    //       @page {
    //         size: Legal landscape
    //       }   
    //     `,
    // });

    const downloadCSV = () => {
        // refetch()
    }
 
    const clickHandler = () => { 
        window.location.href = `${EVENTPAGE_URL}/product/details/events/${dataInfo?.id}${frame ? `?frame=true&theme=${newtheme}` : (newtheme && newtheme !== "null") ? `?theme=${newtheme}` : ""}`;
    }

    return (
        <Flex ref={contentRef} width={"full"} flexDirection={"column"} >
            <LoadingAnimation loading={loadingData} > 
                <Flex pos={"relative"} maxW={["500px", "full", "full", "full"]} width={"full"} rounded={"8px"} borderWidth={"1px"} borderColor={borderColor} p={["2", "2", "4", "6"]} alignItems={["start", "start", "center", "center"]} flexDir={["column", "column", "row"]} gap={["2", "2", "6", "6"]} >
                    <Flex width={["full", "full", "auto", "auto"]} mr={["auto", "auto", "0px"]} gap={"3"} flexDirection={["column", "column", "row", "row"]} pos={"relative"} p={"2"} rounded={"4px"} >
                        <Flex alignItems={"center"} w={"full"} gap={"4"} flexDirection={["column", "column", "column", "row"]} >
                            <EventImage data={eventData} width={["full", "full", "247px", "247px"]} height={["150px", "200px", "170px", "170px"]} />
                            <Flex flexDir={"column"} gap={"2"} w={["full", "full", "fit-content", "fit-content"]} >
                                <Text fontSize={["lg", "lg", "32px"]} fontWeight={"semibold"} >{textLimit(capitalizeFLetter(eventData?.eventName), 20)}</Text>
                                {/* <EventDate eventdashboard={true} date={eventData?.startDate} />
                            <EventLocationDetail length={40} fontsize='12px' location={eventData?.location} locationType={eventData?.locationType} indetail={true} eventdashboard={true} /> */}
                                <Box  >
                                    <InterestedUsers fontSize={15} event={dataInfo} border={"2px"} size={"30px"} />
                                </Box>
                                <Flex minW={["100px", "100px", "200px", "200px"]} gap={"2"} maxW={["full", "full", "250px", "250px"]} >
                                    <Flex w={"fit-content"} mt={"4"} flexDir={"column"} fontWeight={"bold"}>
                                        <Flex
                                            width={"50px"}
                                            flexDir={"column"}
                                            py={"2px"}
                                            borderWidth={"1px"}
                                            alignItems={"center"}
                                            roundedBottom={"2xl"}
                                            roundedTopLeft={"2xl"}
                                        >
                                            <Text
                                                fontSize={"11.37px"}
                                                lineHeight={"14.81px"}
                                                color={"#3D37F1"}
                                            >
                                                {moment(dataInfo?.startDate).format("MMM")}
                                            </Text>
                                            <Text fontSize={"28.43px"} mt={"-1"} lineHeight={"37.01px"}>
                                                {moment(dataInfo?.startDate).format("D")}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    {/* <DescriptionPage description={capitalizeFLetter(eventData.eventDescription)} limit={100} /> */}
                                    {/* <Text fontSize={"14px"} display={["flex", "flex", "none", "none"]} >{textLimit(capitalizeFLetter(eventData.eventDescription)+" Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", 100)}</Text>
                                    <Text fontSize={"14px"} display={["none", "none", "flex", "flex"]} >{textLimit(capitalizeFLetter(eventData.eventDescription)+" Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", 50)}</Text> */}
                                </Flex>
                                {eventAnaylysis && (
                                    <Text fontWeight={'bold'}>Total Revenue - ₦{eventAnaylysis?.totalActiveSales ?? 0}</Text>
                                )}
                            </Flex>
                        </Flex>
                        <Box w={["50px"]} display={["none", "none", "block"]} pos={"relative"} >
                            <Box w={["fit-content"]} position={"relative"} top={"0px"} >
                                <CustomButton text={"View Event"} onClick={clickHandler} backgroundColor={"#EFF1FE"} transform={["rotate(-90deg)"]} left={["-45px"]} top={["50px"]} position={["relative", "relative", "absolute"]} color={"#5D70F9"} height={"45px"} fontSize={"xs"} width={"140px"} roundedBottom={"4px"} />
                            </Box>
                        </Box>
                        <Box w={["full"]} display={["block", "block", "none"]} position={"relative"} top={"0px"} >
                            <CustomButton text={"View Event"} onClick={clickHandler} backgroundColor={"#EFF1FE"} color={"#5D70F9"} height={"45px"} fontSize={"xs"} width={"full"} roundedBottom={"4px"} />
                        </Box>
                    </Flex>
                    <Flex w={["full", "full", "auto", "auto"]} flexDir={["column", "column", "column", "column", "row"]} alignItems={"center"} ml={["0px", "0px", "auto", "auto"]} gap={"4"} >
                        <Flex display={["none", "none", "none", "flex", "flex"]} rounded={"8px"} borderWidth={"1px"} borderColor={borderColor} p={"4"} flexDir={"column"} gap={"4"} justifyContent={"center"} >
                            <Flex gap={"2"} alignItems={"center"}  >
                                <Text w={"100px"} fontSize={"sm"} >Members Roles</Text>
                                <Select width={"fit-content"} outline={"none"} placeholder='All' value={memberRole} onChange={(e) => setMemberRoles(e.target?.value)} >
                                    <option value={"ADMIN"} >Organizer</option>
                                    <option value={"USER"} >Attendees</option>
                                    <option value={"COLLABORATOR"} >Volunter</option>
                                </Select>
                            </Flex>
                            <Flex gap={"2"} alignItems={"center"}  >
                                <Text w={"100px"} fontSize={"sm"} >Display</Text>
                                <Select width={"fit-content"} outline={"none"} value={size} onChange={(e) => setSize(Number(e.target?.value))} >
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>40</option>
                                    <option>50</option>
                                    <option>60</option>
                                    <option>70</option>
                                    <option>80</option>
                                    <option>90</option>
                                    <option>100</option>
                                </Select>
                            </Flex>
                        </Flex>
                        <Flex width={["full", "full", "auto", "auto"]} h={"fit-content"} px={["2", "2", "0px", "0px"]} pb={["2", "2", "0px", "0px"]} ml={["0px", "0px", "auto"]} gap={"4"} >
                            <CustomButton onClick={() => setOpen(true)} text={"Export"} width={["100%", "100%", "130px", "130px"]} />
                        </Flex>
                    </Flex>
                </Flex>
            </LoadingAnimation>
            <Flex width={"full"} flexDir={"column"} my={["6", "0px", "0px"]} p={["0px", "6", "6"]} >
                <LoadingAnimation loading={isLoading} refeching={isRefetching} length={data?.data?.content?.length} >

                    <TableContainer >
                        <Table variant='simple' borderWidth={"1px"} borderColor={borderColor} colorScheme="gray">
                            <TableCaption>
                                <Box>
                                    Powered By Chasescroll
                                    <Text fontSize={"sm"} >
                                        <CopyRightText />
                                    </Text>
                                </Box>
                            </TableCaption>
                            <Thead bgColor={"#FAFAFB"} >
                                <Tr>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            S/N
                                        </Flex>
                                    </Th>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            FullName
                                            <Switch onChange={(e) => setShowUserName(e.target.checked)} isChecked={showUserName} />
                                        </Flex>
                                    </Th>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            EMAIL ADDRESS
                                            <Switch onChange={(e) => setShowEmail(e.target.checked)} isChecked={showEmail} />
                                        </Flex>
                                    </Th>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            Date & TIME
                                            <Switch onChange={(e) => setShowDate(e.target.checked)} isChecked={showDate} />
                                        </Flex>
                                    </Th>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        {event?.productTypeData && (
                                            <Flex gap={"3"} alignItems={'center'}>
                                                {event?.productTypeData?.length > 1 && (
                                                    <>
                                                        <Menu>
                                                            <MenuButton as={Button} rightIcon={<FiChevronDown size={25} />} fontSize={'12px'}>
                                                                {selectedTicketType === 'All' ? 'TICKET TYPE' : selectedTicketType}
                                                            </MenuButton>
                                                            <MenuList>
                                                                <MenuItem onClick={() => setSelectedTicketType('All')}>All</MenuItem>
                                                                {event?.productTypeData.map((item, index) => (
                                                                    <MenuItem key={index.toString()} onClick={() => setSelectedTicketType(item?.ticketType)}>{item?.ticketType}</MenuItem>
                                                                ))}
                                                            </MenuList>
                                                        </Menu>
                                                    </>
                                                )}
                                                {event?.productTypeData?.length < 2 && 'Ticket type'}
                                                <Switch onChange={(e) => setShowTicketType(e.target.checked)} isChecked={showTicketType} />
                                            </Flex>
                                        )}
                                    </Th>
                                    <Th borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            NO. TICKET
                                            <Switch onChange={(e) => setShowNumberOfTicket(e.target.checked)} isChecked={showNumberOfTicket} />
                                        </Flex>
                                    </Th>
                                    <Th borderBottomWidth={"1px"} >
                                        <Flex gap={"3"}>
                                            STATUS
                                            <Switch onChange={(e) => setShowStatus(e.target.checked)} isChecked={showStatus} />
                                        </Flex>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.data?.content?.filter((item: any) => {
                                    if (selectedTicketType === 'All') {
                                        return item;
                                    } else {
                                        return item?.ticketType === selectedTicketType || !item?.ticketType ? item : null;
                                    }
                                }).map((person: any, i: number) => {
                                    return (
                                        <Tr key={i} >
                                            <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} >{(page * size) + (i + 1)}</Td>
                                            <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} >{showUserName ? capitalizeFLetter(person?.user?.firstName) + " " + capitalizeFLetter(person?.user?.lastName) : ""}</Td>
                                            <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} fontSize={"14px"}>{showEmail ? person?.user?.email : ""}</Td>
                                            <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} fontSize={"14px"}>{showDate ? dateFormat(person?.createdDate) : ""}</Td>
                                            {(person?.ticketType && person?.role !== "ADMIN" && person?.role !== "COLLABORATOR") && (
                                                <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} fontSize={"14px"}>
                                                    {showTicketType && (
                                                        <Flex height={"23px"} px={"2"} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"} fontSize={"xs"} rounded={"32px"} >
                                                            {person?.ticketType?.slice(0, 1)?.toUpperCase() + person?.ticketType?.slice(1, person?.ticketType?.length)}
                                                        </Flex>
                                                    )}
                                                </Td>
                                            )}
                                            {(!person?.ticketType || person?.role === "ADMIN" || person?.role === "COLLABORATOR") && (
                                                <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} >
                                                    {(person?.user?.userId === person?.event?.createdBy && showTicketType) && (
                                                        <Flex height={"23px"} px={"2"} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"} fontSize={"xs"} rounded={"32px"} bg={"#DCF9CF66"} color={"brand.chasescrollBlue"} >
                                                            Organizer
                                                        </Flex>
                                                    )}
                                                    {(person?.role === "ADMIN" && person?.user?.userId !== person?.event?.createdBy && showTicketType) && (
                                                        <Flex height={"23px"} px={"2"} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"} fontSize={"xs"} rounded={"32px"} bg={"#DCF9CF66"} color={"#3EC30F"} >
                                                            Admin
                                                        </Flex>
                                                    )}
                                                    {(person?.role === "COLLABORATOR" && showTicketType) && (
                                                        <Flex height={"23px"} px={"2"} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"} fontSize={"xs"} rounded={"32px"} bg={"#FDF3CF6B"} color={"#FDB806"} >
                                                            Volunteer
                                                        </Flex>
                                                    )}

                                                </Td>
                                            )}
                                            <Td borderRightWidth={"1px"} borderBottomWidth={"1px"} textAlign={"center"} fontSize={"xs"} >
                                                {(person?.ticketNumber !== 0 && showNumberOfTicket) ? person?.ticketNumber : ""}
                                            </Td>
                                            <Td borderBottomWidth={"1px"} borderRightWidth={showBtn ? "1px" : "0px"} >
                                                {showStatus &&
                                                    <>
                                                        {person?.ticketScanInfoList?.map((item: {
                                                            scanTime: Array<any>,
                                                            scanned: boolean
                                                        }, index: number) => {
                                                            return (
                                                                <>
                                                                    {item?.scanTime?.length > 0 &&
                                                                        <Flex key={index} fontSize={"xs"} mt={index === 0 ? "0px" : "4"} flexDir={"column"} gap={"2"} >
                                                                            <Text fontWeight={"bold"} >Ticket {index + 1} (MM-DD-YY)</Text>
                                                                            <Flex flexDir={"column"} gap={"1"} >
                                                                                {item?.scanTime?.map((time: number, indexkey: number) => {

                                                                                    return (
                                                                                        <Flex key={indexkey} gap={"1"} w={"200px"} justifyContent={"space-between"} alignItems={"center"}>

                                                                                            <Text >{time ? dateFormatDashboad(time) : ""} {time ? timeFormat(time) : ""} </Text>
                                                                                            {((new Date(item?.scanTime[indexkey])?.getDate() >= new Date(data?.data?.content[0]?.event?.startDate)?.getDate()) && ((new Date(item?.scanTime[indexkey])?.getDate()) <= new Date(data?.data?.content[0]?.event?.endDate)?.getDate())) ? (

                                                                                                <>
                                                                                                    {indexkey !== 0 ? (
                                                                                                        <Flex w={"fit-content"} >
                                                                                                            {new Date(item?.scanTime[indexkey])?.getDate() === new Date(item?.scanTime[indexkey - 1])?.getDate() && (
                                                                                                                <IoMdCloseCircle color='FF0000' size={"20px"} />
                                                                                                            )}
                                                                                                            {(new Date(item?.scanTime[indexkey])?.getDate() !== new Date(item?.scanTime[indexkey - 1])?.getDate()) && (
                                                                                                                <FcApproval size={"20px"} />
                                                                                                            )}
                                                                                                        </Flex>
                                                                                                    ) :
                                                                                                        <Flex w={"fit-content"} >
                                                                                                            <FcApproval size={"20px"} />
                                                                                                        </Flex>
                                                                                                    }
                                                                                                </>
                                                                                            ) :
                                                                                                <Flex w={"fit-content"} >
                                                                                                    <IoMdCloseCircle color='FF0000' size={"20px"} />
                                                                                                </Flex>
                                                                                            }

                                                                                        </Flex>
                                                                                    )
                                                                                })}
                                                                            </Flex>
                                                                        </Flex>
                                                                    }
                                                                </>
                                                            )
                                                        })}
                                                    </>
                                                }
                                            </Td>
                                            {showBtn && (
                                                <Td borderBottomWidth={"1px"} >
                                                    <RefundBtn person={person} index={index} />
                                                </Td>
                                            )}
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <Flex py={"6"} gap={"8"} flexDir={["column", "column", "row", "row"]} alignItems={"start"} justifyContent={"space-between"} >
                        <Flex fontSize={"12px"} color={bodyTextColor} lineHeight={"23px"} >
                            Showing {(Number(data?.data?.numberOfElements))} items out of {data?.data?.totalElements} results found
                        </Flex>
                        <Flex display={data?.data?.totalPages === 1 ? "none" : "flex"} gap={"5"} ml={"auto"} >
                            <Box onClick={() => setPage((prev) => prev - 1)} as="button" cursor={data?.data?.first && "not-allowed"} transform={"rotate(180deg)"} disabled={data?.data?.first} _disabled={{ opacity: "20%" }} >
                                <BoxArrowIcon />
                            </Box>
                            <Flex width={"26px"} border={(data?.data?.number + 1) === 1 ? "1px" : "0px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                1
                            </Flex>
                            {(data?.data?.totalPages >= 2) && (
                                <Flex as={"button"} onClick={() => setPage(1)} width={"26px"} border={(data?.data?.number + 1) === 2 ? "1px" : "0px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                    2
                                </Flex>
                            )}
                            {(data?.data?.totalPages >= 3) && (
                                <Flex as={"button"} onClick={() => setPage(2)} width={"26px"} border={(data?.data?.number + 1) === 3 ? "1px" : "0px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                    3
                                </Flex>
                            )}
                            {(data?.data?.totalPages >= 4) && (
                                <Flex as={"button"} onClick={() => setPage(3)} width={"26px"} border={(data?.data?.number + 1) === 4 ? "1px" : "0px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                    4
                                </Flex>
                            )}
                            {(data?.data?.number + 1) > 4 &&
                                <Flex width={"26px"} border={(data?.data?.number + 1) > 4 ? "1px" : "0px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                    ...
                                </Flex>
                            }
                            {(data?.data?.number + 1) > 4 &&
                                <Flex width={"26px"} border={"1px"} rounded={"6px"} height={"24px"} justifyContent={"center"} alignItems={"center"} >
                                    {data?.data?.number + 1}
                                </Flex>
                            }
                            <Box onClick={() => setPage((prev) => prev + 1)} as="button" cursor={data?.data?.last && "not-allowed"} disabled={data?.data?.last} _disabled={{ opacity: "20%" }} >
                                <BoxArrowIcon />
                            </Box>
                        </Flex>
                    </Flex>

                </LoadingAnimation>
            </Flex>

            <ModalLayout open={showCommunityModal} close={() => setShowCommunityModal(false)}>
                <Flex py={"8"} px={"6"} flexDirection={"column"} gap={"4"} width={"full"} justifyContent={"center"} alignItems={"center"} >
                    <CustomText fontFamily={'DM-Regular'}>Add Event members to community</CustomText>
                    {communityQuery.isLoading && (
                        <Flex width={'100%'} height={'100px'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner />
                            <CustomText fontFamily={'DM-Regular'}>Loading Communities</CustomText>
                        </Flex>
                    )}
                    {!communityQuery.isLoading && communities.length > 0 && communities.map((item, index) => (
                        <Box as='button' key={index.toString()} onClick={() => addCommunityFunnel.mutate(item?.id)} w={"full"} pos={"relative"} zIndex={"10"} borderBottomWidth={"1px"} borderBottomColor={borderColor} py={"5"} >
                            <Flex rounded={"24px"} textAlign={"left"} px={"4"} gap={"3"} py={"3"} w={"full"} _hover={{ backgroundColor: borderColor }} backgroundColor={"transparent"}  >
                                <Box w={"42px"} pos={"relative"} h={"42px"} bgColor={"ButtonText"} borderWidth={'2px'} borderBottomLeftRadius={'20px'} borderBottomRadius={'20px'} borderTopLeftRadius={'20px'}>
                                    <Image src={`${item?.data?.imgSrc?.includes("http") ? "" : IMAGE_URL}${item?.data?.imgSrc}`} alt='image' style={{ width: '100%', height: '100%', objectFit: "cover", borderRadius: "20px", borderTopRightRadius: "0px " }} />
                                </Box>
                                <Flex flexDir={"column"} flex={"1"} gap={"1"} >
                                    <Text fontWeight={"700"} lineHeight={"24px"} >{textLimit(item?.data?.name, 25)}</Text>
                                    <Text fontSize={"14px"} mt={"2px"} >{textLimit(item?.data?.description, 40)}</Text>
                                    <Flex color={headerTextColor} alignItems={"center"} gap={"1"} >
                                        <Box w={"8px"} h={"8px"} rounded={"full"} bgColor={primaryColor} />
                                        <Text fontSize={"11px"} lineHeight={"13px"} letterSpacing={"0.07px"} >{formatTimeAgo(item?.lastModifiedDate)}</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Box>
                    ))}
                </Flex>
            </ModalLayout>

            <ModalLayout open={showCommunityCreationModal} close={() => setShowCommunityCreationModal(false)}>
                <CreateCommunityModal eventId={index} onClose={() => setShowCommunityCreationModal(false)} />
            </ModalLayout>

            <ModalLayout open={open} close={setOpen}>
                <Flex py={"8"} px={"6"} flexDirection={"column"} gap={"4"} width={"full"} justifyContent={"center"} alignItems={"center"} >
                    <CustomButton fontSize={"lg"} width={"full"} backgroundColor={"transparent"} color={"#FF6F61"} onClick={()=> reactToPrintFn()} text='PDF' />
                    <Flex width={"full"} height={"1px"} bgColor={"#DDE6EB"} />
                    <CSVLink style={{ width: "100%" }} data={filteredData[0]?.name ? filteredData : newData[0]?.name ? newData : []}
                        filename={data?.data?.content[0]?.event?.eventName?.slice(0, 1)?.toUpperCase() + data?.data?.content[0]?.event?.eventName?.slice(1, data?.data?.content[0]?.event?.eventName?.length) + ".csv"} >
                        <CustomButton onClick={downloadCSV} fontSize={"lg"} width={"full"} backgroundColor={"transparent"} color={"#5D70F9"} text='CSV' />
                    </CSVLink> 
                </Flex>
            </ModalLayout>
        </Flex >
    )
}

export default DashboardRefund
