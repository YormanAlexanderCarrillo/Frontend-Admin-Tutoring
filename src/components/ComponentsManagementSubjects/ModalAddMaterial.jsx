import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { FileInput, Label } from "flowbite-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { IoCloudUploadOutline } from "react-icons/io5";

function ModalAddMaterial({ isOpen, onOpenChange, session, subject }) {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10000000) {
        toast.error("El archivo excede el tamaño máximo permitido (10MB)", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setSelectedFile(file);
        setFileName(file.name);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10000000) {
        toast.error("El archivo excede el tamaño máximo permitido (10MB)", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        setSelectedFile(file);
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${URLAPI}/file/upload-file/${subject._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
            "content-type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setSelectedFile(null);
      setFileName("");
      setIsLoading(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Ocurrio un error", {
        position: "top-right",
        autoClose: 2000,
      });
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (selectedFile) {
      setSelectedFile(null);
      setFileName("");
    }
    onOpenChange(false);
  };

  return (
    <div>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={handleCloseModal}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                Agregar Material
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center"
                  onSubmit={handleSubmit}
                >
                  <div className="w-4/5 sm:w-full ">
                    <div
                      className="flex flex-col items-center justify-center"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Label
                        htmlFor="dropzone-file"
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-gray-300"
                      >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <IoCloudUploadOutline size={40} color="red" />
                          {fileName ? (
                            <p className="mb-2 text-sm text-gray-600 ">
                              <span className="font-semibold">{fileName}</span>
                            </p>
                          ) : (
                            <p className="mb-2 text-sm text-gray-600 ">
                              <span className="font-semibold">
                                Click para subir o arrastre y suelte
                              </span>
                            </p>
                          )}
                        </div>
                        <FileInput
                          id="dropzone-file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt, .pptx, image/*"
                        />
                      </Label>
                    </div>

                    <div className="flex justify-end pt-5">
                      <Button
                        className="w-28"
                        variant="solid"
                        color="success"
                        isLoading={isLoading}
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

export default ModalAddMaterial;
