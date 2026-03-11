import { Box, VStack, Image, HStack, Button, useColorMode, Flex } from '@chakra-ui/react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import React from 'react'
import { IMAGE_URL } from '@/services/urls'
import { useImageModalState } from '@/components/general/ImageModal/imageModalState'
import useCustomTheme from "@/hooks/useTheme";
import VideoPlayer from '@/components/general/VideoPlayer'

const FileViewer = ({ file, newupdate, objectFit }: { file: File, newupdate?: boolean, objectFit?: boolean }) => {
    return (
        <Box width={newupdate ? '100%' : '500px'} height={newupdate ? '100%' : '400px'} overflow={'hidden'} zIndex={2}>
            <Image src={URL.createObjectURL(file)} alt='image' width={'100%'} height={'100%'} rounded={"16px"} roundedTopRight={"0px"} objectFit={objectFit ? "contain" : 'cover'} />
        </Box>
    )
}

const ImageViewer = ({ file, limited }: { file: string, limited?: boolean }) => {
    return (
        <Flex width='100%' height='100%' overflow={'hidden'} zIndex={2}>
            {file?.substr(file.length - 3) === "mp4" ? (
                <Box width='100%' height='100%'>
                    <VideoPlayer
                        src={`${file}`}
                        measureType="px"
                    />
                </Box>
            ) : (
                <Box width='100%' height={limited ? '400px' : '100%'} >
                    {file?.startsWith('https://') && <Image src={`${file}`} alt='image' w={"full"} h={"full"} rounded={"16px"} roundedTopRight={"0px"} objectFit={"contain"} />}
                    {!file?.startsWith('https://') && <Image src={`${IMAGE_URL}${file}`} alt='image' style={{ width: '100%', height: '100%' }} rounded={"16px"} roundedTopRight={"0px"} objectFit={"contain"} />}
                </Box>
            )
            }
        </Flex>
    )
}

function ImageSlider({ files, newupdate, type, links, setCurrentIndex, objectFit, limited }: {
    files?: File[],
    type: 'feed' | 'upload',
    links?: string[],
    goBack?: () => void,
    newupdate?: boolean,
    setCurrentIndex?: (index: number) => void,
    objectFit?: boolean,
    limited?: boolean
}) {
    const [index, setIndex] = React.useState(0);
    const { setAll } = useImageModalState((state) => state);

    const { bodyTextColor, primaryColor, secondaryBackgroundColor, mainBackgroundColor, borderColor } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();


    const handleImageClick = () => {
        setAll({ images: links as string[], isOpen: true })
    } 

    const goForward = React.useCallback((e: any) => {
        e.stopPropagation()
        if (type === 'upload') {
            if (index < (files as File[])?.length - 1) {
                setIndex(index + 1);
                if (setCurrentIndex) {
                    setCurrentIndex(index + 1);
                }
            } else {
                setIndex(0);
                if (setCurrentIndex) {
                    setCurrentIndex(0);
                }
                return;
            }
        } else {
            if (index < (links as string[])?.length - 1) {
                setIndex(index + 1);
                if (setCurrentIndex) {
                    setCurrentIndex(0);
                }
            } else {
                setIndex(0);
                if (setCurrentIndex) {
                    setCurrentIndex(0);
                }
                return;
            }
        }

    }, [type, index, files, links])

    const goBackward = React.useCallback((e: any) => {
        e.stopPropagation()
        if (type === 'upload') {
            if (index > 0) {
                setIndex(index - 1);
                if (setCurrentIndex) {
                    setCurrentIndex(index - 1);
                }

            } else {
                setIndex((files as File[])?.length - 1);
                if (setCurrentIndex) {
                    setCurrentIndex((files as File[])?.length - 1);
                }
                return;
            }
        } else {
            if (index > 0) {
                setIndex(index - 1);
                if (setCurrentIndex) {
                    setCurrentIndex(index - 1);
                }
            } else {
                setIndex((links as string[])?.length - 1);
                if (setCurrentIndex) {
                    setCurrentIndex((links as string[])?.length - 1);
                }
                return;
            }
        }
    }, [index, type])

    return (
        <Flex flexDirection={"column"} width='100%' bg={"black"} height='100%'>

            <HStack width={'100%'} height={(links as string[])?.length < 2 || (files as File[])?.length < 2 ? '100%' : '90%'} position={'relative'} zIndex={1}>

                {/* LEFT ARROW */}
                {type === 'feed' && (links as string[])?.length > 1 && (
                    <VStack  height={'100%'} width={'50px'} left='0' position={'absolute'} justifyContent={'center'} alignItems={'center'} >
                        <VStack cursor='pointer' justifyContent={'center'} width='40px' height={'40px'} borderRadius={'50%'} position={"relative"} zIndex={"20"} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} onClick={goBackward} >
                            <FiArrowLeft size={'30px'} color='white' />
                        </VStack>
                    </VStack>
                )}

                {type === 'upload' && (files as File[])?.length > 1 && (
                    <VStack  height={'100%'} width={'50px'} left='0' position={'absolute'} justifyContent={'center'} alignItems={'center'} >
                        <VStack cursor='pointer' justifyContent={'center'} width='40px' height={'40px'} borderRadius={'50%'} position={"relative"} zIndex={"20"} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} onClick={goBackward} >
                            <FiArrowLeft size={'30px'} color='white' />
                        </VStack>
                    </VStack>
                )}

                {type === 'upload' && <FileViewer file={(files as File[])[index]} objectFit={objectFit} />}
                {type === 'feed' && (
                    <Box width='100%' height='100%' pos={"relative"} zIndex={"10"} onClick={handleImageClick}>
                        <ImageViewer limited={limited} file={(links as string[])[index]} />
                    </Box>
                )}

                {/* RIGHT ARROW */}
                {type === 'upload' && (files as File[])?.length > 1 && (
                    <VStack zIndex='10' height={'100%'} width={'50px'} right='0' position='absolute' justifyContent={'center'} alignItems={'center'} >
                        <VStack cursor='pointer' justifyContent={'center'} width='40px'  position={"relative"} zIndex={"20"} height={'40px'} borderRadius={'50%'} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} onClick={goForward} >
                            <FiArrowRight size={'30px'} color='white' />
                        </VStack>
                    </VStack>
                )}

                {type === 'feed' && (links as string[])?.length > 1 && (
                    <VStack height={'100%'} width={'50px'} right='0' position='absolute' justifyContent={'center'} alignItems={'center'} >
                        <VStack cursor='pointer' justifyContent={'center'} width='40px' position={"relative"} zIndex={"20"} height={'40px'} borderRadius={'50%'} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} onClick={goForward} >
                            <FiArrowRight size={'30px'} color='white' />
                        </VStack>
                    </VStack>
                )}

            </HStack>

            {type === 'feed' && (links as string[])?.length > 1 && (
                <HStack justifyContent={'center'} pb={"3"} width='100%' height={'10%'} >
                    {links?.map((item, indx) => (
                        <Box key={indx.toString()} marginX='2px' width={index === indx ? '10px' : '5px'} height={index === indx ? '10px' : '5px'} bg={index === indx ? 'brand.chasescrollButtonBlue' : 'lightgrey'} borderRadius={'10px'} />
                    ))}
                </HStack>
            )}

            {type === 'upload' && (files as File[])?.length > 1 && (
                <HStack justifyContent={'center'} pb={"3"} alignItems={'center'} width='100%' height={'10%'} >
                    {files?.map((item, indx) => (
                        <Box key={indx.toString()} marginX='2px' width={index === indx ? '10px' : '5px'} height={index === indx ? '10px' : '5px'} bg={index === indx ? 'brand.chasescrollButtonBlue' : 'lightgrey'} borderRadius={'10px'} />
                    ))}
                </HStack>
            )}

        </Flex>
    )
}

export default ImageSlider