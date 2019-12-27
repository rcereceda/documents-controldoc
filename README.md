# documents-controldoc

>

[![NPM](https://img.shields.io/npm/v/documents-controldoc.svg)](https://www.npmjs.com/package/documents-controldoc) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save documents-controldoc
```

## Usage

```jsx
import React, { Component } from "react";

import Documents from "documents-controldoc";

class Example extends Component {
  render() {
    return <Documents />;
  }
}
```

## DEVELOP

Put in **src/index.js**

```jsx
import ReactDOM from "react-dom";
...

ReactDOM.render(<MultipleDocuments />, document.getElementById("root"));
```

In **package.json** put the following:

```json
{
  "scripts": {
    "start": "react-scripts start"
  }
}
```

If you want to have document_types, person_email and company_email for example, put the following in **src/components/index.jsx**

```jsx
const person_email = "elliot.alderson@gmail.com";
const company_email = "gideon@allsafe.com";
const document_types = [
      {
        value: "1",
        label: "Contrato de Trabajo",
        for_client: false
      },
      {
        value: "2",
        label: "Anexo de Contrato",
        for_client: false
      },
      {
        value: "3",
        label: "CPDT",
        for_client: true
      }
    ];
const signer_types = [
  {
    value: "1",
    label: "Trabajador",
    type: "person"
  },
  {
    value: "2",
    label: "Empleador",
    type: "company"
  },
  {
    value: "3",
    label: "Cliente",
    type: "client"
  }
];

...

<MultipleForm
      documents={ props.documents }
      document_types={ document_types }
      signer_types={ signer_types }
      person_email={ person_email }
      company_email={ company_email }
      t={ t }
      name={ props.form_name || "person_sending[documents_attributes]" }
/>

```

## License

MIT © [rcereceda](https://github.com/rcereceda)
