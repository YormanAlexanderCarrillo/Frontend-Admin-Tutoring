"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const statusForum = {
  true: "ACTIVO",
  false: "INACTIVO",
};

function ModalEditForum({ isOpen, onOpenChange, session, forum }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && forum) {
      setTitle(forum.title);
      setDescription(forum.description);
      setStatus(forum.state);
    }
  }, [isOpen, forum]);

  const handleSelectionChange = (key) => {
    setStatus(key === "true");
  };

  const handleUpdateForum = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const forumUpdate = {
      title: title,
      description: description,
      state: status,
    };
    console.log(forumUpdate);
    await axios
      .put(`${URLAPI}/forum/update-forum/${forum._id}`, forumUpdate, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        //console.log(response.data);
        onOpenChange(false);
        setTitle("");
        setDescription("");
        setStatus(null);
        if (response.data.status === 200) {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 2000,
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error("No se pudo actualizar.", {
          position: "top-right",
          autoClose: 2000,
        });
        console.log(error);
        setIsLoading(false);
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
                Actualizar Foro
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleUpdateForum}
                >
                  <div className="w-4/5 sm:w-full">
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="title"
                      label="Titulo foro"
                      type="text"
                      variant="filled"
                      margin="normal"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
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
                    <Dropdown className="w-full">
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full capitalize mt-5"
                        >
                          {status !== null ? statusForum[status.toString()] : "Selecciona el estado"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={status !== null ? [status.toString()] : []}
                        onSelectionChange={(keys) => handleSelectionChange(Array.from(keys)[0])}
                      >
                        <DropdownItem key="true">ACTIVO</DropdownItem>
                        <DropdownItem key="false">INACTIVO</DropdownItem>
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
      <ToastContainer />
    </div>
  );
}

export default ModalEditForum;
