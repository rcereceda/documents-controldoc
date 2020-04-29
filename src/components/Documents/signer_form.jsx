import React, { Fragment, memo, useContext, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Select from "react-select";
import DocumentValueInput from "./document_value_input.jsx";
import { DocumentsContext } from "../../contexts/DocumentsContext.js";
import InputError from "./error.jsx";

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

  const { companySigners } = useContext(DocumentsContext);

  const [signerValue, setSignerValue] = useState(
    _.find(companySigners, { value: signer.email })
  );

  const signer_type = _.get(
    _.find(signer_types, { value: signer.signer_type_id }),
    "type"
  );

  const handleDelete = event => {
    event.preventDefault();
    deleteItem(document.key, signer.key);
  };

  const drawDocumentValue = options => {
    if (signer_type === "company") {
      return (
        <Fragment>
          <label className="label-bold">{options["label"]}</label>
          {document.is_editable ? (
            <Select
              onChange={newValue => {
                handleChangeStatus("company_email", newValue.value);
                setSignerValue(newValue);
              }}
              options={companySigners}
              isDisabled={!document.is_editable}
              value={signerValue}
              name={`${name}[${options["attribute"]}]`}
              placeholder={`-- ${t("documents.attributes.signers.options")} --`}
            />
          ) : (
            <p>{signerValue.label}</p>
          )}
          <InputError attr={options["attribute"]} errors={signer.errors} />
        </Fragment>
      );
    } else {
      return (
        <DocumentValueInput
          type={options["type"]}
          document={document}
          signer={signer}
          name={name}
          label={options["label"]}
          attribute={options["attribute"]}
          signer_email={options["signer_email"]}
          signer_type={options["signer_type"]}
          handleChangeStatus={handleChangeStatus}
        />
      );
    }
  };

  const drawDeleteButton = () => {
    if (document.is_editable && signer_type === "company") {
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
    } else {
      return <div className="mb-3" />;
    }
  };

  return (
    <div className="row pb-3">
      <div className="col-md-6">
        {drawDocumentValue({
          type: "text",
          attribute: "email",
          signer_email: signer.email,
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
