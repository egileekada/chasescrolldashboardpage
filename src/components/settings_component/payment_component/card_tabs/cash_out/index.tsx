import React, { useState } from "react";
import { Flex, Text, Input, useColorMode } from "@chakra-ui/react";
import CashoutBtn from "./cashout_btn";
import useSettingsStore from "@/global-state/useSettingsState";
import CustomButton from "@/components/general/Button";
import { formatNumber } from "@/utils/numberFormat";
import useCustomTheme from "@/hooks/useTheme";

interface Props {
  currency: string;
}

function CashOut(props: Props) {
  const { currency } = props;

  const {
    bodyTextColor,
    mainBackgroundColor,
    headerTextColor,
    secondaryBackgroundColor,
    primaryColor,
  } = useCustomTheme();
  const { colorMode } = useColorMode();

  const { amount, setAmount } = useSettingsStore((state) => state);

  const [show, setShow] = useState(false);
  const [displayValue, setDisplayValue] = useState(""); // Store the formatted value with commas

  // Format number with commas
  const formatNumberData = (num: string) => {
    const number = num.replace(/,/g, ""); // Remove existing commas
    if (isNaN(Number(number))) return ""; // Return empty for non-numeric inputs
    return Number(number).toLocaleString(); // Format with commas
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/,/g, ""); // Remove commas from the input
    if (!isNaN(Number(inputValue))) {
      setAmount(inputValue); // Store raw number without commas
      setDisplayValue(formatNumberData(inputValue)); // Format and update display value
    }
  }; 

  return (
    <Flex
      width={"full"}
      pt={"8"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      {!show && (
        <Flex w={"full"} gap={"4"} alignItems={"center"} flexDir={"column"}>
          <Text fontWeight={"semibold"}>Enter Amount</Text>
          <Input
            value={amount}
            onChange={handleChange}
            width={"full"}
            // type="number"
            textAlign={"center"}
            borderColor={"transparent"}
            focusBorderColor="transparent"
            _placeholder={{ color: bodyTextColor }}
            color={bodyTextColor}
            placeholder={currency === "USD" ? "$0.00" : "₦0.00"}
            fontSize={"20px"}
            _hover={{ color: bodyTextColor }}
          />
        </Flex>
      )}
      {show && (
        <Flex w={"full"} gap={"4"} flexDir={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text lineHeight={"19.2px"} color={bodyTextColor}>
              Total Amount{" "}
            </Text>
            <Text lineHeight={"25.2px"} fontSize={"lg"} color={bodyTextColor}>
              {formatNumber(Number(amount), "₦")}
            </Text>
          </Flex>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text lineHeight={"19.2px"} color={bodyTextColor}>
              Service Fee
            </Text>
            <Text lineHeight={"25.2px"} fontSize={"lg"} color={bodyTextColor}>
              {formatNumber(Number(amount) * 0.03, "₦")}
            </Text>
          </Flex>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text lineHeight={"19.2px"} color={bodyTextColor}>
              Cashout Amount
            </Text>
            <Text
              lineHeight={"25.2px"}
              fontWeight={"bold"}
              fontSize={"lg"}
              color={bodyTextColor}
            >
              {formatNumber(Number(amount) - Number(amount) * 0.03, "₦")}
            </Text>
          </Flex>
        </Flex>
      )}
      {!show && (
        <CustomButton
          backgroundColor={"#5465E0"}
          borderRadius={"32px"}
          height={"54px"}
          disable={(!amount || Number(amount) <= 100) ? true : false}
          onClick={() => setShow(true)}
          text="Cash out"
          marginTop={"8"}
        />
      )}
      {show && (
        <Flex flexDir={"column"} gap={"3"} w={"full"}>
          <CashoutBtn setShow={setShow} currency={currency} amount={amount} />
          <CustomButton
            color={bodyTextColor}
            borderRadius={"32px"}
            height={"54px"}
            backgroundColor={secondaryBackgroundColor}
            border={"1px solid #5D70F980"}
            onClick={() => setShow(false)}
            text="Cancel"
          />
        </Flex>
      )}
    </Flex>
  );
}

export default CashOut;
