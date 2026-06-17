import React, { useState, useEffect, useCallback } from 'react';
import { useDisclosure, Button } from '@heroui/react';
import { Plus } from 'lucide-react';
import PropertyTable from '../components/PropertyTable';
import PropertyForm from '../components/PropertyForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { type PropertyTypes, type PropertyFormData, INITIAL_FORM_STATE } from '../utils/propertyTypes';
import { propertyApi } from '../utils/propertyApi';

export default function Property() {
    const [properties, setProperties] = useState<PropertyTypes[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PropertyFormData>(INITIAL_FORM_STATE);
    const [selectedProperty, setSelectedProperty] = useState<PropertyTypes | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteTitle, setDeleteTitle] = useState<string>('');

    const {
        isOpen: isDrawerOpen,
        onOpen: onDrawerOpen,
        onOpenChange: onDrawerOpenChange,
    } = useDisclosure();

    const {
        isOpen: isDeleteOpen,
        onOpen: onDeleteOpen,
        onOpenChange: onDeleteOpenChange,
    } = useDisclosure();

    // Fetch properties on component mount
    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const data = await propertyApi.getProperties();
            setProperties(data);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const handleAddProperty = () => {
        setIsEditMode(false);
        setSelectedProperty(null);
        setFormData(INITIAL_FORM_STATE);
        onDrawerOpen();
    };

    const handleEditProperty = (property: PropertyTypes) => {
        setIsEditMode(true);
        setSelectedProperty(property);
        setFormData({
            title: property.title,
            description: property.description,
            propertyType: property.propertyType,
            buyPrice: property.buyPrice,
            sellPrice: property.sellPrice,
            status: property.status,
        });
        onDrawerOpen();
    };

    const handleOpenDeleteDialog = (id: string, title: string) => {
        setDeleteId(id);
        setDeleteTitle(title);
        onDeleteOpen();
    };

    const handleSaveProperty = async () => {
        try {
            if (isEditMode && selectedProperty) {
                // Update property with lossProfit calculation
                const lossProfit = formData.sellPrice - formData.buyPrice;
                const updatedData = { ...formData, lossProfit };
                await propertyApi.updateProperty(selectedProperty.id, formData);
                setProperties((prev) =>
                    prev.map((p) =>
                        p.id === selectedProperty.id
                            ? { ...p, ...updatedData }
                            : p
                    )
                );
            } else {
                // Create property with lossProfit calculation
                const lossProfit = formData.sellPrice - formData.buyPrice;
                const newProperty = await propertyApi.createProperty(formData);
                const enrichedProperty = { ...newProperty, lossProfit };
                setProperties((prev) => [enrichedProperty, ...prev]);
            }
        } catch (error) {
            console.error('Failed to save property:', error);
        }
    };

    const handleDeleteProperty = async () => {
        try {
            if (deleteId) {
                await propertyApi.deleteProperty(deleteId);
                setProperties((prev) => prev.filter((p) => p.id !== deleteId));
            }
        } catch (error) {
            console.error('Failed to delete property:', error);
        }
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
                <Button
                    isIconOnly
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onPress={handleAddProperty}
                    size="lg"
                >
                    <Plus size={20} />
                </Button>
            </div>

            <PropertyTable
                properties={properties}
                loading={loading}
                onEdit={handleEditProperty}
                onDelete={(id) => {
                    const property = properties.find((p) => p.id === id);
                    if (property) {
                        handleOpenDeleteDialog(id, property.title);
                    }
                }}
            />

            <PropertyForm
                isOpen={isDrawerOpen}
                onOpenChange={onDrawerOpenChange}
                isEditMode={isEditMode}
                formData={formData}
                onFormChange={setFormData}
                onSave={handleSaveProperty}
            />

            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onOpenChange={onDeleteOpenChange}
                itemTitle={deleteTitle}
                onConfirm={handleDeleteProperty}
            />
        </div>
    );
}