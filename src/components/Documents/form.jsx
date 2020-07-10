import React, { useState, memo, useContext } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import DocumentTypeSelect from "./document_type_select.jsx";
import DocumentValueInput from "./document_value_input.jsx";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";
import SignersList from "./SignersList.jsx";

const DocumentForm = props => {
  const { t, index, handleRemoveDocument } = props;
  const { handleKeyUp, formName, formFor, handleChangeSignature } = useContext(
    DocumentsContext
  );
  const [document, setDocument] = useState(props.document);

  const {
    signature_required,
    upload_required,
    can_delete,
    signers_attributes
  } = document;

  const handleChangeStatus = (key, value) => {
    const documentTemp = { ...document };

    switch (key) {
      case "document_type_id":
        documentTemp.document_type_id = value;
        break;
      case "signature_required":
        documentTemp.signature_required = value;
        if (value && upload_required) documentTemp.upload_required = !value;
        if (!value) documentTemp.signers_order_required = value;
        handleChangeSignature();
        break;
      case "upload_required":
        documentTemp.upload_required = value;
        if (value && signature_required) {
          documentTemp.signature_required = !value;
          documentTemp.signers_order_required = !value;
        }
        break;
      case "signers_order_required":
        documentTemp.signers_order_required = value;
        break;
      case "person_email":
        setPerson;
        handleKeyUp(key, value);
        break;
      case "client_email":
        handleKeyUp(key, value);
        break;
      case "document_for_client":
        documentTemp.for_client = value;
        break;
      default:
        break;
    }

    setDocument(documentTemp);
  };

  const handleDeleteDocument = () => {
    handleRemoveDocument(index);
  };

  const drawDeleteDocumentButton = () => {
    if (can_delete) {
      return (
        <button
          type="button"
          className="btn btn-sm btn-link text-danger float-right"
          onClick={handleDeleteDocument}
          aria-label={t("documents.action.remove")}
          title={t("documents.action.remove")}
        >
          {" "}
          <i
            className="fa fas fa-trash h6"
            alt={t("documents.action.remove")}
          />
        </button>
      );
    } else {
      return <div className="mb-3" />;
    }
  };

  const drawDocumentType = () => {
    return (
      <DocumentTypeSelect
        document={document}
        handleChangeStatus={handleChangeStatus}
        t={t}
        index={index}
      />
    );
  };

  const drawDocumentValue = options => {
    return (
      <DocumentValueInput
        type={options["type"]}
        document={document}
        label={options["label"]}
        attribute={options["attribute"]}
        handleChangeStatus={handleChangeStatus}
        index={index}
      />
    );
  };

  return (
    <div className={`row ${document._destroy ? "d-none" : ""}`}>
      <div className="col-sm-12">
        <div className="card mb-3 py-3">
          <div className="float-right">
            {formFor === "person" && drawDeleteDocumentButton()}
          </div>
          <div className="card-body pt-0">
            <div className="row d-flex">
              <div className="col-md-9 flex-fill px-3">
                <div className="row">
                  <div className="col-md-6 flex-fill px-3">
                    {drawDocumentType()}
                  </div>
                  <div className="col-md-6 flex-fill px-3">
                    {drawDocumentValue({
                      type: "file",
                      attribute: "file",
                      label: t("documents.attributes.file")
                    })}
                  </div>
                  <div className="col-md-6 flex-fill px-3">
                    {formFor === "person" &&
                      drawDocumentValue({
                        type: "date",
                        attribute: "expire_at",
                        label: t("documents.attributes.expire_at")
                      })}
                  </div>
                </div>
              </div>
              <div className="col-md-3 flex-fill px-3">
                {drawDocumentValue({
                  type: "checkbox",
                  attribute: "signature_required",
                  label: t("documents.attributes.signature_required")
                })}
                {signature_required &&
                  drawDocumentValue({
                    type: "checkbox",
                    attribute: "signers_order_required",
                    label: t("documents.attributes.signers_order_required")
                  })}
                {formFor === "person" &&
                  drawDocumentValue({
                    type: "checkbox",
                    attribute: "upload_required",
                    label: t("documents.attributes.upload_required")
                  })}
              </div>
            </div>
            <div
              className={`row ${
                signature_required || upload_required ? "d-flex" : "d-none"
              }`}
            >
              <div className="col-md-9 flex-fill px-3">
                <DndProvider backend={Backend}>
                  <SignersList
                    documentSigners={signers_attributes}
                    documentIndex={index}
                    document={document}
                    t={t}
                  />
                </DndProvider>
              </div>
            </div>
          </div>
          <input
            type="hidden"
            name={`${formName}[${index}][id]`}
            value={document.id || ""}
          />
          <input
            type="hidden"
            name={`${formName}[${index}][_destroy]`}
            value={document._destroy || false}
          />
        </div>
      </div>
    </div>
  );
};

DocumentForm.propTypes = {
  index: PropTypes.number.isRequired,
  document: PropTypes.object.isRequired,
  handleRemoveDocument: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default memo(DocumentForm);
