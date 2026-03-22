const fs = require('fs');
const blueprint = {
  $schema: "https://playground.wordpress.net/blueprint-schema.json",
  landingPage: "/",
  preferredVersions: { php: "8.2", wp: "latest" },
  steps: [
    { step: "login", username: "admin", password: "password" },
    { step: "writeFile", path: "/wordpress/wp-content/themes/saas/style.css", data: "/* theme */" },
    { step: "setSiteOptions", options: { stylesheet: "saas", template: "saas" } }
  ]
};

const Ajv = require('ajv').default; // try checking if ajv is installed, else use a simple fetch
async function run() {
  const schema = await fetch("https://playground.wordpress.net/blueprint-schema.json").then(r => r.json());
  if (typeof Ajv !== 'undefined') {
    const ajv = new Ajv({ strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(blueprint);
    if (!valid) console.log(validate.errors);
    else console.log("VALID");
  } else {
    console.log("No AJV, schema keys:", Object.keys(schema.properties.steps.items.anyOf.find(s => s.properties?.step?.const === 'setSiteOptions').properties));
  }
}
run();
