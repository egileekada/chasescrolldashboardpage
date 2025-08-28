"use client"
import GetMySale from '@/components/kisok/getMySale';
import GetOrder from '@/components/kisok/getOrder';
import GetProduce from '@/components/kisok/getProduce';
import GetReciept from '@/components/kisok/getReciept';
import GetRental from '@/components/kisok/getRental';
import GetVendorReciept from '@/components/kisok/getVendorReciept';
import useKioskStore from '@/global-state/useKioskFilter';
import BookingsRequest from '@/Views/dashboard/booking/BookingRequest';
import Bookings from '@/Views/dashboard/booking/Bookings';
import Businesses from '@/Views/dashboard/booking/Businesses';
import MyBusiness from '@/Views/dashboard/booking/MyBusiness';
import { Flex } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function KioskPage() {

    const query = useSearchParams();
    const type = query?.get('type');

    const { selectedFilter } = useKioskStore((state) => state)

    return (
        <Flex w={"full"} flexDir={"column"} py={["6", "8", "8"]} >
            {type === "kiosk" && (
                <GetProduce name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "mykiosk" && (
                <GetProduce name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} myproduct={true} />
            )}
            {type === "rental" && (
                <GetRental name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myrental" && (
                <GetRental name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} myrental={true} />
            )}
            {type === "myorder" && (
                <GetOrder />
            )}
            {type === "mysales" && (
                <GetMySale />
            )}
            {type === "myreciept" && (
                <GetReciept />
            )}
            {type === "vendorreciept" && (
                <GetVendorReciept />
            )}
            {type === "service" && (
                <Businesses name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myservice" && (
                <MyBusiness name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "mybooking" && (
                <Bookings name={selectedFilter?.name} state={selectedFilter?.state} category={selectedFilter?.category} />
            )}
            {type === "myrequest" && (
                <BookingsRequest />
            )}
        </Flex>
    )
}
