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
} from "@nextui-org/react";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { IoDocumentAttachOutline } from "react-icons/io5";
import axios from "axios";
import { useSession } from "next-auth/react";
import ModalCreateForum from "./ModalCreateForum";
import ModalEditForum from "./ModalEditForum";

const columns = [
  { name: "Titulo", uid: "title" },
  { name: "Descripción", uid: "description" },
  { name: "Acciones", uid: "actions" },
];

export default function TableForum() {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: session, status } = useSession();
  const [forums, setForums] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedForum, setSelectedForum]= useState()

  useEffect(() => {
    if (status === "authenticated") {
      getForums();
    }
  }, [status, isCreateOpen, isEditOpen]);

  const getForums = async () => {
    axios
      .get(`${URLAPI}/forum/get-forums`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
        setForums(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteForum = async (forumId) => {
    axios
      .delete(`${URLAPI}/forum/delete-forum/${forumId}`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
      })
      .then((response) => {
        if (response.data.status === 200) {
          getForums();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const openCreateForum = () => {
    setIsCreateOpen(true);
  };

  const openEditForum = (forum) => {
    setSelectedForum(forum);
    setIsEditOpen(true);
  };

  const renderCell = useCallback((forum, columnKey) => {
    const cellValue = forum[columnKey];
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
            <Tooltip color="warning" content="Editar foro">
              <span
                className="text-lg text-warning cursor-pointer active:opacity-50"
                onClick={() => openEditForum(forum)}
              >
                <CiEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar foro">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => handleDeleteForum(forum._id)}
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
        <Button color="warning" onClick={openCreateForum}>
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
        <TableBody items={forums}>
          {(forum) => (
            <TableRow key={forum._id}>
              {(columnKey) => (
                <TableCell>{renderCell(forum, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ModalCreateForum
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        session={session}
      />
      <ModalEditForum isOpen={isEditOpen} onOpenChange={setIsEditOpen} session={session} forum={selectedForum}/>
    </div>
  );
}
