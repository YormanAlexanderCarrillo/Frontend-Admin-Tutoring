import { Select, SelectItem } from "@nextui-org/react";

function SelectSubject({ subjects, onSelectChange }) {
  
  const handleSelectedChange = (event) =>{
    const selectedId = event.target.value
    onSelectChange(selectedId)
  }

  return (
    <div>
      <Select
        items={subjects}
        label="Materia"
        placeholder="Seleccione una materia"
        className="max-w-xs"
        onChange={handleSelectedChange}
      >
        {subjects.map((subject) => (
          <SelectItem key={subject._id} value={subject._id}>
            {subject.name}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default SelectSubject;