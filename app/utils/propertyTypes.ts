export interface PropertyTypes {
    id: string;
    title: string;
    description: string;
    propertyType: string;
    buyPrice: number;
    sellPrice: number;
    lossProfit: number;
    status: 'active' | 'inactive' | 'pending';
}

export type PropertyFormData = Omit<PropertyTypes, 'id' | 'lossProfit'>;

export const INITIAL_FORM_STATE: PropertyFormData = {
    title: '',
    description: '',
    propertyType: '',
    buyPrice: 0,
    sellPrice: 0,
    status: 'pending',
};

export const propertyTypeOptions = [
    { key: 'apartment', label: 'Apartment' },
    { key: 'house', label: 'House' },
    { key: 'condo', label: 'Condo' },
    { key: 'townhouse', label: 'Townhouse' },
    { key: 'villa', label: 'Villa' },
    { key: 'office', label: 'Office' },
    { key: 'retail', label: 'Retail' },
    { key: 'warehouse', label: 'Warehouse' },
];

export const statusOptions = [
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
    { key: 'pending', label: 'Pending' },
];
