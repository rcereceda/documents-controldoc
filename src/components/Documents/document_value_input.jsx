import React from "react";
import InputError from "./error.jsx";
import _ from "lodash";

class DocumentValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: props.document.file,
      signature_required: props.document.signature_required,
      person_email: props.document.person_email,
      company_email: props.document.company_email,
      client_email: props.document.client_email
    };
    this.const_attribute = props.document[props["attribute"]];

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.attribute === "person_email" &&
      state.person_email !== props.document.person_email
    ) {
      return {
        person_email: props.document.person_email
      };
    } else if (
      props.attribute === "client_email" &&
      state.client_email !== props.document.client_email
    ) {
      return {
        client_email: props.document.client_email
      };
    }

    return null;
  }

  drawDocumentValue() {
    const { type, attribute, document, name, valid_signature } = this.props;
    let state_attribute = this.state[attribute];

    switch (type) {
      case "file":
        if (valid_signature) {
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
        if (valid_signature) {
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
        if (valid_signature) {
          return (
            <span
              className={`badge badge-pill ml-1 badge-${document.label.style}`}
            >
              {document.label.text}
            </span>
          );
        } else {
          return (
            <input
              type={type}
              checked={state_attribute || false}
              name={`${name}[${attribute}]`}
              onChange={this.handleInputChange}
            />
          );
        }
      default:
        break;
    }
  }

  drawFileLink() {
    let url = this.props.document.file.url;
    let filename = "";
    if (url !== undefined && url !== null) filename = _.last(url.split("/"));

    return (
      <div className="float-right">
        <a href={url} target="_blank">
          {filename}
        </a>
      </div>
    );
  }

  handleInputChange(event) {
    const { attribute } = this.props;
    let input = event.target;
    let set_value = input.type === "checkbox" ? input.checked : input.value;

    this.setState({ [attribute]: set_value });
    this.props.handleChangeStatus(attribute, set_value);
  }

  handleFileChange(event) {
    let file = event.target.files[0];

    this.setState({ file });
  }

  render() {
    let { type, document } = this.props;
    let isCheckbox = type === "checkbox";
    let isFile = type === "file";
    let persisted = _.isInteger(document.id);

    return (
      <div className={`form-group row ${isCheckbox ? "text-center" : ""}`}>
        <div className="flex-fill px-3">
          <label htmlFor="" className="label-bold">
            {this.props.label}
          </label>
          {!persisted && isFile ? this.drawFileLink() : ""}
          <div className={isCheckbox ? "" : "input-group"}>
            {this.drawDocumentValue()}
          </div>
          <InputError
            attr={this.props.attribute}
            errors={this.props.document.errors}
          />
        </div>
      </div>
    );
  }
}

export default DocumentValueInput;
