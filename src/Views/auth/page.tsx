"use client";
import React from 'react'
import {Box, Divider, HStack, VStack, Image, useToast, Button, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import CustomText from '@/components/general/Text';
import CustomButton from '@/components/general/Button';
import { THEME } from '@/theme';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { signInValidation } from '@/services/validations';
import { useRouter } from 'next/navigation';
import { useDetails } from '@/global-state/useUserDetails';
import { useMutation, useQuery } from 'react-query';
import httpService from '@/utils/httpService';
import { URLS } from '@/services/urls';
import { CustomInput } from '@/components/Form/CustomInput'; 
import httpServiceGoogle from '@/utils/httpServiceGoogle';
import CopyRightText from '@/components/sharedComponent/CopyRightText';
// import GoogleBtn from '@/components/sharedComponent/googlebtn';
import PageLoader from '@/components/sharedComponent/pageLoader';
import useCustomTheme from "@/hooks/useTheme";



const LINK2 = [
  {
    name: "Events",
    link: "/",
    isExternal: true
  },
  {
    name: "Sign in",
    link: "/auth",
    isExternal: false
  },
  {
    name: "Sign up",
    link: "/auth/signup",
    isExternal: true
  },
  {
    name: "Home",
    link: "/home",
    isExternal: true
  },
  {
    name: "About us",
    link: "/home/about-us",
    isExternal: true
  },
  {
    name: "Policy",
    link: "/home/privacy",
    isExternal: true
  },
  {
    name: "Terms and conditions",
    link: "/home/terms",
    isExternal: true
  },
  {
    name: "Contact us",
    link: "/home/contact-us",
    isExternal: true
  },
]
const exclude = ['Events', 'Sign up', 'Community', 'Sign up']


function LoginPage() {
  
  const [showModal, setShowModal] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [Loading, setLoading] = React.useState(false)
  const [FirstName, setFirstName] = React.useState("")
  const [CheckUsername, setCheckUsername] = React.useState("")
  const [LastName, setLastName] = React.useState("")
  const [UserName, setUserName] = React.useState("") 
  const [checkData, setCheckData] = React.useState<any>({})

  const {
    bodyTextColor,
    primaryColor,
    secondaryBackgroundColor,
    mainBackgroundColor,
    borderColor,
  } = useCustomTheme();
  const { colorMode, toggleColorMode } = useColorMode();

  const toast = useToast();
  const router = useRouter();
  const { setAll } = useDetails((state) => state); 


  React.useEffect(() => { 
    const keyToKeep = 'chakra-ui-color-mode';

    // Retrieve the value of the key you want to keep
    const valueToKeep = localStorage.getItem(keyToKeep); 
    localStorage.clear();
    if (valueToKeep !== null) {
      localStorage.setItem(keyToKeep, valueToKeep);
    }
  }, []); 

  React.useEffect(() => {
    if (checkData?.user_id) {
      if (!checkData?.firstName) {
        setShowModal(true)
      } else {
        localStorage.setItem('token', checkData.access_token);
        localStorage.setItem('refresh_token', checkData.refresh_token);
        localStorage.setItem('user_id', checkData.user_id);
        localStorage.setItem('expires_in', checkData.expires_in);
        setAll({
          firstName: checkData.firstName,
          lastName: checkData.firstName,
          username: checkData.user_name,
          userId: checkData.user_id,
        })
      }
    }
  }, [checkData, router, setAll]);

  const checkUserName = useQuery(['username' + UserName], () => httpService.get('/auth/username-check?username=' + UserName), {
    onError: (error: any) => {
      // toast({
      //   title: 'Error',
      //   description: "Error ocurred",
      //   status: 'error',
      // })
    },
    onSuccess: (data) => {
      console.log(data?.data?.message);
      if (data?.data?.message === "Username already exists.") {
        setCheckUsername(data?.data?.message)
      } else {
        setCheckUsername("")
      }
    }
  })

  const { data, mutate, isLoading } = useMutation({
    mutationFn: (info) => httpServiceGoogle.post(`${URLS.LOGIN}`, info),
    onError: (error) => {
      toast({
        title: 'An error occured',
        description: 'Invalid email or password',
        status: 'error',
        isClosable: true,
        duration: 5000,
        position: 'top-right',
      });
    },
    onSuccess: (data) => {
      setShow(true)
      toast({
        title: data?.data?.message ? 'Error' : 'Success',
        description: data?.data?.message ? data?.data?.message : 'Login successful',
        status: data?.data?.message ? "error" : 'success',
        isClosable: true,
        duration: 5000,
        position: 'top-right',
      });

      if (data?.data?.message === "This email is not verified") {
        router.push('/auth/verify-account');
      } else {

        localStorage.setItem('token', data?.data?.access_token);
        localStorage.setItem('refresh_token', data?.data?.refresh_token);
        localStorage.setItem('user_id', data?.data?.user_id);
        localStorage.setItem('expires_in', data?.data?.expires_in);
        setAll({
          firstName: data?.data?.firstName,
          lastName: data?.data?.firstName,
          username: data?.data?.user_name,
          userId: data?.data?.user_id,
        })
        router.push('/dashboard/event')
      }

    }

  });

  React.useEffect(()=> {
    sessionStorage.setItem("tp_token", "")
  }, [])

  const clickHandler = async () => {
    setLoading(true);
    if (!FirstName) {
      toast({
        title: 'Erroor',
        description: 'Enter firstname',
        status: 'error',
      })
    } else if (!LastName) {
      toast({
        title: 'Erroor',
        description: 'Enter lastname',
        status: 'error',
      })
    } else if (!UserName) {
      toast({
        title: 'Erroor',
        description: 'Enter username',
        status: 'error',
      })
    } else {
      const response = await httpService.put(`/user/update-profile`, {
        firstName: FirstName,
        lastName: LastName,
        username: UserName,
      })
      if (response) {
        toast({
          title: 'Success',
          description: 'Update successful',
          status: 'success',
        })
        localStorage.setItem('firstName', FirstName);

        let newObj = { ...checkData, firstName: FirstName }

        localStorage.setItem('token', checkData.access_token);
        localStorage.setItem('refresh_token', checkData.refresh_token);
        localStorage.setItem('user_id', checkData.user_id);
        localStorage.setItem('expires_in', checkData.expires_in);
        setAll({
          firstName: checkData.firstName,
          lastName: checkData.firstName,
          username: checkData.user_name,
          userId: checkData.user_id,
        })
        router.push('/dashboard/event')
        // navigate("/explore")
      } else {
        toast({
          title: 'Erroor',
          description: 'Something wetn wrong',
          status: 'error',
        })
      }

    }
    setLoading(false);
  }

  const { renderForm, values } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validationSchema: signInValidation,
    submit: (data: any) => mutate(data)
  });

  const comingSoon = () => {
    toast({
      title: 'Info',
      description: 'Coming Soon',
      status: "info",
      position: 'top-right',
    })
  }

  const tempFunc = () => {
    // toast({
    //   title: 'Infomation',
    //   description: 'Please sign-up with google',
    //   status: 'info',
    //   isClosable: true,
    //   duration: 5000,
    //   position: 'top-right',
    // }); 
    router?.push("/auth/signup")
  }

  return renderForm(
    <Flex flexDir={"column"} gap={"10"} alignItems={"center"} justifyContent={"space-between"} pt={"16"} pb={["16px", "16px", "0px"]} width={"full"} height={"100vh"} bg={mainBackgroundColor} >
      <Flex flexDir={["column", "column", "row"]} gap={["10", "10", "4"]} alignItems={"center"} justifyContent={"space-between"} width={"full"} maxWidth={"5xl"} >
        <Flex px={"4"} flexDir={"column"} alignItems={"center"} width={"full"} gap={"12"} >
          <Box width={"full"} maxWidth={"sm"} height={"80"} >
            <Image src='/assets/svg/sign-in-illustration-2.svg' width={"full"} alt='chasescroll logo' />
          </Box>
          <Flex width={"full"} maxWidth={"400px"} flexDirection={"column"} gap={"2"} >
            <CustomText textAlign={'center'} fontSize={['24px', "30px"]} color="#163AB7" fontFamily={'DM-Bold'} fontWeight={'500'}>Your Well tailored virtual Community.</CustomText>
            <CustomText textAlign={'center'} fontFamily={'DM-Regular'} fontSize={'24px'}>An efficient ecosystem for event management.</CustomText>
          </Flex>
          <Flex gap={"5"} justifyContent={"center"} flexWrap={"wrap"} >
            <Box as='button' type='button' onClick={comingSoon}  >
              <Image alt='google-btn' src="/assets/images/play-store.png" width='100%' height={'100%'} objectFit={'contain'} />
            </Box>
            <Box as='button' type='button' onClick={comingSoon} >
              <Image alt='google-btn' src="/assets/images/apple-store.png" width='100%' height={'100%'} objectFit={'contain'} />
            </Box>
          </Flex>
        </Flex>

        <Flex gap={"4"} flexDir={"column"} width={"full"} alignItems={"center"} p={"4"} >
          <Flex flexDirection={"column"} gap={"8"} borderWidth={"1px"} roundedTopLeft={"3xl"} roundedBottom={"3xl"} p={"6"} width={"full"} maxWidth={"463px"} >

            <CustomText textAlign={'center'} fontSize={['2xl', "4xl"]} color={"brand.chasescrollDarkBlue"} fontFamily={'DM-Bold'} fontWeight={'700'}>Chasescroll</CustomText>
            <CustomText textAlign={'center'} fontWeight={"400"} fontFamily={'DM-Regular'} fontSize={'md'}>An efficient ecosystem for event management.</CustomText>
            <Flex width={"full"} gap={"4"} flexDir={"column"} >
              <CustomInput name='username' isPassword={false} type='text' placeholder='Enter your Email or Username' />
              <CustomInput name='password' isPassword type='password' placeholder='Enter your password' />

              <Flex gap={["5", "5", "0px"]} justifyContent={["start", "start", 'space-between']} flexDir={["column", "column", "row"]} width='100%' marginY='0px'>
                <Link  href='/auth/forgotpassword'>
                  <CustomText color='brand.chasescrollBlue' fontSize={'sm'} fontFamily={'Satoshi-Regular'} textAlign={'left'}>
                    Forgot password ?
                  </CustomText>
                </Link>

                <CustomText textAlign={"right"} fontSize={'sm'} fontFamily={'Satoshi-Regular'}>
                  Dont have an account ?
                  <span role='button' onClick={tempFunc} style={{color: THEME.COLORS.chasescrollBlue}}> Sign up</span>
                  {/*<Link href='/auth/signup'>*/}
                  {/*  <span style={{color: THEME.COLORS.chasescrollBlue}}> Sign up</span>*/}
                  {/*</Link>*/}
                </CustomText>
              </Flex>

              <CustomButton type='submit' text='Login' isLoading={isLoading} color='white' width='100%' borderRadius='10px' />

            </Flex>
          </Flex> 

          {/* <GoogleBtn title="Sign in" fixedwidth='294px' /> */}

          <CustomText fontFamily={'DM-Medium'} color='grey' textAlign={'center'} fontSize={'16px'}>Create a page for events, Community and Business.</CustomText>

          {/* <Text fontSize={"10px"} mx={"auto"} >
            <CopyRightText />
          </Text> */}

        </Flex>
      </Flex>

      <Box width={"full"} display={["none", "none", "flex"]} mt={"auto"} flexDirection={"column"} >

        <Text fontSize={"10px"} textAlign={"center"} mx={"auto"} >
          <CopyRightText />
        </Text>
        <Box width={"full"} borderWidth={"1px"} />
        <Flex gap={"4"} py={'2'} justifyContent={"center"} alignItems={"center"} fontSize={"sm"} textAlign={"center"} color={"brand.chasescrollTextGrey"} >
          {LINK2.map((item, index) => {
            if (item.isExternal) {
              return (
                <CustomText fontFamily={'DM-Regular'} color={item.name === "Sign in" ? "brand.chasescrollBlue" : "brand.chasescrollTextGrey"} _hover={{ color: "brand.chasescrollBlue" }} key={index.toString()}>
                  <a key={index.toString()} href={item.link}>{item.name}</a>
                </CustomText>
              )
            } else {
              return (
                <CustomText fontFamily={'DM-Regular'} color={item.name === "Sign in" ? "brand.chasescrollBlue" : "brand.chasescrollTextGrey"} _hover={{ color: "brand.chasescrollBlue" }} key={index.toString()}>
                  <Link href={`/${item.link}`} key={index.toString()}>
                    {item.name}
                  </Link>
                </CustomText>
              )
            }
          })}
        </Flex>
      </Box>

      <PageLoader show={show} />
    </Flex>
  )
}

export default LoginPage