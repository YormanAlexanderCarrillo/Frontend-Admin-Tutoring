import {
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

export default function ModalCreateForum({ isOpen, onOpenChange,session }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading]= useState(false)

  const handleSaveForum = async (event) => {
    event.preventDefault();
    const forum = {
      title: title,
      description: description,
    };
    setIsLoading(true)
    await axios
      .post(`${URLAPI}/forum/create-forum/${session.user.userData._id}`, forum, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        //console.log(response);
        onOpenChange(false);
        setTitle("");
        setDescription("");
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false)
      });
      setIsLoading(false)
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
                Crear Foro
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleSaveForum}
                >
                  <div className="w-4/5 sm:w-full ">
                    <Input
                      className="bg-white rounded-xl mb-5"
                      fullWidth
                      isRequired
                      id="name"
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
                        isLoading={isLoading}
                      >
                        Crear
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
