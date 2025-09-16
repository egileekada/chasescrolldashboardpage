import { create } from 'zustand';

export type CreateProduct = {
    creatorID: string,
    name: string,
    description: string,
    images: Array<string>,
    price: number | any,
    category: string,
    quantity: number | any,
    hasDiscount: boolean,
    discountPrice: number | any,
    publish: boolean;
    color: Array<any>,
    size: Array<string>,
    location?: {
        link?: string,
        address?: string,
        country?: string,
        street?: string,
        city?: string,
        zipcode?: string,
        state?: string,
        locationDetails?: string,
        latlng?: string,
        placeIds?: string,
        toBeAnnounced?: true
    },
    state: string
}

type ILocation = {
    location: {
        link?: string,
        address?: string,
        country?: string,
        street?: string,
        city?: string,
        zipcode?: string,
        state?: string,
        locationDetails?: string,
        latlng?: string,
        placeIds?: string,
        toBeAnnounced?: true
    }
}

export type CreateRental = {
    userId: string,
    name: string,
    description: string,
    category: string,
    location: any
    maximiumNumberOfDays: number | any,
    price: number | any,
    images: Array<string>,
    frequency: "HOURLY" | "DAILY" | any,
    state: string
    "dailyPrice": number | any,
    "hourlyPrice": number | any
}

type State = {
    productdata: CreateProduct
}

type Image = {
    image: Array<any>,
}
type ImagePreview = {
    imagePreview: Array<any>,
}

type Navigate = {
    rentaldata: CreateRental
}


type Action = {
    updateProduct: (data: State['productdata']) => void
    updateImage: (data: Image['image']) => void
    updateImagePreview: (data: ImagePreview['imagePreview']) => void
    updateRental: (data: Navigate['rentaldata']) => void
    updateAddress: (data: ILocation['location']) => void,
}

const userId = localStorage.getItem('user_id') as string;

const useProductStore = create<State & Image & Navigate & Action & ILocation & ImagePreview>((set) => ({
    productdata: {
        creatorID: userId,
        name: "",
        description: "",
        images: [],
        price: null,
        category: "",
        quantity: null,
        hasDiscount: false,
        discountPrice: null,
        publish: true,
        color: [],
        size: [],
        location: "" as any,
        state: ""
    },

    location: {} as any,
    image: [],
    imagePreview: [],
    rentaldata: {
        "userId": userId,
        "name": "",
        "description": "",
        "category": "",
        "location": {} as any,
        "maximiumNumberOfDays": 1,
        "price": null,
        "images": [],
        frequency: "",
        state: "",
        "dailyPrice": 0,
        "hourlyPrice": 0
    },
    updateProduct: (data) => set(() => ({ productdata: data })),
    updateAddress: (data) => set(() => ({ location: data })),
    updateImage: (data) => set(() => ({ image: data })),
    updateImagePreview: (data) => set(() => ({ imagePreview: data })),
    updateRental: (data) => set(() => ({ rentaldata: data })),
}));



export default useProductStore