"use client";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import ModalCreateTutors from "./ModalCreateTutors";
import ModalAddSubject from "./ModalAddSubject";
import { toast } from "react-toastify";

const columns = [
  { name: "Nombre", uid: "name" },
  { name: "Apellido", uid: "lastname" },
  { name: "Correo", uid: "email" },
  { name: "Rol", uid: "role" },
  { name: "Acciones", uid: "actions" },
];

function TableTutors() {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: session, status } = useSession();
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isCreateTutorOpen, setIsCreateTutorOpen] = useState(false);
  const [isEditTutorOpen, setIsEditTutorOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      getTutors();
    }
  }, [status]);

  useEffect(() => {
    if (isEditTutorOpen === false || isCreateTutorOpen === false) {
      getTutors();
    }
  }, [isEditTutorOpen, isCreateTutorOpen]);

  useEffect(() => {
    if (isAddSubjectOpen === true) {
      getSubjects();
    }
  }, [isAddSubjectOpen]);

  const getTutors = async () => {
    axios
      .get(`${URLAPI}/user/get-tutors`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setTutors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubjects = async () => {
    axios
      .get(`${URLAPI}/subject/get-all-subjects`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        setSubjects(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteTutor = async (tutorId) => {
    axios
      .delete(`${URLAPI}/user/delete-tutor/${tutorId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 200) {
          getTutors();
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 2000,
          });
        }
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openCreateTutorModal = () => {
    setIsCreateTutorOpen(true);
  };

  const openEditTutorModal = (tutor) => {
    setIsEditTutorOpen(true);
  };

  const openAddSubjectModal = (tutor) => {
    setSelectedTutor(tutor);
    setIsAddSubjectOpen(true);
  };

  const renderCell = useCallback((tutor, columnKey) => {
    const cellValue = tutor[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip color="primary" content="Asignar Materias">
              <span
                className="text-lg text-primary cursor-pointer active:opacity-50"
                onClick={() => openAddSubjectModal(tutor)}
              >
                <MdOutlineBookmarkAdd />
              </span>
            </Tooltip>
            <Tooltip color="warning" content="Editar tutor">
              <span
                className="text-lg text-warning  cursor-pointer active:opacity-50"
                onClick={() => openEditTutorModal(tutor)}
              >
                <CiEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar Tutor">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteTutor(tutor._id)}
              >
                <MdDeleteOutline />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center ">
        <CircularProgress color="warning" aria-label="Loading..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-3/4">
      <div className="mb-4 w-full flex justify-end">
        <Button color="warning" onClick={openCreateTutorModal}>
          <CiCirclePlus size={30} color="black" />
        </Button>
      </div>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tutors}>
          {(tutor) => (
            <TableRow key={tutor._id}>
              {(columnKey) => (
                <TableCell>{renderCell(tutor, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalCreateTutors
        isOpen={isCreateTutorOpen}
        onOpen={() => setIsCreateTutorOpen(true)}
        onOpenChange={setIsCreateTutorOpen}
        session={session}
      />
      <ModalAddSubject
        isOpen={isAddSubjectOpen}
        onOpenChange={setIsAddSubjectOpen}
        session={session}
        subjects={subjects}
        tutor={selectedTutor}
      />
    </div>
  );
}

export default TableTutors;
