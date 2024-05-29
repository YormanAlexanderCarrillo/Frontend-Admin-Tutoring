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

function ModalCreateSubject({ isOpen, onOpen, onOpenChange, session }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveSubject = async (event) => {
    event.preventDefault();
    const subject = {
      subjectCode: code,
      name: name,
      description: description,
    };
    await axios
      .post(
        `${URLAPI}/subject/register-subject`,
        subject,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        onOpenChange(false);
        setCode("");
        setName("");
        setDescription("");
      })
      .catch((error) => {
        console.log(error);
      });
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
                      id="name"
                      label="Codigo"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                    />
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
                      onChange={(event) => setName(event.target.value)}
                    />
                    <Input
                      className="bg-white rounded-xl"
                      fullWidth
                      isRequired
                      id="reason"
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
