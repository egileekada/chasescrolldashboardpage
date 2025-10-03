import { IMediaContent } from '@/models/MediaPost'
import { Box, Button, Flex, Image, Link, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UserImage from '../sharedComponent/userimage'
import { textLimit } from '@/utils/textlimit'
import { capitalizeFLetter } from '@/utils/capitalLetter'
import { IMAGE_URL, URLS } from '@/services/urls'
import VideoPlayer from '../general/VideoPlayer'
import ImageSlider from '../modals/mediapostPages/ImageSlider'
import { HomeCommentIcon, HomeHeartFillIcon, HomeHeartIcon } from '../svg'
import useCustomTheme from '@/hooks/useTheme'
import useHome from '@/hooks/useHome'
import { CgMoreVertical } from 'react-icons/cg'
import ShareBtn from '../sharedComponent/new_share_btn'
import ModalLayout from '../sharedComponent/modal_layout'
import CustomText from '../general/Text'
import ReportUserModal from '../modals/Home/ReportModal'
import CommentSection from './commentSection'
import CustomButton from '../general/Button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment'
import httpService from '@/utils/httpService'
import { useQuery } from 'react-query'
import { IoArrowBack, IoCloseCircleOutline } from 'react-icons/io5'
import { useDetails } from '@/global-state/useUserDetails'
import { IoIosMore } from 'react-icons/io'
import { Sheet } from 'react-modal-sheet';
import BottomSheetComment from './bottomSheetComment'


export default function PostCard(props: IMediaContent) {

    const {
        user,
        comments,
        text,
        type,
        mediaRef,
        multipleMediaRef,
        likeStatus,
        likeCount,
        commentCount,
        id,
        timeInMilliseconds
    } = props

    const {
        bodyTextColor,
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        borderColor,
        headerTextColor
    } = useCustomTheme();

    const { likesHandle, loadingLikes, liked, setLiked, setLikeCount, likeCount: count, deletePost, deletingPost, deleteModal, setDeleteModal } = useHome()

    const Id = localStorage.getItem('user_id');
    const [showReportModal, setShowReportModal] = useState(false);
    const [open, setOpen] = useState(false)
    const [openMobile, setOpenMobile] = useState(false)
    const [openImage, setOpenImage] = useState(false)
    const [numberComments, setNumberComments] = useState("")
    const [openComments, setOpenComments] = useState(false)
    const [textSize, setTextSize] = useState(100)

    let token = localStorage.getItem('token') + "";

    const query = useSearchParams();
    const typeName = query?.get('type');
    const typeID = query?.get('typeID');

    const { user: data, } = useDetails((state) => state);

    const { } = useQuery(
        [`getPostById-${id}`, id],
        () => httpService.get(`${URLS.GET_POST_BY_ID}/${id}`),
        {
            onSuccess: (data: any) => {
                setLikeCount(data?.data?.likeCount)
                setLiked(data?.data?.likeStatus);
                setNumberComments(data?.data?.comments?.numberOfElements); 
            },
        },
    )

    const pathname = usePathname()

    const router = useRouter()

    const deleteHandler = () => {
        setOpen(false)
        setDeleteModal(true)
    }

    const reportHandler = () => {
        setOpen(false)
        setShowReportModal(true)
    }

    const clickHandleLike = (id: string) => {
        if (token === null || data === null) {
            router?.push(`/share/auth/login?type=${typeName}&typeID=${typeID}`)
        } else {
            likesHandle(id)
        }
    }

    const clickHandleComment = () => {
        if (token === null || data === null) {
            router?.push(`/share/auth/login?type=${typeName}&typeID=${typeID}`)
        } else {
            setOpenComments(true)
        }
    }


    const clickHandleCommentMobile = () => {
        if (token === null || data === null) {
            router?.push(`/share/auth/login?type=${typeName}&typeID=${typeID}`)
        } else {
            setOpenMobile(true)
        }
    }

    return (
        <Flex style={{ borderBottom: "0.5px solid var(--Miscellaneous-Tab---Unselected, #999999)" }} w={"full"} bg={mainBackgroundColor} borderRadius={"36px"} borderTopRightRadius={"0px"} py={"4"} pb={4} px={"3"} >
            <Flex w={"full"} gap={"3"} flexDir={"column"} >
                <Flex alignItems={"center"} gap={"3"} h={"fit-content"} w={"full"} rounded={"full"} borderWidth={"0px"} borderColor={borderColor}>
                    <Flex alignItems={"center"} gap={["1", "1", "1"]} >
                        {(pathname?.includes("share") && data?.email) && (
                            <Box as='button' onClick={() => router.push("/dashboard")} >
                                <IoArrowBack role="button" size={"25px"} />
                            </Box>
                        )}
                        <Flex as={"button"} onClick={() => router?.push(`/dashboard/profile/${user?.userId}`)} gap={"3"} >
                            <UserImage size={"42px"} data={user} font={"18px"} border={"1px"} image={user?.data?.imgMain?.value} />
                            <Flex display={["none", "none", "block"]} flexDir={"column"} textAlign={"left"}  >
                                {/* <Text color={"#233DF3"} >{textLimit(capitalizeFLetter(user?.firstName) + " " + capitalizeFLetter(user?.lastName), 15)}</Text> */}
                                <Text fontSize={"14px"} >{textLimit(capitalizeFLetter(user?.firstName), 20)}</Text>
                                <Text fontSize={"8px"} color={bodyTextColor} >{moment(timeInMilliseconds).fromNow()}</Text>
                            </Flex>
                            <Flex display={["block", "block", "none"]} flexDir={"column"} textAlign={"left"}  >
                                <Text color={"#233DF3"} fontSize={"14px"} >{textLimit(capitalizeFLetter(user?.firstName) + " " + capitalizeFLetter(user?.lastName), 15)}</Text>
                                <Text mt={"-4px"} fontSize={"10px"} >@{textLimit(user?.username, 12)}</Text>
                                <Text fontSize={"8px"} color={bodyTextColor} >{moment(timeInMilliseconds).fromNow()}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    {data?.email && (
                        <Flex onClick={() => setOpen(true)} as={"button"} ml={"auto"} pr={"1"} >
                            <IoIosMore size={"25px"} />
                        </Flex>
                    )}
                </Flex>
                {(type === "WITH_IMAGE" || type === "WITH_VIDEO_POST") &&
                    <Flex w={"full"} h={["236px", "236px", "236px", "350px", "500px"]} rounded={"16px"} borderWidth={"1px"} roundedTopRight={"0px"}>
                        {type === "WITH_VIDEO_POST" && (
                            <VideoPlayer
                                src={`${mediaRef ? mediaRef : multipleMediaRef[0]}`}
                                measureType="px"
                            />
                        )}
                        {type === "WITH_IMAGE" && (
                            <Flex w={"full"} as={"button"} onClick={() => setOpenImage(pathname?.includes("profile") ? false : true)} >
                                <ImageSlider links={multipleMediaRef} type="feed" />
                            </Flex>
                        )}
                    </Flex>
                }
                <Flex w={"full"} borderTopWidth={"0px"} alignContent={"center"} justifyContent={"space-between"} >
                    <Flex
                        justifyContent={"center"}
                        h={["26px", "26px", "30px"]}
                        alignItems={"center"} w={"fit-content"} gap={["3px", "2px", "2px"]} >
                        {/* {!loadingLikes ? */}
                        <Flex
                            as={"button"}
                            disabled={loadingLikes}
                            onClick={() => clickHandleLike(id)}
                            width={"fit-content"} h={"fit-content"} >
                            <Flex
                                width={["20px", "20px", "24px"]}
                                display={["none", "block", "block"]}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                {liked !== "LIKED" && (
                                    <HomeHeartIcon color={bodyTextColor} />
                                )}
                                {liked === "LIKED" && <HomeHeartFillIcon />}
                            </Flex>
                            <Flex
                                width={["20px", "20px", "24px"]}
                                h={["26px", "26px", "30px"]}
                                display={["block", "none", "none"]}
                                justifyContent={"center"}
                                alignItems={"center"}
                                as={"button"}
                                disabled={loadingLikes}
                                onClick={() => clickHandleLike(id)}
                            >
                                {liked !== "LIKED" && (
                                    <HomeHeartIcon size='20px' color={bodyTextColor} />
                                )}
                                {liked === "LIKED" && <HomeHeartFillIcon size='20px' />}
                            </Flex>
                        </Flex> 
                        <Text fontSize={"12px"} fontWeight={"bold"} >{count}</Text>
                    </Flex>
                    <Flex as={"button"}
                        pt={"2px"}
                        justifyContent={"center"}
                        h={["26px", "26px", "30px"]}
                        display={["none", "none", "flex"]}
                        alignItems={"center"}
                        onClick={() => clickHandleComment()} w={"fit-content"} gap={["3px", "2px", "2px"]} >
                        <Flex
                            width={["20px", "20px", "24px"]}
                            display={["none", "block", "block"]}
                            justifyContent={"center"}
                            alignItems={"center"}
                            color={bodyTextColor}
                        >
                            <HomeCommentIcon color={bodyTextColor} />
                        </Flex>
                        <Flex
                            width={["20px", "20px", "24px"]}
                            justifyContent={"center"}
                            alignItems={"center"}
                            color={bodyTextColor}
                            display={["block", "none", "none"]}
                        >
                            <HomeCommentIcon size='20px' color={bodyTextColor} />
                        </Flex>
                        <Text fontSize={"12px"} fontWeight={"bold"} >{numberComments}</Text>
                    </Flex>
                    <Flex as={"button"}
                        pt={"2px"}
                        justifyContent={"center"}
                        display={["flex", "flex", "none"]}
                        h={["26px", "26px", "30px"]}
                        alignItems={"center"}
                        onClick={() => clickHandleCommentMobile()} w={"fit-content"} gap={["3px", "2px", "2px"]} >
                        <Flex
                            width={["20px", "20px", "24px"]}
                            display={["none", "block", "block"]}
                            justifyContent={"center"}
                            alignItems={"center"}
                            color={bodyTextColor}
                        >
                            <HomeCommentIcon color={bodyTextColor} />
                        </Flex>
                        <Flex
                            width={["20px", "20px", "24px"]}
                            justifyContent={"center"}
                            alignItems={"center"}
                            color={bodyTextColor}
                            display={["block", "none", "none"]}
                        >
                            <HomeCommentIcon size='20px' color={bodyTextColor} />
                        </Flex>
                        <Text fontSize={"12px"} fontWeight={"bold"} >{numberComments}</Text>
                    </Flex>
                    <Flex w={"fit-content"} cursor={data?.email ? "pointer" : "not-allowed"} pr={"3"} alignItems={"center"}
                        h={["26px", "26px", "30px"]} gap={"2px"} >
                        {/* <ShareBtn disable={!token ? true : false} type="POST" id={id} /> */}
                    </Flex>
                </Flex>
                <Flex px={"2"} >

                    {(text?.includes("https://") || text?.includes("http://") || text?.includes("www.")) ?
                        (
                            <Link wordBreak="break-all" href={text} target={"_blank"} textDecor={"underline"} color={primaryColor} fontSize={["14px", "14px", "16px"]} >{textLimit(text, 50)}</Link>
                        ) :
                        (
                            <Text wordBreak="break-all" fontSize={["12px", "12px", "14px"]} >{capitalizeFLetter(textLimit(text, textSize))} {text?.length > 100 && <span style={{ color: primaryColor, fontWeight: "700", fontSize: "14px" }} onClick={() => setTextSize((prev) => prev === 100 ? (10 * 100000000000) : 100)} role='button' >{textSize === 100 ? "more" : "less"}</span>}</Text>
                        )
                    }
                </Flex>
            </Flex>
            <ModalLayout open={open} close={setOpen} size={"xs"} >
                <Flex w={"full"} flexDir={"column"} bg={mainBackgroundColor} >
                    <Flex as={"button"} w={"full"} h={"60px"} borderColor={borderColor} borderBottomWidth={"1px"} justifyContent={"center"} alignItems={"center"} >
                        <ShareBtn type="POST" id={id} istext={true} />
                    </Flex>
                    {user?.userId === Id &&
                        <Flex onClick={() => deleteHandler()} as={"button"} w={"full"} color={"#E90303"} h={"60px"} borderColor={borderColor} borderBottomWidth={"1px"} justifyContent={"center"} alignItems={"center"} >
                            Delete Content
                        </Flex>
                    }
                    <Flex onClick={() => reportHandler()} as={"button"} w={"full"} h={"60px"} borderColor={borderColor} borderBottomWidth={"1px"} justifyContent={"center"} alignItems={"center"} >
                        Report User
                    </Flex>
                    <Flex onClick={() => setOpen(false)} as={"button"} w={"full"} color={"#E90303"} h={"60px"} justifyContent={"center"} alignItems={"center"} >
                        Cancel
                    </Flex>
                </Flex>
            </ModalLayout>

            <ModalLayout open={deleteModal} close={setDeleteModal} size={"xs"} >
                <Flex width='100%' bg={mainBackgroundColor} justifyContent={'center'} height='100%' alignItems={'center'} gap={"3"} p={"5"} flexDir={"column"} >
                    <Image alt='delete' src='/assets/images/deleteaccount.svg' />
                    <CustomText textAlign={'center'} fontSize={'20px'}>Delete Post</CustomText>
                    <CustomText textAlign={'center'} fontSize={'16px'} >Are you sure you want to delete this Post? this action cannot be undone.</CustomText>

                    <Button isDisabled={deletingPost} isLoading={deletingPost} onClick={() => deletePost(id)} width='100%' height='42px' bg='red' color="white" variant='solid'>Delete</Button>
                    <Button onClick={() => setDeleteModal(false)} width='100%' height='42px' borderWidth={'0px'} variant='outline' outlineColor={borderColor}>Cancel</Button>
                </Flex>
            </ModalLayout>
            <ReportUserModal
                typeID={id}
                REPORT_TYPE="REPORT_USER"
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
            <ModalLayout size={["full", "full", "6xl"]} open={openComments} close={setOpenComments} >
                <CommentSection close={setOpenComments} count={count} liked={liked} likesHandle={clickHandleLike} loadingLikes={loadingLikes} content={props} numberComments={numberComments+""} />
            </ModalLayout>
            <ModalLayout size={"2xl"} open={openImage} close={setOpenImage} >
                <Flex bg={"black"} flexDir={"column"} w={"full"} position={"relative"}  >
                    <Box zIndex={"10"} onClick={()=> setOpenImage(false)} position={"absolute"} top={"4"} right={"4"} >
                        <IoCloseCircleOutline size={"30px"} color='white' />
                    </Box>
                    <ImageSlider objectFit={true} limited={true} links={multipleMediaRef} type="feed" />
                    {/* <Flex w={"full"} justifyContent={"end"} py={"4"} >
                        <CustomButton onClick={() => setOpenImage(false)} text={"Close"} width={"fit-content"} px={"7"} />
                    </Flex> */}
                </Flex>
            </ModalLayout>
            <BottomSheetComment open={openMobile} setOpen={setOpenMobile} count={count} liked={liked} likesHandle={clickHandleLike} loadingLikes={loadingLikes} content={props} numberComments={numberComments+""}  />
        </Flex>
    )
} 