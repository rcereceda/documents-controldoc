import React, { memo } from "react";
import DocumentValueInput from "./document_value_input.jsx";
import PropTypes from "prop-types";
import _ from "lodash";

const SignerForm = props => {
  const {
    deleteItem,
    handleChangeStatus,
    name,
    document,
    signer,
    signer_types,
    t
  } = props;
  const validSignature =
    document.valid_person_signature ||
    document.valid_company_signature ||
    document.valid_client_signature;
  const rejected = document.state === "rejected";
  const signer_type = _.get(
    _.find(signer_types, { value: signer.signer_type_id }),
    "type"
  );

  const handleDelete = event => {
    event.preventDefault();
    deleteItem(document.key, signer.key);
  };

  const drawDocumentValue = options => {
    return (
      <DocumentValueInput
        type={options["type"]}
        document={document}
        signer={signer}
        name={name}
        label={options["label"]}
        attribute={options["attribute"]}
        signer_type={options["signer_type"]}
        valid_signature={validSignature}
        handleChangeStatus={handleChangeStatus}
      />
    );
  };

  const drawDeleteButton = () => {
    if (validSignature || rejected || signer_type !== "company") {
      return <div className="mb-3" />;
    } else {
      return (
        <button
          className="btn btn-sm btn-link text-dark float-right"
          onClick={handleDelete}
          aria-label={t("documents.action.remove")}
          title={t("documents.action.remove")}
        >
          {" "}
          <i
            className="fa fas fa-times h6"
            alt={t("documents.action.remove")}
          />
        </button>
      );
    }
  };

  return (
    <React.Fragment>
      <div className={`row ${signer._destroy ? "d-none" : ""}`}>
        <div className="col-md-6">
          {drawDocumentValue({
            type: "text",
            attribute: "email",
            signer_type: signer_type,
            label: t(`documents.attributes.${signer_type}_email`)
          })}
        </div>
        <div className="col-md-6">{drawDeleteButton()}</div>
        <input type="hidden" name={`${name}[id]`} value={signer.id || ""} />
        <input
          type="hidden"
          name={`${name}[signer_type_id]`}
          value={signer.signer_type_id}
        />
        <input
          type="hidden"
          name={`${name}[_destroy]`}
          value={signer._destroy || false}
        />
      </div>
    </React.Fragment>
  );
};

SignerForm.propTypes = {
  signer: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  handleChangeStatus: PropTypes.func.isRequired
};

export default memo(SignerForm);
