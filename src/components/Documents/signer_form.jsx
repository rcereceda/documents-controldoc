import React, { Fragment, memo, useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { useDrag, useDrop } from "react-dnd";
import Select from "react-select";
import DocumentsContext from "../../contexts/documents/DocumentsContext.jsx";
import InputError from "./error.jsx";

const style = {
  border: "1px dashed gray",
  cursor: "move"
};

const SignerForm = props => {
  const {
    document,
    documentIndex,
    signer,
    t,
    signerIndex,
    signersOrderRequired,
    handleMoveSigner,
    handleRemoveSigner
  } = props;

  const {
    companySigners,
    signerTypes,
    formName,
    handleChangeEmail
  } = useContext(DocumentsContext);

  const [signerValue, setSignerValue] = useState(
    _.find(companySigners, { value: signer.email })
  );

  // --------------------------------------------------------
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = signerIndex;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      handleMoveSigner(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id: signer.order, index: signerIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  // --------------------------------------------------------

  const signerType = _.get(
    _.find(signerTypes, { value: signer.signer_type_id }),
    "type"
  );

  const handleDeleteSigner = () => {
    handleRemoveSigner(signerIndex);
  };

  const drawDocumentValue = options => {
    if (signerType === "company") {
      return (
        <Fragment>
          <label className="label-bold">{options["label"]}</label>
          {document.is_editable ? (
            <Select
              onChange={newValue => {
                setSignerValue(newValue);
              }}
              options={companySigners}
              value={signerValue}
              name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][${options["attribute"]}]`}
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
        <Fragment>
          <label className="label-bold">{options["label"]}</label>
          {document.is_editable ? (
            <Fragment>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="addon">
                    <i className="far fa-envelope" />
                  </span>
                </div>
                <input
                  className="form-control"
                  type="text"
                  value={signer.email}
                  name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][${options["attribute"]}]`}
                  onChange={e => {
                    handleChangeEmail(e.target.value, options["signer_type"]);
                  }}
                />
              </div>
              <InputError attr={options["attribute"]} errors={signer.errors} />
            </Fragment>
          ) : (
            <p>{signer.email}</p>
          )}
        </Fragment>
      );
    }
  };

  const drawDeleteSignerButton = () => {
    if (document.is_editable && signerType === "company") {
      return (
        <button
          type="button"
          className="btn btn-sm btn-link text-dark float-right"
          onClick={handleDeleteSigner}
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
    <div
      className={`card bg-light mb-3 px-3 pt-3 ${
        signer._destroy ? "d-none" : ""
      }`}
      ref={ref}
      style={
        document.signers_order_required && document.is_editable
          ? { ...style, opacity }
          : {}
      }
    >
      <div className="row pb-3">
        <div className="col-md-6">
          {signersOrderRequired && (
            <span className="text-muted">{signerIndex + 1}° Firma</span>
          )}
          <br />
          {drawDocumentValue({
            type: "text",
            attribute: "email",
            signer_email: signer.email,
            signer_type: signerType,
            label: t(`documents.attributes.${signerType}_email`)
          })}
        </div>
        <div className="col-md-6">{drawDeleteSignerButton()}</div>
        <input
          type="hidden"
          name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][id]`}
          value={signer.id}
        />
        <input
          type="hidden"
          name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][order]`}
          value={signerIndex}
        />
        <input
          type="hidden"
          name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][signer_type_id]`}
          value={signer.signer_type_id}
        />
        <input
          type="hidden"
          name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][_destroy]`}
          value={signer._destroy || false}
        />
      </div>
    </div>
  );
};

SignerForm.propTypes = {
  document: PropTypes.object.isRequired,
  documentIndex: PropTypes.number.isRequired,
  handleMoveSigner: PropTypes.func.isRequired,
  handleRemoveSigner: PropTypes.func.isRequired,
  signerIndex: PropTypes.number.isRequired,
  signer: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default memo(SignerForm);
