import React from "react";
import InputError from "./error.jsx";
import _ from "lodash";

class DocumentValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.document.file,
      signature_required: props.document.signature_required,
      upload_required: props.document.upload_required,
      person_email: props.document.person_email,
      company_email: props.document.company_email,
      client_email: props.document.client_email,
      email: props.document[`${props.signer_type}_email`]
    };

    this.const_attribute =
      props.signer_type !== undefined
        ? props.document[`${props.signer_type}_email`]
        : props.document[props["attribute"]];

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.attribute === "person_email" &&
      prevState.person_email !== nextProps.document.person_email
    ) {
      return {
        person_email: nextProps.document.person_email
      };
    } else if (
      nextProps.attribute === "client_email" &&
      prevState.client_email !== nextProps.document.client_email
    ) {
      return {
        client_email: nextProps.document.client_email
      };
    } else if (
      nextProps.attribute === "email" &&
      nextProps.signer_type !== undefined &&
      nextProps.signer_type !== "company" &&
      prevState.email !== nextProps.document[`${nextProps.signer_type}_email`]
    ) {
      return {
        email: nextProps.document[`${nextProps.signer_type}_email`]
      };
    }

    return null;
  }

  drawDocumentValue() {
    const {
      type,
      attribute,
      document,
      name,
      valid_signature,
      upload_required,
      signature_required
    } = this.props;
    let state_attribute = this.state[attribute];
    let rejected = document.state === "rejected";

    switch (type) {
      case "file":
        if (valid_signature || rejected) {
          return this.drawFileLink();
        } else {
          return (
            <input
              id={attribute}
              className="form-control"
              type={type}
              name={`${name}[${attribute}]`}
              onChange={this.handleFileChange}
            />
          );
        }
      case "text":
        if (valid_signature || rejected) {
          return <div>{this.const_attribute}</div>;
        } else {
          return (
            <input
              className="form-control"
              type={type}
              value={state_attribute || ""}
              name={`${name}[${attribute}]`}
              onChange={this.handleInputChange}
            />
          );
        }
      case "checkbox":
        switch (attribute) {
          case "signature_required":
            if (valid_signature || rejected) {
              return (
                <span
                  className={`badge badge-pill ml-1 badge-${document.label.style}`}
                >
                  {document.label.text}
                </span>
              );
            } else {
              return (
                <div className="custom-control custom-switch">
                  <input
                    id={`switch_${attribute}_${document.key}`}
                    className="custom-control-input"
                    type={type}
                    checked={signature_required || false}
                    name={`${name}[${attribute}]`}
                    onChange={this.handleInputChange}
                  />
                  <label
                    className="custom-control-label label-bold"
                    htmlFor={`switch_${attribute}_${document.key}`}
                  >
                    {this.props.label}
                  </label>
                </div>
              );
            }
          case "upload_required":
            if (!valid_signature && !rejected) {
              return (
                <div className="custom-control custom-switch">
                  <input
                    id={`switch_${attribute}_${document.key}`}
                    className="custom-control-input"
                    type={type}
                    checked={upload_required || false}
                    name={`${name}[${attribute}]`}
                    onChange={this.handleInputChange}
                  />
                  <label
                    className="custom-control-label label-bold"
                    htmlFor={`switch_${attribute}_${document.key}`}
                  >
                    {this.props.label}
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
  }

  formatFilename(url) {
    var filename = _.last(url.split("/"));

    if (filename.length > 25) {
      return filename.substring(0, 25).concat("...");
    } else {
      return filename;
    }
  }

  drawFileLink() {
    let { type, document } = this.props;

    if (type === "file" && _.isInteger(document.id)) {
      let url = document.file.url;
      let filename = "";
      if (url !== undefined && url !== null)
        filename = this.formatFilename(url);

      return (
        <div className="float-right">
          <a href={url} target="_blank">
            {filename}
          </a>
        </div>
      );
    }
  }

  drawLabel() {
    return (
      <label htmlFor="" className="label-bold">
        {this.props.label}
      </label>
    );
  }

  handleInputChange(event) {
    const { attribute, signer_type, handleChangeStatus } = this.props;
    let input = event.target;
    let set_value = input.type === "checkbox" ? input.checked : input.value;

    this.setState({ [attribute]: set_value });

    if (signer_type !== undefined)
      handleChangeStatus(`${signer_type}_${attribute}`, set_value);
    else handleChangeStatus(attribute, set_value);
  }

  handleFileChange(event) {
    let file = event.target.files[0];

    this.setState({ file });
  }

  render() {
    let { document, signer, attribute, valid_signature, type } = this.props;
    let isCheckbox = type === "checkbox";
    let rejected = document.state === "rejected";
    let errors = signer !== undefined ? signer.errors : document.errors;

    return (
      <div className="form-group row">
        <div className="flex-fill px-3">
          {isCheckbox ? "" : this.drawLabel()}
          {valid_signature || rejected ? "" : this.drawFileLink()}
          <div className={isCheckbox ? "" : "input-group"}>
            {this.drawDocumentValue()}
          </div>
          <InputError attr={attribute} errors={errors} />
        </div>
      </div>
    );
  }
}

export default DocumentValueInput;
