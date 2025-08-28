import React from 'react'
import { Box, Flex, Grid, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react'
import { IBuisness } from '@/models/Business'
import httpService from '@/utils/httpService';
import { useMutation, useQuery } from 'react-query';
import BusinessCard from '@/components/booking_component/BusinessCard';
import { PaginatedResponse } from '@/models/PaginatedResponse';
import { uniqBy } from 'lodash';
import { IService } from '@/models/Service';
import InfiniteScrollerComponent from '@/hooks/infiniteScrollerComponent';
import { cleanup } from '@/utils/cleanupObj';
import LoadingAnimation from '@/components/sharedComponent/loading_animation';


function Businesses({ name, state, category }: { name?: string, state?: string, category?: string }) {
    
    const userId = localStorage.getItem('user_id') + "";

    const { results, isLoading, isRefetching: refetchingList } = InfiniteScrollerComponent({
        url: `/business-service/search`, limit: 20, filter: "id", name: "getProduct", paramsObj: cleanup({
            name: name,
            category: category?.replaceAll(" ", "_"),
            state: state
        })
    })


    let newResult = results?.filter((item: IService) => item?.vendor?.userId !== userId)

    return (
        <LoadingAnimation loading={isLoading} refeching={refetchingList} length={newResult?.length} > 
            <Flex flexDirection={"column"} w='full' h='full'>
                {!isLoading && newResult.length > 0 && (
                    <Grid templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)"]} gap={["4", "4", "6"]} >
                        {newResult.map((item: any, index: number) => (
                            <BusinessCard key={index.toString()} business={item} />
                        ))}
                    </Grid>
                )} 
            </Flex>
        </LoadingAnimation>
    )
}

export default Businesses
