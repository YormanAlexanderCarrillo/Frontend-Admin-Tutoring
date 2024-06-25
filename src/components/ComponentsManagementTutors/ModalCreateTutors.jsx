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

  const handleCreateTutor = async (event) => {
    event.preventDefault();
    const tutor = {
      name: name,
      lastname: lastname,
      email: email,
      password: password,
    };
    setIsLoading(true);
    await axios
      .post(`${URLAPI}/auth/register-tutor`, tutor, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        //console.log(response);
        onOpenChange(false);
        setName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setIsLoading(false);
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        //console.log(error);
        setIsLoading(false);
        toast.error("Ocurrio un error", {
          position: "top-right",
          autoClose: 2000,
        });
      });
    setIsLoading(false);
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
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="name"
                      label="Nombre"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="lastname"
                      label="Apellido"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={lastname}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="email"
                      label="Correo"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                      className="bg-white rounded-xl"
                      fullWidth
                      isRequired
                      id="password"
                      label="Contraseña"
                      type="password"
                      variant="filled"
                      margin="normal"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
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
      {/* <ToastContainer />*/}
    </div>
  );
}

export default ModalCreateTutors;
