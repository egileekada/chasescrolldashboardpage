import { Box, Flex, HStack, Image } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import SelectImages from '../modals/mediapostPages/SelectImages'
import useHome from '@/hooks/useHome'
import { Gallery, Video } from 'iconsax-react'
import CustomText from '../general/Text'
import useCustomTheme from '@/hooks/useTheme'
import ShowImages from '../modals/mediapostPages/ShowImages'
import ImageSlider from '../modals/mediapostPages/ImageSlider'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

interface IProps {
    files: Array<File>,
    handleImagePicked: any,
    fileIndex: number,
    setFileIndex?: any
}

export default function UploadImage({ handleImagePicked, files, fileIndex, setFileIndex }: IProps) {
    const [url, setUrl] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    const [over, setOver] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [stage, setStage] = React.useState(1);

    const {
        bodyTextColor,
    } = useCustomTheme();

    const handlePick = React.useCallback((data: FileList) => {
        handleImagePicked(data);
    }, [handleImagePicked]);

    const goForward = () => {
        if ((files?.length - 1) === fileIndex) {
            setFileIndex(0)
        } else {
            setFileIndex((prev: any) => prev + 1)
        }
    }

    const goBack = () => {
        if (fileIndex === 0) {
            setFileIndex(files?.length - 1)
        } else {
            setFileIndex((prev: any) => prev - 1)
        }
    }



    React.useEffect(() => {
        if (files.length > 0 && files[0].type.startsWith('video')) {
            const fileReader = new FileReader();

            fileReader.onload = () => {
                setIsLoading(false);
                setUrl(fileReader.result as string);
            }
            fileReader.readAsDataURL(files[fileIndex]);
        }
    }, [fileIndex]);

    return (
        <>
            {files?.length <= 0 ? (
                <Flex as={"button"} onClick={() => inputRef.current?.click()} w={"full"} h={"full"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} rounded={"lg"} borderWidth={"1px"} borderStyle={"dashed"} onDragOver={() => setOver(true)} onDragLeave={() => setOver(false)} >
                    <input hidden type='file' accept="image/*, video/*" ref={inputRef as any} onChange={(e) => handlePick(e.target.files as FileList)} />
                    <HStack justifyContent={'center'}>
                        <Gallery size={25} color={bodyTextColor} />
                        <Video size={25} color={bodyTextColor} />
                    </HStack>
                    <CustomText width='50%' textAlign={'center'} fontSize={'md'} color={bodyTextColor}>Click to add pictures and video here </CustomText>
                </Flex>
            ) : (
                <Flex width={'100%'} height={'100%'} pos={"relative"} borderWidth={"1px"} justifyContent={"center"} alignItems={"center"} overflow={'hidden'} zIndex={2} rounded={"16px"} roundedTopRight={"0px"} >
                    {files?.length > 1 && (
                        <Flex onClick={goBack} pos={"absolute"} left={"1"} as='button' width='40px' height={'40px'} borderRadius={'50%'} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} zIndex={"10"} justifyContent={"center"} alignItems={"center"} >
                            <FiArrowLeft size={'30px'} color='white' />
                        </Flex>
                    )} 
                    {files[fileIndex].type.startsWith('video') ? (
                        <video controls width={'100%'} height={'100%'}>
                            <source src={URL.createObjectURL(files[fileIndex])} type='video/mp4' />
                        </video>
                    ) : (
                        <Image src={URL.createObjectURL(files[fileIndex])} alt='image' width={'100%'} height={'100%'} rounded={"16px"} roundedTopRight={"0px"} objectFit={'cover'} />
                    )}
                    {files?.length > 1 && (
                        <Flex onClick={goForward} pos={"absolute"} right={"1"} as='button' width='40px' height={'40px'} borderRadius={'50%'} bg='#02020285' _hover={{ backgroundColor: '#02020285' }} zIndex={"10"} justifyContent={"center"} alignItems={"center"} >
                            <FiArrowRight size={'30px'} color='white' />
                        </Flex>
                    )}
                </Flex>
            )}
        </>
    )
}
