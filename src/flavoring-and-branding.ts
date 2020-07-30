// Let's start with our Branding and Flavoring types
export interface Flavoring<FlavorT>{
    _type?:FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export interface Branding<BrandT>{
    _type:BrandT;
}

export type Brand<T, BrandT> = T & Branding<BrandT>;