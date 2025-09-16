import CustomButton from "@/components/general/Button";
import ModalLayout from "@/components/sharedComponent/modal_layout";
import useProductStore from "@/global-state/useCreateProduct";
import useCustomTheme from "@/hooks/useTheme";
import { Flex, Input, Text, useToast } from "@chakra-ui/react";
import { values } from "lodash";
import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import Select from 'react-select';


export default function ColorSelector() {


    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderRadius: "999px", // rounded edges for the input box
            padding: "2px",
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: "12px", // rounded edges for the dropdown menu
        }),
        menuList: (provided: any) => ({
            ...provided,
            borderRadius: "12px", // inside menu list
        }),
    };

    const colorOptions = [
        { value: '#FFFFFF', label: 'White' },
        { value: '#000000', label: 'Black' },
        { value: '#FF0000', label: 'Red' },
        { value: '#00FF00', label: 'Green' },
        { value: '#0000FF', label: 'Blue' },
        { value: '#FFFF00', label: 'Yellow' },
        { value: '#FF00FF', label: 'Magenta' },
        { value: '#00FFFF', label: 'Cyan' },
        { value: '#C0C0C0', label: 'Silver' },
        { value: '#808080', label: 'Gray' }
    ];
    const [selectedOptions, setSelectedOptions] = useState<Array<{ label: string, value: string }>>([]);
    const [open, setOpen] = useState(false)
    const { primaryColor } = useCustomTheme()
    const { productdata, updateProduct } = useProductStore((state) => state);

    const { headerTextColor } = useCustomTheme()

    const toast = useToast()
    const [customColor, setCustomColor] = useState({
        label: "",
        value: ""
    })

    useEffect(() => {
        const transformedData: any = productdata?.color?.map((item: any) => ({
            value: item.color,
            label: item.label
        }));
        setSelectedOptions(transformedData)
    }, [])

    const handleChange = (selected: any) => {

        const transformedData = selected.map((item: any) => ({
            color: item.value,
            label: item.label
        }));

        console.log(transformedData);

        let clone = []

        if(productdata.color.length > 0 ) {
            clone = [...productdata.color, ...transformedData]
        } else {
            clone = [...transformedData]
        } 

        updateProduct({ ...productdata, color: clone })
    };

    const clickHandler = () => {

        if (!customColor?.label || !customColor?.value) {
            toast({
                status: "warning",
                description: "Enter Your Custom Color Name and Code"
            })
            return
        } else {
            if (selectedOptions?.some((item) => item?.label === customColor?.label || item?.value === customColor?.value)) {
                toast({
                    status: "warning",
                    description: "Color Name or Code Already exist"
                })
                return
            }
            const clone = [...selectedOptions] as Array<{ label: string, value: string }>

            clone.push({
                label: customColor?.label + "",
                value: customColor?.value + ""
            })

            setSelectedOptions(clone)
            setOpen(false)
        }
    }

    /** remove color */
    const removeColor = (label: string) => {
        const filtered = productdata?.color?.filter((item) => item.label !== label); 
        updateProduct({ ...productdata, color: filtered });
    };


    return (
        <Flex gap={"2"} w={"full"} color={"black"} flexDir={"column"} >
            <Text fontWeight={"500"} color={headerTextColor} >Color</Text>
            <Select
                isMulti
                name="tags"
                options={colorOptions.filter(
                    (item) => !productdata?.color?.some((subitem) => subitem.color === item.value)
                )}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                styles={customStyles}
                value={[] as any}
            />
            {/* {productdata?.color?.length > 0 && ( */}
            <Flex w={"fit"} wrap={"wrap"} gap={"1"} >
                {productdata?.color?.map((item) => {
                    return (
                        <Flex key={item?.label} py={"2"} alignItems={"center"} borderWidth={"1px"} px={"2"} rounded={"12px"} gap={"1"} >
                            <Flex w={"7"} h={"7"} rounded={"full"} bgColor={item?.color} />
                            <Text fontSize={"14px"} color={headerTextColor} >{item?.label}</Text>
                            <Flex as={"button"} onClick={() => removeColor(item?.label)} >
                                <IoIosClose size={"20px"} />
                            </Flex>
                        </Flex>
                    )
                })}
            </Flex>
            {/* )} */}
            <Text type="button" fontSize={"14px"} as={"button"} w={"fit-content"} onClick={() => setOpen(true)} color={primaryColor} >Add Custom Color</Text>
            <ModalLayout open={open} close={setOpen} size={"xs"} >
                <Flex w={"full"} flexDir={"column"} gap={"3"} p={"4"} >
                    <Text fontWeight={"600"} color={primaryColor} >Custom Color Form</Text>
                    <Flex gap={"2"} flexDir={"column"} >
                        <Text fontSize={"14px"} fontWeight={"500"} >Color Name</Text>
                        <Input onChange={(e) => setCustomColor({
                            ...customColor, label: e.target.value
                        })} w={"full"} rounded={"lg"} fontSize={"14px"} />
                    </Flex>
                    <Flex gap={"2"} flexDir={"column"} >
                        <Text fontSize={"14px"} fontWeight={"500"} >Color Code</Text>
                        <Input onChange={(e) => setCustomColor({
                            ...customColor, value: e.target.value
                        })} w={"full"} rounded={"lg"} fontSize={"14px"} placeholder="hex code eg #055696 " />
                    </Flex>
                    <CustomButton onClick={clickHandler} type="button" text="Add Color" mt={"3"} borderRadius={"999px"} />
                </Flex>
            </ModalLayout>
        </Flex>
    )
}