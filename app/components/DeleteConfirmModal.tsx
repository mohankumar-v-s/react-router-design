'use client';

import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@heroui/react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    itemTitle?: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onOpenChange,
    onConfirm,
    itemTitle,
}: DeleteConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Confirm Delete
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete {itemTitle ? `"${itemTitle}"` : 'this property'}? This action cannot be undone.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={async () => {
                                    await onConfirm();
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
