"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  CircularProgress,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import { useSession } from "next-auth/react";
import ModalCreateSubject from "./ModalCreateSubject";
import ModalEditSubject from "./ModalEditSubject";

const columns = [
  { name: "Codigo", uid: "subjectCode" },
  { name: "Nombre", uid: "name" },
  { name: "Descripcion", uid: "description" },
  { name: "Acciones", uid: "actions" },
];

export default function TableSubjects() {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: session, status } = useSession();
  const [subjects, setSubjects] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      getSubjects();
    }
  }, [status]);

  const getSubjects = async () => {
    axios
      .get(`${URLAPI}/subject/get-all-subjects`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        setSubjects(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  const openEditModal = (subject) => {
    setSelectedSubject(subject);
    setIsEditOpen(true);
  };

  const renderCell = useCallback((subject, columnKey) => {
    const cellValue = subject[columnKey];
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
            <Tooltip color="warning" content="Editar materia">
              <span className="text-lg text-warning cursor-pointer active:opacity-50" onClick={() => openEditModal(subject)}>
                <CiEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar Materia">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
        <Button color="warning" onClick={openCreateModal}>
          <CiCirclePlus
            size={30}
            color="black"
          />
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
        <TableBody items={subjects}>
          {(subject) => (
            <TableRow key={subject._id}>
              {(columnKey) => (
                <TableCell>{renderCell(subject, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalCreateSubject
        isOpen={isCreateOpen}
        onOpen={() => setIsCreateOpen(true)}
        onOpenChange={setIsCreateOpen}
        session={session}
      />
      <ModalEditSubject
        isOpen={isEditOpen}
        onOpen={() => setIsEditOpen(true)}
        onOpenChange={setIsEditOpen}
        session={session}
        subject={selectedSubject}
      />
    </div>
  );
}
