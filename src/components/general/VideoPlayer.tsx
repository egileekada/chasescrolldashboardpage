'use client';
import { Box, HStack, VStack } from '@chakra-ui/react';
import React, { useRef } from 'react'
import { Play, Pause, Maximize2, VolumeSlash, VolumeHigh } from 'iconsax-react'
import { THEME } from '@/theme';
import { IMAGE_URL } from '@/services/urls';

function VideoPlayer({
  src, width = 100, height = 350, measureType = 'px', rounded = "0px"
}: {
  src: string,
  width?: number;
  height?: number;
  measureType: 'px' | '%',
  rounded?: string
}) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [showControl, setShowControl] = React.useState(true);
  const [heightt, setHeight] = React.useState(0);
  const [wiidth, setWidth] = React.useState(0);
  const [inView, setInView] = React.useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        (videoRef.current as HTMLVideoElement).muted = true;
        // (videoRef.current as HTMLVideoElement).currentTime = 0;
        setIsPlaying(true);
        videoRef.current?.play();
      } else {
        setIsPlaying(false);
        videoRef.current?.pause();
      }
    }, {
      threshold: 1
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef?.current);
      }
    };
  }, [videoRef]);

  const hanldeMute = (e: any) => {

    e.stopPropagation()
    if (!isMuted) {
      setIsMuted(true);
      (videoRef.current as HTMLVideoElement).muted = true;
    } else {
      setIsMuted(false);
      (videoRef.current as HTMLVideoElement).muted = false;
    }
  }


  React.useEffect(() => {
    const video = boxRef.current;

    const handleLoadedMetadata = () => {
      const videoHeight = video?.clientHeight as number;
      const videoWidth = video?.clientWidth as number;
      const aspectRatio = videoWidth / videoHeight;
      const newHeight = 250 / aspectRatio;
      setWidth(videoWidth)
      setHeight(newHeight);
    };

    video?.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const handlePlayPause = React.useCallback((e: any) => {
    e.stopPropagation()
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleDoubleClick = (e: any) => {

    e.stopPropagation()
    // const video = videoRef.current;

    // if (videoRef.current?.paused) {
      videoRef.current?.requestFullscreen();
    // }
  };

  return (
    <Box ref={boxRef as any} bgColor={"black"} onMouseOver={() => setShowControl(true)} onMouseOut={() => setShowControl(false)} width={'100%'} height={'100%'} maxH={'full'} overflow={'hidden'} rounded={rounded} position={'relative'}>
      <video ref={videoRef as any} style={{ width: '100%', height: '100%', zIndex: 1, }} onEnded={() => {
        setIsPlaying(false);
        videoRef?.current?.pause();
      }}>
        <source type='video/mp4' src={src?.startsWith('https://') ? src : src?.startsWith('http://') ? src : IMAGE_URL+src} />
      </video>
      {
        showControl && (
          <HStack width='100%' height={'50px'} justifyContent={'space-between'} bg={'#00000054'} position={'absolute'} bottom={'0'} paddingX='10px' zIndex={10}>
            <HStack onClick={handlePlayPause} cursor={'pointer'} justifyContent='center' alignItems={'center'} width={'30px'} height={'30px'} borderRadius={'15px'} bg='white'>
              {!isPlaying && <Play size='20px' variant='Linear' color={THEME.COLORS.chasescrollButtonBlue} />}
              {isPlaying && <Pause size='20px' variant='Linear' color={THEME.COLORS.chasescrollButtonBlue} />}
            </HStack>

            <HStack>
              <HStack marginRight={'10px'} cursor={'pointer'} justifyContent='center' alignItems={'center'} width={'30px'} height={'30px'} borderRadius={'15px'} bg='white'>
                {isMuted && <VolumeSlash size='20px' variant='Linear' color={THEME.COLORS.chasescrollButtonBlue} onClick={hanldeMute} />}
                {!isMuted && <VolumeHigh size='20px' variant='Linear' color={THEME.COLORS.chasescrollButtonBlue} onClick={hanldeMute} />}
              </HStack>
              <HStack onClick={handlePlayPause} cursor={'pointer'} justifyContent='center' alignItems={'center'} width={'30px'} height={'30px'} borderRadius={'15px'} bg='white'>
                <Maximize2 onClick={handleDoubleClick} size='20px' variant='Linear' color={THEME.COLORS.chasescrollButtonBlue} />
              </HStack>
            </HStack>
          </HStack>
        )
      }
    </Box>
  )
}

export default VideoPlayer