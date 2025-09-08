import React from 'react'
import { Box, useToast } from '@chakra-ui/react'
import ModalLayout from '@/components/sharedComponent/modal_layout'
import AddBankInfo from '../modals/add_bank_info'
import BankOtp from '../modals/bank_otp'
import httpService from '@/utils/httpService'
import CustomButton from '@/components/general/Button'
import useSettingsStore from '@/global-state/useSettingsState'
import { useMutation, useQueryClient } from 'react-query'
import { useRouter } from 'next/navigation'
import SuccessMessage from '../modals/success_message'

interface Props {
    currency: string,
    amount: any, 
    setShow: any, 
}

function CashoutBtn(props: Props) {
    const {
        currency,
        amount,
        setShow,  
    } = props

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [loadingWithdrawal, setLoadingWithdrawal] = React.useState(false)
    const [modalType, setModalType] = React.useState(0)
    const [transferCode, settransferCode] = React.useState("")
    const [transferRecipient, setTransferRecipient] = React.useState("")
    const [accountName, setAccountName] = React.useState("")
    const toast = useToast()
    const navigate = useRouter()

    const queryClient = useQueryClient()
    const { setAmount } = useSettingsStore((state) => state);

    const clickHandler = async () => {
        setLoading(true)
        let response: any
        if (currency === "USD") {
            response = await httpService.get("/payments/account/check")
        } else {
            setOpen(true)
            setModalType(0)
        }
        if (!response?.data) {
            if (currency === "USD") {
                const request: any = await httpService.get(`/payments/account/oauthOnboard`)
                console.log(request);
                if (request?.data?.checkout) {
                    window.open(request?.data?.checkout, '_blank')
                }
            } else {
                setOpen(true)
            }
        } else {
            WithdrawFund()
        }
        setLoading(false)
    }

    const WithdrawFund = async (item?: any) => {
        setLoadingWithdrawal(true)
        try {
            const request: any = await httpService.post(`/payments/account/withdraw?currency=${currency}&amount=${amount}&transferRecipient=${item ? item : transferRecipient}`)

            console.log(request);
            
            if (request?.data?.status === "SUCCESS") {
                toast({
                    title: 'Success',
                    description: "Withdraw Success",
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right',
                });
                setAmount("")
                setLoadingWithdrawal(false)
                // setOpen(false)
                setShow(false)
                setAccountName("")
                setModalType(2)
            } else if (request?.data?.status === "ok") {
                toast({
                    title: 'Success',
                    description: "Withdraw Success",
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right',
                });

                setAmount("")
                setLoadingWithdrawal(false)
                // setOpen(false)
                setAccountName("")
                setModalType(2)
            } else if (request?.data?.status === "OTP") {
                settransferCode(request?.transfer_code)
                setModalType(1)
                setLoadingWithdrawal(false)
                // setOpen(false)
                setAccountName("") 
                setOpen(true)
            } else {

                toast({
                    title: 'Error',
                    description: "Error Occurred",
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right',
                });
            }

            queryClient.invalidateQueries(['get-wallet-balanceNGN'])
        } catch (error: any) { 
            toast({
                title: 'Error',
                description: error?.response?.data?.message?.includes("sufficient funds") ? "You do not have sufficient funds in this wallet" : error?.response?.data?.message?.includes("NGN") ? "You do not have sufficient balance in this wallet" : error?.response?.data?.message ,
                status: 'error',
                isClosable: true,
                duration: 5000,
                position: 'top-right',
            });
            setLoadingWithdrawal(false)
            setOpen(false)
            setAccountName("")

        }

    }

    const closeHandler = () => {

        setOpen(false)
        setAmount("")
        setLoadingWithdrawal(false)
        setLoading(false)
        setModalType(0)
    }

    const endHandler = () => {

        setOpen(false)
        setAmount("")
        setLoadingWithdrawal(false)
        setLoading(false)
        setModalType(0)
    }

    return (
        <Box width={"full"} >
            <CustomButton 
          backgroundColor={"#5465E0"}
          borderRadius={"32px"}
          height={"54px"} onClick={() => clickHandler()} text='Continue to cash out' isLoading={loading} disable={loading || !amount} marginTop={"8"} />
            <ModalLayout open={open} close={closeHandler} title={modalType === 2 ? "" : 'Recipient'} >
                {modalType === 0 && (
                    <AddBankInfo loading={loadingWithdrawal} withdraw={WithdrawFund} setTransferRecipient={setTransferRecipient} transferRecipient={transferRecipient} setAccountName={setAccountName} accountName={accountName} close={setOpen} />
                )}
                {modalType === 1 && (
                    <BankOtp close={setOpen} currency={currency} transferCode={transferCode} />
                )}
                {modalType === 2 && (
                    <SuccessMessage close={endHandler} />
                )}
            </ModalLayout>
        </Box>
    )
}

export default CashoutBtn
