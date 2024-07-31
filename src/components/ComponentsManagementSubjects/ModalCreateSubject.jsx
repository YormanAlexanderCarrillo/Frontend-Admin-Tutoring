"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";

function ModalCreateSubject({ isOpen, onOpen, onOpenChange, session }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (event) => {
    const value = event.target.value;
    setCode(value);
    if (/^\d*$/.test(value)) {
      setCodeError("");
    } else {
      setCodeError("El código solo puede contener números positivos.");
    }
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setName(value);
    if (/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s\-\.]*$/.test(value)) {
      setNameError("");
    } else {
      setNameError("El nombre de la materia solo puede contener letras.");
    }
  };

  const handleSaveSubject = async (event) => {
    event.preventDefault();
    if (codeError || nameError || !code || !name) {
      return;
    }
    setIsLoading(true);
    const subject = {
      subjectCode: code,
      name: name,
      description: description,
    };
    try {
      const response = await axios.post(
        `${URLAPI}/subject/register-subject`,
        subject,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      console.log(response);
      if(response.data.status === 200){
        onOpenChange(false);
        setCode("");
        setName("");
        setDescription("");
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-2">
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                Crear Asignatura
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleSaveSubject}
                >
                  <div className="w-4/5 sm:w-full ">
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="code"
                      label="Código"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={code}
                      onChange={handleCodeChange}
                    />
                    {codeError && <p className="text-red-500 text-sm mt-1 mb-3">{codeError}</p>}
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="name"
                      label="Nombre Materia"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={name}
                      onChange={handleNameChange}
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1 mb-3">{nameError}</p>}
                    <Input
                      className="bg-white rounded-xl"
                      fullWidth
                      isRequired
                      id="description"
                      label="Descripción"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                    <div className="flex justify-end pt-5">
                      <Button
                        className="w-28"
                        variant="solid"
                        color="warning"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Guardar
                      </Button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ModalCreateSubject;