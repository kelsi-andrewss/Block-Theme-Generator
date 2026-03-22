async function run() {
  const blueprint = {
    $schema: "https://playground.wordpress.net/blueprint-schema.json",
    steps: [
      {
        step: "setSiteOptions",
        options: {
          stylesheet: "saas",
          template: "saas"
        }
      }
    ]
  };
  console.log(JSON.stringify(blueprint));
}
run();
