import React, {
  Fragment,
  memo,
  useContext,
  useState,
  useRef,
  useEffect
} from "react";
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
    documentSigner,
    t,
    signerIndex,
    signersOrderRequired,
    handleMoveSigner,
    handleRemoveSigner,
    getSignerTypeId
  } = props;

  const {
    companySigners,
    signerTypes,
    formName,
    handleChangeEmail,
    formFor,
    personEmail,
    changingPersonEmail,
    externalEmail
  } = useContext(DocumentsContext);

  const [signer, setSigner] = useState(documentSigner);
  const [signerValue, setSignerValue] = useState(
    _.find(companySigners, { value: signer.email })
  );

  useEffect(() => {
    const newSigner = { ...signer };
    newSigner.order = signerIndex;
    setSigner(newSigner);
  }, [signerIndex]);

  useEffect(() => {
    const newSigner = { ...signer };
    if (
      newSigner.signer_type_id === getSignerTypeId("person") &&
      changingPersonEmail &&
      document.is_editable
    ) {
      newSigner.email = personEmail;
    }
    setSigner(newSigner);
  }, [personEmail, changingPersonEmail]);

  useEffect(() => {
    const newSigner = { ...signer };
    if (
      newSigner.signer_type_id === getSignerTypeId("external") &&
      document.is_editable &&
      formFor === "person"
    ) {
      newSigner.email =
        externalEmail.trim() === "" ? signer.email : externalEmail;
    }
    setSigner(newSigner);
  }, [externalEmail]);

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
          <label className="label-bold">
            {formFor === "person"
              ? t(`documents.attributes.company_email`)
              : t(`documents.attributes.internal_email`)}
          </label>
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
    } else if (signerType === "person" || signerType === "external") {
      return (
        <Fragment>
          <label className="label-bold">
            {formFor === "company"
              ? t(`documents.attributes.external_email`)
              : t(`documents.attributes.client_email`)}
          </label>
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
                  defaultValue={signer.email}
                  name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][${options["attribute"]}]`}
                  onChange={e => {
                    if (formFor === "person") {
                      handleChangeEmail(e.target.value, options["signer_type"]);
                    }
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
    if (
      (document.is_editable && signerType === "company") ||
      formFor === "company"
    ) {
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

  const drawHiddenInput = attribute => (
    <input
      type="hidden"
      name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][${attribute}]`}
      value={signer[attribute]}
    />
  );

  const drawSignerTypeInput = () => {
    if (formFor === "person") {
      return drawHiddenInput("signer_type_id");
    } else if (formFor === "company") {
      return (
        <div className="col-md-5">
          <label className="label-bold">
            {t(`documents.attributes.signer_types.label`)}
          </label>
          <Select
            onChange={newValue => {
              const newSigner = { ...signer };
              newSigner.signer_type_id = newValue.value;
              setSigner(newSigner);
            }}
            options={_.filter(
              signerTypes,
              signerType => signerType.type !== "person"
            )}
            name={`${formName}[${documentIndex}][signers_attributes][${signerIndex}][signer_type_id]`}
            placeholder={`-- ${t(
              "documents.attributes.signer_types.options"
            )} --`}
          />
        </div>
      );
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
      {signersOrderRequired && (
        <div className="row">
          <div className="col-md-12">
            <span className="text-muted">{signerIndex + 1}° Firma</span>
          </div>
        </div>
      )}
      <div className="row pb-3">
        {drawSignerTypeInput()}
        <div className={`col-md-${formFor === "person" ? "6" : "6"}`}>
          {drawDocumentValue({
            type: "text",
            attribute: "email",
            signer_email: signer.email,
            signer_type: signerType,
            label: t(`documents.attributes.${signerType}_email`)
          })}
        </div>
        <div className={`col-md-${formFor === "person" ? "6" : "1"}`}>
          {drawDeleteSignerButton()}
        </div>
        {drawHiddenInput("id")}
        {drawHiddenInput("order")}
        {drawHiddenInput("_destroy")}
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
  documentSigner: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default memo(SignerForm);
