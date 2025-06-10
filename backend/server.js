const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const pc = require("picocolors");

dotenv.config({ path: path.join(__dirname, "../.env") });

const apiRouterInstance = require("./api");
const morgan = require("morgan");

const app = express();
const API_DOMAIN = process.env.API_DOMAIN;
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
const FRONTEND_PATH = process.env.FRONTEND_PATH;
const PORT = process.env.API_PORT || 2458;

if (!API_DOMAIN || !FRONTEND_DOMAIN || !FRONTEND_PATH) {
  console.error(
    "Error: API_DOMAIN, FRONTEND_DOMAIN, and FRONTEND_PATH environment variables must be set.",
  );
  console.log({ API_DOMAIN, FRONTEND_DOMAIN, FRONTEND_PATH });
  process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan("dev"));

const allowedOrigins = [];

allowedOrigins.push(`http://${API_DOMAIN}`);
allowedOrigins.push(`https://${API_DOMAIN}`);

allowedOrigins.push(`http://${FRONTEND_DOMAIN}`);
allowedOrigins.push(`https://${FRONTEND_DOMAIN}`);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  }),
);

app.use((req, res, next) => {
  const hostname = req.hostname;
  if (hostname === API_DOMAIN) {
    console.log(
      pc.bgCyan(
        `API Request: ${req.method} ${req.originalUrl} from host ${hostname}`,
      ),
    );
    apiRouterInstance(req, res, next);
  } else if (hostname === FRONTEND_DOMAIN) {
    console.log(
      pc.bgGreen(
        `Frontend Request: ${req.method} ${req.originalUrl} from host ${hostname}`,
      ),
    );
    frontendStaticHandler(req, res, (err) => {
      if (err) return next(err);
      if (req.method === "GET" && !res.headersSent) {
        res.sendFile(
          path.join(resolvedFrontendPath, "index.html"),
          (sendFileErr) => {
            if (sendFileErr) next(sendFileErr);
          },
        );
      } else if (!res.headersSent) {
        next();
      }
    });
  } else {
    console.warn(
      pc.bgYellow(
        `Unhandled Request: ${req.method} ${req.originalUrl} from host ${hostname}`,
      ),
    );
    if (req.path === "/" && req.method === "GET") return res.sendStatus(200);
    res.status(404).send(`Hostname "${hostname}" not configured.`);
  }
});

const resolvedFrontendPath = path.resolve(__dirname, FRONTEND_PATH);
const frontendStaticHandler = express.static(resolvedFrontendPath, {
  fallthrough: true,
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`API will be served for host: ${API_DOMAIN}`);
  console.log(
    `Frontend will be served from ${resolvedFrontendPath} for host: ${FRONTEND_DOMAIN}`,
  );
});
