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

function ModalCreateTutors({ isOpen, onOpen, onOpenChange, session }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateName = (value) => {
    if (/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]*$/.test(value)) {
      setNameError("");
      return true;
    } else {
      setNameError("El nombre solo puede contener letras.");
      return false;
    }
  };

  const validateLastname = (value) => {
    if (/^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]*$/.test(value)) {
      setLastnameError("");
      return true;
    } else {
      setLastnameError("El apellido solo puede contener letras.");
      return false;
    }
  };

  const validateEmail = (value) => {
    if (/^[^\s@]+@uptc\.edu\.co$/.test(value)) {
      setEmailError("");
      return true;
    } else {
      setEmailError("El correo debe terminar en @uptc.edu.co");
      return false;
    }
  };

  const validatePassword = (value) => {
    if (value.length >= 6) {
      setPasswordError("");
      return true;
    } else {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
  };

  const handleCreateTutor = async (event) => {
    event.preventDefault();
    if (!validateName(name) || !validateLastname(lastname) || !validateEmail(email) || !validatePassword(password)) {
      return;
    }
    const tutor = {
      name: name,
      lastname: lastname,
      email: email,
      password: password,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${URLAPI}/auth/register-tutor`, tutor, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      onOpenChange(false);
      setName("");
      setLastName("");
      setEmail("");
      setPassword("");
      if (response.data.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("Ocurrió un error", {
        position: "top-right",
        autoClose: 2000,
      });
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
                Crear Tutor
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleCreateTutor}
                >
                  <div className="w-4/5 sm:w-full ">
                    <Input
                      className="bg-white rounded-xl mb-2"
                      fullWidth
                      isRequired
                      id="name"
                      label="Nombre"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        validateName(event.target.value);
                      }}
                    />
                    {nameError && <p className="text-red-500 text-sm mb-3">{nameError}</p>}
                    <Input
                      className="bg-white rounded-xl mb-2"
                      fullWidth
                      isRequired
                      id="lastname"
                      label="Apellido"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={lastname}
                      onChange={(event) => {
                        setLastName(event.target.value);
                        validateLastname(event.target.value);
                      }}
                    />
                    {lastnameError && <p className="text-red-500 text-sm mb-3">{lastnameError}</p>}
                    <Input
                      className="bg-white rounded-xl mb-2"
                      fullWidth
                      isRequired
                      id="email"
                      label="Correo"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        validateEmail(event.target.value);
                      }}
                    />
                    {emailError && <p className="text-red-500 text-sm mb-3">{emailError}</p>}
                    <Input
                      className="bg-white rounded-xl mb-2"
                      fullWidth
                      isRequired
                      id="password"
                      label="Contraseña"
                      type="password"
                      variant="filled"
                      margin="normal"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        validatePassword(event.target.value);
                      }}
                    />
                    {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}
                    <div className="flex justify-end pt-5">
                      <Button
                        className="w-28"
                        variant="solid"
                        color="warning"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Registrar
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

export default ModalCreateTutors;