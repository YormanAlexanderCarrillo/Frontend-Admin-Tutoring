import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ModalRecoveryPassword({ isOpen, onOpenChange }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    await axios
      .put(`${URLAPI}/auth/send-email-reset-password/${email}`, {})
      .then((response) => {
        console.log(response);
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000,
          });
        }
        onOpenChange();
        setTitle("");
        setDescription("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" backdrop="blur" >
        <ModalContent className="bg-stone-200"> 
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Recuperar Contraseña
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={<MdOutlineMarkEmailUnread />}
                  label="Correo"
                  variant="bordered"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={handleSendEmail}
                >
                  Enviar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
