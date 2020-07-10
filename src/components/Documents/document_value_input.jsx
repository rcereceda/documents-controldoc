import React, { useState, useContext } from "react";
import _ from "lodash";
import Cleave from "cleave.js/react";
import InputError from "./error.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";

const DocumentValueInput = props => {
  const { formName } = useContext(DocumentsContext);
  const {
    type,
    attribute,
    document,
    index,
    label,
    signer_type,
    handleChangeStatus,
    signer
  } = props;
  const {
    upload_required,
    signature_required,
    signers_order_required,
    is_editable,
    file,
    expire_at
  } = document;
  const isCheckbox = type === "checkbox";
  const errors = signer !== undefined ? signer.errors : document.errors;

  const [documentFile, setDocumentFile] = useState(file);

  const handleFileChange = e => {
    const newFile = e.target.files[0];
    setDocumentFile(newFile);
  };

  const handleInputChange = e => {
    const input = e.target;
    const setValue = input.type === "checkbox" ? input.checked : input.value;
    if (signer_type !== undefined)
      handleChangeStatus(`${signer_type}_${attribute}`, setValue);
    else handleChangeStatus(attribute, setValue);
  };

  const drawInput = () => {
    switch (type) {
      case "date":
        if (is_editable) {
          return (
            <Cleave
              placeholder="DD/MM/AAAA"
              options={{
                date: true,
                delimiter: "/",
                datePattern: ["d", "m", "Y"]
              }}
              className="form-control"
              name={`${formName}[${index}][${attribute}]`}
              value={expire_at}
            />
          );
        } else {
          return <p>{expire_at}</p>;
        }
      case "file":
        if (is_editable) {
          return (
            <input
              id={`${attribute}-${index}`}
              className="form-control"
              type={type}
              name={`${formName}[${index}][${attribute}]`}
              onChange={handleFileChange}
            />
          );
        } else {
          return drawFileLink();
        }
      case "checkbox":
        switch (attribute) {
          case "signature_required":
            if (is_editable) {
              return (
                <div className="custom-control custom-switch">
                  <input
                    id={`switch_${attribute}_${index}`}
                    className="custom-control-input"
                    type={type}
                    checked={signature_required}
                    name={`${formName}[${index}][${attribute}]`}
                    onChange={handleInputChange}
                  />
                  <label
                    className="custom-control-label label-bold"
                    htmlFor={`switch_${attribute}_${index}`}
                  >
                    {label}
                  </label>
                </div>
              );
            } else {
              return (
                <span
                  className={`badge badge-pill ml-1 badge-${document.label.style}`}
                >
                  {document.label.text}
                </span>
              );
            }
          case "upload_required":
            if (is_editable) {
              return (
                <div className="custom-control custom-switch">
                  <input
                    id={`switch_${attribute}_${index}`}
                    className="custom-control-input"
                    type={type}
                    checked={upload_required}
                    name={`${formName}[${index}][${attribute}]`}
                    onChange={handleInputChange}
                  />
                  <label
                    className="custom-control-label label-bold"
                    htmlFor={`switch_${attribute}_${index}`}
                  >
                    {label}
                  </label>
                </div>
              );
            }
            break;
          case "signers_order_required":
            if (is_editable) {
              return (
                <div className="custom-control custom-switch">
                  <input
                    id={`switch_${attribute}_${index}`}
                    className="custom-control-input"
                    type={type}
                    checked={signers_order_required}
                    name={`${formName}[${index}][${attribute}]`}
                    onChange={handleInputChange}
                  />
                  <label
                    className="custom-control-label label-bold"
                    htmlFor={`switch_${attribute}_${index}`}
                  >
                    {label}
                  </label>
                </div>
              );
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  const formatFilename = url => {
    const filename = _.last(url.split("/"));
    if (filename.length > 25) {
      return filename.substring(0, 25).concat("...");
    } else {
      return filename;
    }
  };

  const drawFileLink = () => {
    if (type === "file" && _.isInteger(document.id)) {
      const url = document.file.url;
      let filename = "";
      if (url !== undefined && url !== null) filename = formatFilename(url);

      return (
        <div className="float-right">
          <a href={url} target="_blank">
            {filename}
          </a>
        </div>
      );
    }
  };

  const drawLabel = () => {
    return (
      <label htmlFor="" className="label-bold">
        {label}
      </label>
    );
  };

  return (
    <div className="form-group row">
      <div className="flex-fill px-3">
        {isCheckbox ? "" : drawLabel()}
        {is_editable ? drawFileLink() : ""}
        <div className={isCheckbox ? "" : "input-group"}>{drawInput()}</div>
        <InputError attr={attribute} errors={errors} />
      </div>
    </div>
  );
};

export default DocumentValueInput;
