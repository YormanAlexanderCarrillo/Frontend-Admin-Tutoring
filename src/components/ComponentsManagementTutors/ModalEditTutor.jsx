import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ModalEditTutor({ isOpen, onOpenChange, session, tutor }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleSelected, setRoleSelected] = useState("");
  const [nameError, setNameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const roles = {
    TUTOR: "TUTOR",
    ADMINISTRATOR: "ADMINISTRADOR",
    STUDENT: "ESTUDIANTE",
  };

  const handleSelectionChange = (value) => {
    const selectedKey = Array.from(value)[0];
    setRoleSelected(selectedKey);
  };

  useEffect(() => {
    if (isOpen && tutor) {
      setName(tutor.name);
      setLastName(tutor.lastname);
      setEmail(tutor.email);
      setRoleSelected(tutor.role);
    }
  }, [isOpen, tutor]);

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

  const handleUpdateTutor = async (event) => {
    event.preventDefault();
    if (!validateName(name) || !validateLastname(lastname) || !validateEmail(email)) {
      return;
    }
    const tutorUpdate = {
      name: name,
      lastname: lastname,
      email: email,
      role: roleSelected,
    };
    setIsLoading(true);
    try {
      const response = await axios.put(`${URLAPI}/user/update-tutor/${tutor._id}`, tutorUpdate, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      });
      onOpenChange(false);
      setName("");
      setLastName("");
      setEmail("");
      setRoleSelected("");
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
                Actualizar Tutor
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleUpdateTutor}
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
                    <Dropdown className="w-full">
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full capitalize mt-5"
                        >
                          {roles[roleSelected]}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={[roleSelected]}
                        onSelectionChange={handleSelectionChange}
                      >
                        <DropdownItem key="TUTOR">TUTOR</DropdownItem>
                        <DropdownItem key="ADMINISTRATOR">
                          ADMINISTRADOR
                        </DropdownItem>
                        <DropdownItem key="STUDENT">ESTUDIANTE</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
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
    </div>
  );
}

export default ModalEditTutor;