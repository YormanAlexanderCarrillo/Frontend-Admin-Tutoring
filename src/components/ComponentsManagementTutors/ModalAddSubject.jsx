"use client";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import axios from "axios";
import React, { useState } from "react";

function ModalAddSubject({ isOpen, onOpenChange, session, subjects, tutor }) {
  const APIURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [idSubject, setIdSubject] = useState();
  const [idTutor, setIdTutor] = useState("");

  const handleAddSubject = async (event) => {
    event.preventDefault()
    console.log(tutor._id);
    setIdTutor(idTutor)
    axios
      .post(`${APIURL}/user/add-subject-to-tutor/${idTutor}/${idSubject}`, {
        Headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        console.log(response);
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
                  onSubmit={handleAddSubject}
                >
                  <div className="w-4/5 sm:w-full ">
                    <Select
                      isRequired
                      label="Asignatura"
                      placeholder="Seleccione asignatura"
                      className="max-w-xs"
                    >
                      {subjects.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id} onClick={(value)=> setIdSubject(value._id)}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <div className="flex justify-end pt-5">
                      <Button
                        className="w-28"
                        variant="solid"
                        color="success"
                        type="submit"
                      >
                        Agregar
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

export default ModalAddSubject;
