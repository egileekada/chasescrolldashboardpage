import CustomButton from '@/components/general/Button'
import { URLS } from '@/services/urls';
import httpService from '@/utils/httpService';
import { Flex, Input, Text, useColorMode, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from 'react-query';
import StripePopup from '@/components/event_details_component/event_modal/stripe_btn/stripe_popup';
import ModalLayout from '@/components/sharedComponent/modal_layout';
import { useDetails } from '@/global-state/useUserDetails';
import Fundpaystack from './fundpaystack';
import useModalStore from '@/global-state/useModalSwitch';
import useSettingsStore from '@/global-state/useSettingsState';
import useCustomTheme from "@/hooks/useTheme";
import usePaystackStore from '@/global-state/usePaystack';

interface Props {
    currency: string
}

function FundWallet(props: Props) {
    const {
        currency
    } = props

    const {
        bodyTextColor,
        primaryColor,
        secondaryBackgroundColor,
        mainBackgroundColor,
        borderColor,
        headerTextColor
    } = useCustomTheme();
    const { colorMode, toggleColorMode } = useColorMode();

    const { email } = useDetails((state) => state);
    const { open, setOpen } = useModalStore((state) => state);
    const STRIPE_KEY: any = process.env.NEXT_PUBLIC_STRIPE_KEY;
    const PAYSTACK_KEY: any = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

    const stripePromise = loadStripe(STRIPE_KEY);

    const { amount, setAmount } = useSettingsStore((state) => state);
    const { message } = usePaystackStore((state) => state);
    const [clientSecret, setClientSecret] = React.useState("");
    // const [open, setOpen] = React.useState(false)
    const [configData, setconfigData] = React.useState({} as any);
    const toast = useToast()
    const [config, setConfig,] = React.useState({} as any)
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

    const createTicket = useMutation({
        mutationFn: (data: any) => httpService.post(URLS.FUND_WALLET, data),
        onSuccess: (data: any) => {
            console.log(data);

            if (currency === "USD") {
                setconfigData({
                    reference: data?.data?.transactionID,
                    amount: data?.data?.totalAmount
                })
                setClientSecret(data?.data?.clientSecret)
                setOpen(true)
            } else {
                setConfig({
                    email: email,
                    amount: (Number(data?.data?.totalAmount)), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
                    publicKey: PAYSTACK_KEY,
                    reference: data?.data?.transactionID
                });
            }

        },
        onError: () => {
            toast({
                title: 'Error',
                description: "Error Creating Ticket",
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
        },
    });

    const clickHandler = React.useCallback(() => {
        createTicket.mutate({
            "currency": currency,
            "amount": amount
        })
    }, [createTicket])

    return (
        <Flex width={"full"} pt={"8"} gap={"4"} flexDirection={"column"} alignItems={"center"} >
            <Text fontWeight={"semibold"} >Enter Amount</Text>
            <Input value={amount} onChange={handleChange} width={"full"} textAlign={"center"} borderColor={"transparent"} focusBorderColor="transparent" placeholder={currency === "USD" ? '$0.00' : "₦0.00"} _placeholder={{ color: bodyTextColor }} fontSize={"20px"} _hover={{ color: bodyTextColor }} />
            <CustomButton isLoading={createTicket.isLoading} disable={createTicket.isLoading} onClick={() => clickHandler()} text='Fund' marginTop={"4"}
                backgroundColor={"#5465E0"}
                borderRadius={"32px"}
                height={"54px"} />

            <Fundpaystack message={message} fund={true} config={config} setConfig={setConfig} />
            <ModalLayout open={open} close={setOpen} title='Fund Wallet' >
                <StripePopup fund={true} stripePromise={stripePromise} clientSecret={clientSecret} configData={configData} />
            </ModalLayout>
        </Flex>
    )
}

export default FundWallet

