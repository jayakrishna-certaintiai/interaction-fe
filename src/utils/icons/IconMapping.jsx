import {
  BsFiletypePdf,
  BsFiletypeDocx,
  BsFiletypeDoc,
  BsFiletypeCsv,
  BsFiletypeXlsx,
  BsFiletypeXls,
  BsFiletypePptx,
  BsFiletypePpt,
} from "react-icons/bs";

export const iconMapping = {
  pdf: (
    <BsFiletypePdf
      style={{
        color: "red",
        fontSize: "20px",
      }}
    />
  ),
  pptx: (
    <BsFiletypePptx
      style={{
        color: "#FD5707",
        fontSize: "20px",
      }}
    />
  ),
  ppt: (
    <BsFiletypePpt
      style={{
        color: "#FD5707",
        fontSize: "20px",
      }}
    />
  ),
  xlsx: (
    <BsFiletypeXlsx
      style={{
        color: "green",
        fontSize: "20px",
      }}
    />
  ),
  xls: (
    <BsFiletypeXls
      style={{
        color: "green",
        fontSize: "20px",
      }}
    />
  ),
  docx: (
    <BsFiletypeDocx
      style={{
        color: "blue",
        fontSize: "20px",
      }}
    />
  ),
  doc: (
    <BsFiletypeDoc
      style={{
        color: "blue",
        fontSize: "20px",
      }}
    />
  ),
  csv: (
    <BsFiletypeCsv
      style={{
        color: "green",
        fontSize: "20px",
      }}
    />
  ),
};
