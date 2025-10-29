"use client";
import { Box, Button, Flex, Text, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react"; 
import ModalLayout from "../modal_layout";
import SendMessage from "@/components/modals/send_message";
import SendMesageModal from "@/components/modals/send_message/send_to_app_user";
import { 
  HomeShareIcon, 
} from "@/components/svg"; 
import Qr_code from "@/components/modals/send_message/Qr_code"; 
import CustomText from "@/components/general/Text";
import useCustomTheme from "@/hooks/useTheme";
import { HiOutlineShare } from "react-icons/hi";

interface Props {
  id: any;
  size?: string;
  isprofile?: boolean;
  istext?: boolean;
  type: string;
  eventName?: string;
  data?: any;
  showText?: boolean;
  home?: boolean;
  notext?: boolean;
  community?: boolean;
  color?: string;
  newbtn?: boolean,
  name?: string
}

function ShareEvent(props: Props) {
  const {
    id,
    size,
    isprofile,
    istext,
    eventName,
    data,
    showText = true,
    home,
    type,
    notext,
    community,
    color,
    newbtn,
    name
  } = props;

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(1);

  const {
    bodyTextColor,
    mainBackgroundColor,
    headerTextColor,
    secondaryBackgroundColor,
    primaryColor,
  } = useCustomTheme();
  const { colorMode } = useColorMode();

  const CloseModal = () => {
    setOpen(false);
    setTab(1);
  };

  const clickHandler = (event: any) => {
    event.stopPropagation();
    setOpen(true);
  }; 

  return (
    <>
      {!community && (
        <Box

          width={"fit-content"}
          zIndex={"20"}
          mt={size === "18px" ? "10px" : "0px"}
        >
          {isprofile && !istext && (
            <Box mt={"2px"} onClick={(e: any) => clickHandler(e)} as={"button"}>
              <HiOutlineShare color={bodyTextColor} />
            </Box>
          )}
          {isprofile && istext && (
            <Text onClick={(e: any) => clickHandler(e)} as={"button"}>
              Share
            </Text>
          )}
          {!isprofile && (
            <>
              {home && (
                <Flex
                  onClick={(e: any) => clickHandler(e)}
                  as="button"
                  w={"41px"}
                  height={"44px"}
                  justifyContent={"center"}
                  flexDir={"column"}
                  alignItems={"center"}
                >
                  <Flex
                    width={"24px"}
                    h={"30px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <HomeShareIcon color={bodyTextColor} />
                  </Flex>
                  {!notext && (
                    <CustomText
                      textColor={
                        colorMode === "light" ? "#00000099" : bodyTextColor
                      }
                      fontFamily={"DM-Bold"}
                      fontSize="10px"
                    >
                      share
                    </CustomText>
                  )}
                </Flex>
              )}
              {!home && (
                <Box
                  onClick={(e: any) => clickHandler(e)}
                  as="button"
                  display={"flex"}
                  alignItems={"center"}
                  flexDir={"column"}
                >
                  {newbtn && (
                    <HiOutlineShare
                      width={size ? size : "24px"}
                      color={color ? colorMode !== "light" ? "#3C41F0" : color : colorMode === "light" ? "#3C41F0" : bodyTextColor}
                    />
                  )}
                  {!newbtn && (
                    <HiOutlineShare
                      size={size ? size : "14px"}
                      color={color ? colorMode !== "light" ? "#3C41F0" : color : colorMode === "light" ? "#3C41F0" : bodyTextColor}
                    />
                  )}
                  {showText && (
                    <Text
                      color={colorMode === "light" ? "#3C41F0" : bodyTextColor}
                      fontSize={"9px"}
                      fontWeight={"semibold"}
                    >
                      share
                    </Text>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      )}
      {community && (
        <Button onClick={() => setOpen(true)} w={"76px"} h={"64px"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} p={"0px"} bg={mainBackgroundColor} rounded={"12px"} style={{ boxShadow: "0px 1px 3px 1px #0000001A" }} outline={"none"} _hover={{ backgroundColor: mainBackgroundColor }} >
          <Flex justifyContent={"center"} alignItems={"center"} w={"30px"} color={"#5D70F9"} h={"30px"} >
            <HiOutlineShare color={"#5D70F9"} />
          </Flex>
          <Text fontWeight={"500"} fontSize={"13px"} textAlign={"center"} color={"#5D70F9"} >Share</Text>
        </Button>
      )}

      <ModalLayout
        open={open}
        close={CloseModal}
        titlecolor={tab === 3 ? primaryColor : bodyTextColor}
        title={tab === 1 ? "Share" : tab === 2 ? "Share with friends" : ""}
        bg={secondaryBackgroundColor}
      >
        {tab === 1 && (
          <SendMessage
            data={data}
            isprofile={isprofile}
            type={props.type}
            id={id}
            click={setTab}
            eventName={eventName}
          />
        )}
        {tab === 2 && (
          <SendMesageModal
            type={props.type}
            isprofile={isprofile}
            id={id}
            onClose={CloseModal}
          />
        )}
        {tab === 3 && <Qr_code data={data} close={CloseModal} id={id} />}
      </ModalLayout>
    </>
  );
}

export default ShareEvent;
