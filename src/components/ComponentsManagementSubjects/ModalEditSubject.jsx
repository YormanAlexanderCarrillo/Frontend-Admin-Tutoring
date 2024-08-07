"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ModalEditSubject({ isOpen, onOpenChange, session, subject }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (isOpen && subject) {
      setCode(subject.subjectCode);
      setName(subject.name);
      setDescription(subject.description);
    }
  }, [isOpen, subject]);

  const handleUpdateSubject = async (event) => {
    event.preventDefault();
    if (codeError || nameError) {
      return;
    }
    setIsLoading(true);
    const subjectUpdate = {
      subjectCode: code,
      name: name,
      description: description,
    };
    await axios
      .put(`${URLAPI}/subject/update-subject/${subject._id}`, subjectUpdate, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        onOpenChange(false);
        setCode("");
        setName("");
        setDescription("");
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000,
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

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
    if (/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]*$/.test(value)) {
      setNameError("");
    } else {
      setNameError("El nombre de la materia solo puede contener letras.");
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
                Actualizar Asignatura
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleUpdateSubject}
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
                    {codeError && <p className="text-red-500 text-sm mt-1">{codeError}</p>}
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
                      helperText={nameError}
                      status={nameError ? "error" : "default"}
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
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
                        color="success"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Actualizar
                      </Button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default ModalEditSubject;
