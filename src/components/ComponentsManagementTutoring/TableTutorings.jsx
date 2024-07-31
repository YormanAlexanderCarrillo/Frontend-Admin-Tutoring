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
} from "@nextui-org/react";
import { FaCheck } from "react-icons/fa6";
import { ImCancelCircle } from "react-icons/im";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

const columns = [
  { name: "Nombre", uid: "name" },
  { name: "Motivo", uid: "reason" },
  { name: "Estudiante", uid: "student" },
  { name: "Fecha", uid: "date" },
  { name: "Hora", uid: "hour" },
  { name: "Estado", uid: "status" },
  { name: "Acciones", uid: "actions" },
];

export default function TableTutorings() {
  const URLAPI = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { data: session, status } = useSession();
  const [tutorings, setTutorings] = useState([]);
  const [sessionToken, setSessionToken] = useState(null);

useEffect(() => {
  if (status === "authenticated") {
    setSessionToken(session.user.token);
    getTutorings();
  }
}, [status]);


  const getTutorings = async () => {
    try {
      const response = await axios.get(
        `${URLAPI}/tutoring/get-all-tutoring-by-tutor/${session.user.userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      console.log(response.data);
      if(response.data.status === 200){
        setTutorings(response.data.data);
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatusTutoring = async (idTutoring, newStatusTutoring) => {
    try {
      const response = await axios.put(
        `${URLAPI}/tutoring/update-status-tutoring/${idTutoring}/${newStatusTutoring}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.status === 200) {
        getTutorings();
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success("No se pudo actualizar el estado", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderCell = useCallback((tutoring, columnKey) => {
    const cellValue = tutoring[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div>
            <p>{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <div>
            <p>{cellValue ? "Activo" : "Inactivo"}</p>
          </div>
        );
      case "date":
        const dateValue = cellValue ? cellValue.split("T")[0] : "";
        return (
          <div>
            <p>{dateValue}</p>
          </div>
        );
      case "student":
        const studentName = cellValue ? cellValue.name : "";
        return (
          <div>
            <p>{studentName}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 space-x-4">
            <Tooltip color="success" content="Aceptar">
              <span
                className="text-lg text-success cursor-pointer active:opacity-50"
                onClick={()=>changeStatusTutoring(tutoring._id, true)}
              >
                <FaCheck />
              </span>
            </Tooltip>
            <Tooltip color="warning" content="Cancelar">
              <span
                className="text-lg text-warning cursor-pointer active:opacity-50"
                onClick={()=>changeStatusTutoring(tutoring._id, false)}
              >
                <ImCancelCircle />
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
    <div className="flex flex-col items-center w-11/12">
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
        <TableBody items={tutorings}>
          {(tutoring) => (
            <TableRow key={tutoring._id}>
              {(columnKey) => (
                <TableCell>{renderCell(tutoring, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ToastContainer />
    </div>
  );
}
