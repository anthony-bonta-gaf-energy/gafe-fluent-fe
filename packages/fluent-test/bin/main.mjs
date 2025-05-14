import axios from "axios";
import { config } from "dotenv";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { parsed: env } = config({
  path: [
    resolve(__dirname, "../../../", ".env.local"),
    resolve(__dirname, "../../../", ".env"),
  ],
});

async function getSampleTemplate() {
  const manager = "http://localhost:8079";
  const workspace = Buffer.from("default").toString("base64");

  const {
    FLUENT_MANAGER_DEFAULT_ADMIN_EMAIL: user,
    FLUENT_MANAGER_DEFAULT_ADMIN_PASSWORD: password,
  } = env;
  const basic = Buffer.from(`${user}:${password}`).toString("base64");
  const path = `api/v1/workspaces/${workspace}/templates?page=0&size=2000`;
  const endpoint = `${manager}/${path}`;
  const Authorization = `Basic ${basic}`;
  const headers = { Authorization };

  console.log("Retrieving all templates");
  console.log(`Using ${user} as the service account`);

  const { data } = await axios.request(endpoint, { headers });
  const { content: templates } = data;

  console.log(`Found ${templates.length} templates`);

  if (templates.length === 0) {
    const msg =
      "Didn't find any templates. " +
      "Upload a template to the fluent manager.";
    throw new Error(msg);
  }

  const [template] = templates;
  return template;
}

async function generateDocument(template) {
  const engine = "http://localhost:8081";
  const ConnectionString = `file://resources/${template.name}`;
  const payloadPath = resolve(
    __dirname,
    "../..",
    "fluent-resources",
    "static",
    "json",
    "sample-payload.json",
  );
  const content = await readFile(payloadPath);
  const payload = JSON.parse(content.toString());
  const Data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const Datasources = [{ Type: "json", Data, Name: "JSON" }];
  const body = { OutputFormat: "pdf", ConnectionString, Datasources };
  const { FLUENT_ENGINE_LICENSE: license } = env;

  console.log(`Generating a document with template, ${template.name}`);
  console.log(`Using license ${license}`);

  const generateEndpoint = `${engine}/v2/document`;
  const headers = {
    "X-WINDWARD-LICENSE": license,
    Accept: "application/json",
  };

  const { data: generated } = await axios.post(generateEndpoint, body, {
    headers,
  });

  console.log(`Generated document, ${generated.Guid}`);
  console.log("Waiting for document to finish processing");

  let status = 100;

  do {
    // For some reason, the engine and manager aren't always in sync here - I would normally
    // just do several retries with sleeps inbetween -> for this sample app, this will
    // suffice.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const statusEndpoint = `${engine}/v2/document/${generated.Guid}/status`;
    const current = await axios
      .get(statusEndpoint, { maxRedirects: 0, headers })
      .catch((e) =>
        e.status === 302 ? Promise.resolve(e) : Promise.reject(e),
      );
    status = current.status;
  } while (status != 302);

  console.log("Document generation complete.  Retrieving...");

  const documentTarget = `${engine}/v2/document/${generated.Guid}`;
  const { data: document } = await axios.get(documentTarget, { headers });
  return document;
}

async function writeDocument(document) {
  const { Data: encoded } = document;
  const raw = Buffer.from(encoded, "base64");
  const directory = resolve(__dirname, "..", "dist/documents");
  const output = resolve(directory, `${document.Guid}.pdf`);

  console.log(`Writing ${document.Guid} to ${output}`);
  await mkdir(directory, { recursive: true });
  await writeFile(output, raw);
}

async function run() {
  const template = await getSampleTemplate();
  const document = await generateDocument(template);

  await writeDocument(document);
}

console.log(`Running out of ${__dirname}`);
run().catch((e) => console.error(e));
