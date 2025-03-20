import React from "react";

interface Props {
  pdf_url: string;
}

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <iframe
      src={`https://docs.google.com/viewer?embedded=true&url=${pdf_url}`}
      className="w-full h-full"
    ></iframe>
  );
};

export default PDFViewer;
