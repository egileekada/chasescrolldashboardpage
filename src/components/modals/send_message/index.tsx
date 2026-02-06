
import CopyButtton from "@/components/sharedComponent/copy_btn";
import EventPrice from "@/components/sharedComponent/event_price";
import useCustomTheme from "@/hooks/useTheme";
import { IMAGE_URL, SHARE_URL } from "@/services/urls";
import { textLimit } from "@/utils/textlimit";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  // MailruShareButton,
  WhatsappShareButton,
} from "react-share";

interface Props {
  id: any;
  click: any;
  isprofile?: boolean;
  type?: string;
  eventName?: string;
  data?: any;
}

function SendMessage(props: Props) {
  const { id, click, isprofile, type, data } = props;

  const {
    bodyTextColor,
    primaryColor,
    secondaryBackgroundColor, 
  } = useCustomTheme(); 

  const url_link =
  type === "EVENT"
    ? `${SHARE_URL}${"/event?id="}${id}` :
      type === "RENTAL" ? `${SHARE_URL}${"/rental?id="}${id}`:
      type === "SERVICE" ? `${SHARE_URL}${"/service?id="}${id}`:
      type === "KIOSK" ? `${SHARE_URL}${"/product/"}${id}`:
      type === "DONATION" ? `${SHARE_URL}${"/fundraiser?id="}${id}`
      : `${SHARE_URL}/event?id=${id}`;

  const getUrl = () => {
    if(type === "EVENT"){
      return `${SHARE_URL}${"/event?id="}${id}`;
    } else if(type === "DONATION"){
          return `${SHARE_URL}${"/fundraiser?id="}${id}`;
    } else if(type === "RENTAL"){
      return `${SHARE_URL}${"/rental?id="}${id}`;
    } else if(type === "SERVICE"){
      return `${SHARE_URL}${"/service?id="}${id}`;
    } else if(type === "KIOSK"){
      return `${SHARE_URL}${"/product/"}${id}`;
    } else {
      return `${SHARE_URL}${"/event?id="}${id}`
    }  
  }

  const handleType = () => {
    switch (props.type) {
      case "COMMUNITY": {
        return "Share community";
      }
      case "POST": {
        return "Share post";
      }
      case "RENTAL": {
        return "Share rental";
      }
      case "SERVICE": {
        return "Share service";
      }
      case "KIOSK": {
        return "Share kiosk";
      }
      case "DONATION": {
        return "Share fundraising";
      }
      case "PROFILE": {
        return "Share profile";
      }
      case "EVENT": {
        return "Spread the word about our upcoming event by sharing a custom link with your friends and colleagues.";
      }
      case "BUSINESS": {
        return " Spread the word about your business by sharing a custom link with your customers and friends."
      }
    }
  };

  const handle = () => {
    switch (props.type) {
      case "COMMUNITY": {
        return "Share community";
      }
      case "POST": {
        return "Share post";
      }
      case "RENTAL": {
        return "Share rental";
      }
      case "SERVICE": {
        return "Share service";
      }
      case "KIOSK": {
        return "Share kiosk";
      }
      case "DONATION": {
        return "Share fundraising";
      }
      case "PROFILE": {
        return "Share profile";
      }
      case "EVENT": {
        return "Spread the word about our upcoming event by sharing a custom link with your friends and colleagues.";
      }
      case "BUSINESS": {
        return "Share this Business";
      }
    }
  };

  return (
    <Flex
      width={"full"}
      justifyContent={"center"}
      pb={"7"}
      px={"8"}
      flexDir={"column"}
      bg={secondaryBackgroundColor}
    >
      {type !== "EVENT" && (
        <Text
          color={bodyTextColor}
          mt={"4"}
          lineHeight={"18px"}
          textAlign={"center"}
        >
          {handleType()}
        </Text>
      )}
      {type !== "EVENT" && (
        <>
          <Text
            mb={"1"}
            mt={"6"}
            fontWeight={"semibold"}
            fontSize={"sm"}
            color={bodyTextColor}
          >
            {isprofile ? "Profile link" : "Event link"}
          </Text>
          <CopyButtton text={getUrl()} />
        </>
      )}

      {type === "EVENT" && (
        <Box
          style={{
            background:
              "linear-gradient(0deg, rgba(18, 18, 18, 0.10) 0%, rgba(18, 18, 18, 0.10) 100%), linear-gradient(107deg, rgba(93, 112, 249, 0.39) -9.73%, #1732F7 116.02%)",
          }}
          rounded={"12px"}
          py={"15px"}
          px={"24px"}
        >
          <Flex alignItems={"center"} mb={"8px"} gap={"4"}>
            <Box width={"120px"} height={"80px"} rounded={"8px"}>
              {data?.name && (
                <Image rounded={"8px"} objectFit="cover" alt={data?.name} width={"full"} height={"full"} src={IMAGE_URL + data?.bannerImage} />
              )}
              {!data?.name && (
                <Image
                  style={{
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                    borderTopLeftRadius: "8px",
                  }}
                  objectFit="cover"
                  alt={data?.currentPicUrl}
                  width={"full"}
                  height={"full"}
                  src={IMAGE_URL + data?.currentPicUrl}
                />
              )}
            </Box>
            <Box color={"white"} fontWeight={"semibold"}>
              <Text>{textLimit(data?.eventName ? data?.eventName : data?.name, 20)}</Text>
              {data?.name && (
                <Text>{textLimit(data?.description, 30)}</Text>
              )}
              {data?.eventName && (
                <Flex>
                  <Text>
                    <EventPrice
                      minPrice={data?.minPrice}
                      maxPrice={data?.maxPrice}
                      currency={data?.currency}
                    />
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
          <CopyButtton rounded={"32px"} text={url_link} />
        </Box>
      )}
      <Text py={"5"} textAlign={"center"}>
        via
      </Text>
      {props.type === "EVENT" && (
        <Flex width={"full"} pb={"5"} justifyContent={"center"}>
          <Flex
            onClick={() => click(3)}
            as={"button"}
            alignItems={"center"}
            w={"80%"}
            justifyContent={"center"}
            py={"2"}
            borderWidth={"1px"}
            rounded={"32px"}
            borderColor={"#C4C4C475"}
            gap={"1"}
            color={"#121212CC"}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="vuesax/linear/scan">
                <g id="scan">
                  <path
                    id="Vector"
                    d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector_2"
                    d="M15 2H17.5C19.99 2 22 4.01 22 6.5V9"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector_3"
                    d="M22 16V17.5C22 19.99 19.99 22 17.5 22H16"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector_4"
                    d="M9 22H6.5C4.01 22 2 19.99 2 17.5V15"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector_5"
                    d="M17 9.5V14.5C17 16.5 16 17.5 14 17.5H10C8 17.5 7 16.5 7 14.5V9.5C7 7.5 8 6.5 10 6.5H14C16 6.5 17 7.5 17 9.5Z"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    id="Vector_6"
                    d="M19 12H5"
                    stroke={primaryColor}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </g>
            </svg>
            <Text color={bodyTextColor}>Get QR Code</Text>
          </Flex>
        </Flex>
      )}
      <Flex width={"full"} justifyContent={"space-evenly"}>
        <WhatsappShareButton url={url_link}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="42"
            viewBox="0 0 43 42"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.5 40.6875C31.6482 40.6875 39.875 32.4607 39.875 22.3125C39.875 12.1643 31.6482 3.9375 21.5 3.9375C11.3518 3.9375 3.125 12.1643 3.125 22.3125C3.125 25.608 3.99256 28.7009 5.51175 31.3753L3.125 40.6875L12.7258 38.4612C15.3331 39.8809 18.3223 40.6875 21.5 40.6875ZM21.5 37.8606C30.087 37.8606 37.0481 30.8995 37.0481 22.3125C37.0481 13.7255 30.087 6.76442 21.5 6.76442C12.913 6.76442 5.95192 13.7255 5.95192 22.3125C5.95192 25.628 6.98966 28.701 8.75804 31.2247L7.36538 36.4471L12.6799 35.1185C15.186 36.8479 18.2248 37.8606 21.5 37.8606Z"
              fill="#BFC8D0"
            />
            <path
              d="M37.25 21C37.25 29.6985 30.1985 36.75 21.5 36.75C18.1822 36.75 15.104 35.7241 12.5654 33.9723L7.18182 35.3182L8.59256 30.0279C6.80121 27.4715 5.75 24.3585 5.75 21C5.75 12.3015 12.8015 5.25 21.5 5.25C30.1985 5.25 37.25 12.3015 37.25 21Z"
              fill="url(#paint0_linear_1180_46679)"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.5 39.375C31.6482 39.375 39.875 31.1482 39.875 21C39.875 10.8518 31.6482 2.625 21.5 2.625C11.3518 2.625 3.125 10.8518 3.125 21C3.125 24.2955 3.99256 27.3884 5.51175 30.0628L3.125 39.375L12.7258 37.1487C15.3331 38.5684 18.3223 39.375 21.5 39.375ZM21.5 36.5481C30.087 36.5481 37.0481 29.587 37.0481 21C37.0481 12.413 30.087 5.45192 21.5 5.45192C12.913 5.45192 5.95192 12.413 5.95192 21C5.95192 24.3155 6.98966 27.3885 8.75804 29.9122L7.36538 35.1346L12.6799 33.806C15.186 35.5354 18.2248 36.5481 21.5 36.5481Z"
              fill="white"
            />
            <path
              d="M16.9063 12.4688C16.4694 11.5912 15.7992 11.6689 15.1221 11.6689C13.9121 11.6689 12.0254 13.1183 12.0254 15.8157C12.0254 18.0264 12.9995 20.4463 16.282 24.0663C19.4499 27.5599 23.6123 29.3671 27.0679 29.3056C30.5235 29.2441 31.2344 26.2704 31.2344 25.2662C31.2344 24.8211 30.9582 24.599 30.7679 24.5387C29.5903 23.9735 27.4185 22.9205 26.9243 22.7227C26.4302 22.5248 26.1721 22.7924 26.0117 22.938C25.5636 23.3651 24.6753 24.6237 24.3711 24.9068C24.067 25.1899 23.6135 25.0466 23.4248 24.9396C22.7304 24.6609 20.8476 23.8234 19.3468 22.3686C17.4907 20.5694 17.3818 19.9503 17.0321 19.3993C16.7524 18.9585 16.9577 18.688 17.0601 18.5698C17.46 18.1084 18.0122 17.396 18.2598 17.042C18.5074 16.688 18.3108 16.1505 18.1929 15.8157C17.6856 14.376 17.2558 13.1708 16.9063 12.4688Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1180_46679"
                x1="35.2812"
                y1="9.1875"
                x2="5.75"
                y2="36.75"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#5BD066" />
                <stop offset="1" stop-color="#27B43E" />
              </linearGradient>
            </defs>
          </svg>
        </WhatsappShareButton>

        <FacebookShareButton
          url={url_link}
          quote={"Dummy text!"}
          hashtag="#muo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="42"
            viewBox="0 0 43 42"
            fill="none"
          >
            <circle
              cx="21.5"
              cy="21"
              r="18.375"
              fill="url(#paint0_linear_1180_46680)"
            />
            <path
              d="M28.343 26.6195L29.1592 21.4333H24.0531V18.0692C24.0531 16.65 24.7651 15.2658 27.0521 15.2658H29.375V10.8504C29.375 10.8504 27.2678 10.5 25.2541 10.5C21.047 10.5 18.2997 12.9845 18.2997 17.4805V21.4333H13.625V26.6195H18.2997V39.1578C19.2382 39.3014 20.1983 39.375 21.1764 39.375C22.1545 39.375 23.1146 39.3014 24.0531 39.1578V26.6195H28.343Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1180_46680"
                x1="21.5"
                y1="2.625"
                x2="21.5"
                y2="39.266"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#18ACFE" />
                <stop offset="1" stop-color="#0163E0" />
              </linearGradient>
            </defs>
          </svg>
        </FacebookShareButton>
        <Image
          role="button"
          onClick={() => click(2)}
          src="/assets/images/chasescroll-logo.png"
          width={"43px"}
          height={"42px"}
          alt="logo"
        />
        {/* <img onClick={() => click(2)} src='/logoicon.png' role='button' alt='log' /> */}
        <LinkedinShareButton url={url_link}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="43"
            height="42"
            viewBox="0 0 43 42"
            fill="none"
          >
            <rect
              x="3.125"
              y="2.625"
              width="36.75"
              height="36.75"
              rx="18.375"
              fill="#0B83ED"
            />
            <path
              d="M17.0619 12.7209C17.0619 13.9475 15.9987 14.9419 14.6872 14.9419C13.3757 14.9419 12.3125 13.9475 12.3125 12.7209C12.3125 11.4944 13.3757 10.5 14.6872 10.5C15.9987 10.5 17.0619 11.4944 17.0619 12.7209Z"
              fill="white"
            />
            <path
              d="M12.6372 16.5744H16.6965V28.875H12.6372V16.5744Z"
              fill="white"
            />
            <path
              d="M23.232 16.5744H19.1727V28.875H23.232C23.232 28.875 23.232 25.0026 23.232 22.5814C23.232 21.1281 23.7282 19.6685 25.7081 19.6685C27.9457 19.6685 27.9322 21.5703 27.9218 23.0437C27.9082 24.9696 27.9407 26.9349 27.9407 28.875H32V22.383C31.9656 18.2377 30.8855 16.3276 27.3318 16.3276C25.2215 16.3276 23.9133 17.2857 23.232 18.1525V16.5744Z"
              fill="white"
            />
          </svg>
        </LinkedinShareButton> 
        <EmailShareButton url={url_link} subject="ChaseScroll Event">
          <svg
            width="43"
            height="42"
            viewBox="0 0 43 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="vuesax/outline/sms">
              <g id="sms">
                <path
                  id="Vector"
                  d="M30.25 37.1875H12.75C6.3625 37.1875 2.6875 33.5125 2.6875 27.125V14.875C2.6875 8.4875 6.3625 4.8125 12.75 4.8125H30.25C36.6375 4.8125 40.3125 8.4875 40.3125 14.875V27.125C40.3125 33.5125 36.6375 37.1875 30.25 37.1875ZM12.75 7.4375C7.745 7.4375 5.3125 9.87 5.3125 14.875V27.125C5.3125 32.13 7.745 34.5625 12.75 34.5625H30.25C35.255 34.5625 37.6875 32.13 37.6875 27.125V14.875C37.6875 9.87 35.255 7.4375 30.25 7.4375H12.75Z"
                  fill="#1845C6"
                />
                <path
                  id="Vector_2"
                  d="M21.4999 22.5224C20.0299 22.5224 18.5424 22.0674 17.4049 21.1399L11.9274 16.765C11.3674 16.31 11.2624 15.4874 11.7174 14.9274C12.1724 14.3674 12.9949 14.2625 13.5549 14.7175L19.0323 19.0925C20.3623 20.16 22.6198 20.16 23.9498 19.0925L29.4274 14.7175C29.9874 14.2625 30.8274 14.3499 31.2649 14.9274C31.7199 15.4874 31.6324 16.3275 31.0549 16.765L25.5774 21.1399C24.4574 22.0674 22.9699 22.5224 21.4999 22.5224Z"
                  fill="#1845C6"
                />
              </g>
            </g>
          </svg>
        </EmailShareButton>
      </Flex>
    </Flex>
  );
}

export default SendMessage;
