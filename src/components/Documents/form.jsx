import React, { useState, memo } from "react";
import DocumentTypeSelect from "./document_type_select.jsx";
import DocumentValueInput from "./document_value_input.jsx";
import SignerForm from "./signer_form.jsx";
import PropTypes from "prop-types";

const DocumentForm = props => {
  const {
    deleteItem,
    keyUpInput,
    addSigner,
    handleSignatureRequired,
    handleUploadRequired,
    name,
    document,
    document_types,
    signer_types,
    t
  } = props;
  const [document_type_id, setDocumentTypeId] = useState(
    document.document_type_id
  );
  const [document_for_client, setDocumentForClient] = useState(
    document.for_client
  );
  const [signature_required, setSignatureRequired] = useState(
    document.signature_required
  );
  const [upload_required, setUploadRequired] = useState(
    document.upload_required
  );
  const validSignature =
    document.valid_person_signature ||
    document.valid_company_signature ||
    document.valid_client_signature;
  const rejected = document.state === "rejected";

  const handleDelete = event => {
    event.preventDefault();
    deleteItem(document.key);
  };

  const handleKeyUp = (key, value) => {
    keyUpInput(key, value);
  };

  const handleAddSigner = event => {
    event.preventDefault();
    addSigner(document.key);
  };

  const drawDocumentType = () => {
    return (
      <DocumentTypeSelect
        document_type_id={document_type_id}
        document={document}
        options={document_types}
        name={name}
        valid_signature={validSignature}
        handleChangeStatus={handleChangeStatus}
        t={t}
      />
    );
  };

  const drawDocumentValue = options => {
    return (
      <DocumentValueInput
        type={options["type"]}
        document={document}
        name={name}
        label={options["label"]}
        attribute={options["attribute"]}
        valid_signature={validSignature}
        signature_required={signature_required}
        upload_required={upload_required}
        handleChangeStatus={handleChangeStatus}
      />
    );
  };

  const drawDeleteButton = () => {
    if (validSignature || rejected) {
      return <div className="mb-3" />;
    } else {
      return (
        <button
          className="btn btn-sm btn-link text-danger float-right"
          onClick={handleDelete}
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
    }
  };

  const renderAddButton = () => {
    if (signature_required && !validSignature && !rejected) {
      return (
        <button
          className="btn btn-dark btn-sm"
          onClick={handleAddSigner}
          name="add_signer"
        >
          <i className="fas fa-user" /> &nbsp;{" "}
          {t("documents.action.add_signer")}
        </button>
      );
    }
  };

  const drawSignerForms = () => {
    if (document.signers_attributes.length > 0) {
      return document.signers_attributes.map((signer, index) => {
        return (
          <div
            className={`card bg-light mb-3 px-3 pt-3 ${
              signer._destroy ? "d-none" : ""
            }`}
            key={signer.key || index}
          >
            <SignerForm
              key={signer.key || index}
              name={`${name}[signers_attributes][${index}]`}
              document={document}
              signer={signer}
              signer_types={signer_types}
              deleteItem={deleteItem}
              handleChangeStatus={handleChangeStatus}
              t={t}
            />
          </div>
        );
      });
    }
  };

  const handleChangeStatus = (key, value) => {
    switch (key) {
      case "document_type_id":
        setDocumentTypeId(value);
        break;
      case "signature_required":
        setSignatureRequired(value);
        handleSignatureRequired(document.key, document_for_client, value);
        if (value && upload_required) setUploadRequired(!value);
        break;
      case "upload_required":
        setUploadRequired(value);
        handleUploadRequired(document.key, value);
        if (value && signature_required) setSignatureRequired(!value);
        break;
      case "person_email":
        handleKeyUp(key, value);
        break;
      case "client_email":
        handleKeyUp(key, value);
        break;
      case "document_for_client":
        setDocumentForClient(value);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <div className={`row ${document._destroy ? "d-none" : ""}`}>
        <div className="col-sm-12">
          <div className="card mb-3">
            <div className="float-right">{drawDeleteButton()}</div>
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
                  </div>
                </div>
                <div className="col-md-3 flex-fill px-3">
                  {drawDocumentValue({
                    type: "checkbox",
                    attribute: "signature_required",
                    label: t("documents.attributes.signature_required")
                  })}
                  {drawDocumentValue({
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
                  {drawSignerForms()}
                  {renderAddButton()}
                </div>
              </div>
            </div>
            <input
              type="hidden"
              name={`${name}[id]`}
              value={document.id || ""}
            />
            <input
              type="hidden"
              name={`${name}[_destroy]`}
              value={document._destroy || false}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

DocumentForm.propTypes = {
  document: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  addSigner: PropTypes.func.isRequired,
  handleSignatureRequired: PropTypes.func.isRequired,
  handleUploadRequired: PropTypes.func.isRequired
};

export default memo(DocumentForm);
