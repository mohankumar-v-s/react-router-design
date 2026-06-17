import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    Input,
    Select,
    SelectItem,
} from '@heroui/react';
import { type PropertyFormData, propertyTypeOptions, statusOptions, INITIAL_FORM_STATE } from '../utils/propertyTypes';

interface PropertyFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isEditMode: boolean;
    formData: PropertyFormData;
    onFormChange: (data: PropertyFormData) => void;
    onSave: () => Promise<void>;
}

export default function PropertyForm({
    isOpen,
    onOpenChange,
    isEditMode,
    formData,
    onFormChange,
    onSave,
}: PropertyFormProps) {
    const lossProfit = formData.sellPrice - formData.buyPrice;

    const titleRegex = /^[A-Za-z0-9 @\-]+$/;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue: string | number = value;

        // restrict description to single spaces
        if (name === 'description') {
            // collapse multiple spaces into one
            newValue = value.replace(/\s+/g, ' ');
        }

        // if title, enforce allowed characters only
        if (name === 'title') {
            if (!titleRegex.test(value) && value !== '') {
                // ignore the change if disallowed char
                return;
            }
        }

        const numericFields = ['buyPrice', 'sellPrice'];
        onFormChange({
            ...formData,
            [name]: numericFields.includes(name) ? parseFloat(newValue as string) || 0 : newValue,
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFormChange({
            ...formData,
            [name]: value,
        });
    };

    // validation: all fields required except description
    const isValid =
        formData.title.trim() !== '' &&
        titleRegex.test(formData.title) &&
        formData.propertyType.trim() !== '' &&
        formData.buyPrice > 0 &&
        formData.sellPrice > 0 &&
        formData.status.trim() !== '';


    return (
        <Drawer
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            size="md"
        >
            <DrawerContent>
                {(onClose) => (
                    <>
                        <DrawerHeader className="flex flex-col gap-1">
                            {isEditMode ? 'Edit Property' : 'Add Property'}
                        </DrawerHeader>
                        <DrawerBody className="gap-4">
                            <Input
                                name="title"
                                label="Title"
                                placeholder="Enter property title"
                                value={formData.title}
                                onChange={handleInputChange}
                                type="text"
                                isClearable
                            />

                            <Input
                                name="description"
                                label="Description"
                                placeholder="Enter property description"
                                value={formData.description}
                                onChange={handleInputChange}
                                type="text"
                                isClearable
                            />


                            <Select
                                name="propertyType"
                                label="Property Type"
                                selectedKeys={formData.propertyType ? [formData.propertyType] : []}
                                onChange={handleSelectChange}
                            >
                                {propertyTypeOptions.map((option) => (
                                    <SelectItem key={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                name="buyPrice"
                                label="Buy Price"
                                placeholder="0.00"
                                type="number"
                                value={formData.buyPrice.toString()}
                                onChange={handleInputChange}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-sm">$</span>
                                    </div>
                                }
                            />

                            <Input
                                name="sellPrice"
                                label="Sell Price"
                                placeholder="0.00"
                                type="number"
                                value={formData.sellPrice.toString()}
                                onChange={handleInputChange}
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-sm">$</span>
                                    </div>
                                }
                            />

                            <Input
                                name="lossProfit"
                                label="Loss/Profit"
                                placeholder="0.00"
                                type="text"
                                value={`$${lossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                readOnly
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className={`text-sm ${lossProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {lossProfit >= 0 ? '+' : '-'}
                                        </span>
                                    </div>
                                }
                                classNames={{
                                    input: lossProfit >= 0 ? 'text-green-600' : 'text-red-600',
                                }}
                            />

                            <Select
                                name="status"
                                label="Status"
                                selectedKeys={[formData.status]}
                                onChange={handleSelectChange}
                            >
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.key}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </DrawerBody>
                        <DrawerFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button
                                color="primary"
                                onPress={async () => {
                                    await onSave();
                                    onClose();
                                }}
                                className="bg-blue-500 text-white"
                                disabled={!isValid}
                            >
                                {isEditMode ? 'Update' : 'Save'}
                            </Button>
                            {!isValid && (
                                <p className="text-sm text-red-500 mt-1">
                                    All fields except description are required and title must contain only letters, numbers, space, @ or -.
                                </p>
                            )}
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
