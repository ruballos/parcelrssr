import express from 'express';
import { renderToNodeStream, renderToStaticNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Transform } from 'stream';
import fs from 'fs';

import App from '../src/App.js';

const PORT = 3012;
const html = fs.readFileSync('./dist/index.html').toString();
const parts = html.split('not rendered');

const jsdom = require("jsdom-canvas-2");
const { JSDOM } = jsdom;
let JSDOM_ = new JSDOM(html);
console.log(JSDOM_.window.document)
global.document = JSDOM_.window.document;

var util = require('util');

var _ = require("lodash");


import {FormData as FormData_} from "formdata-node";
global.FormData=FormData_;
const Storage = require('dom-storage');
global.localStorage = require('localStorage');
global.fetch = require('node-fetch');

const URLSearchParams = require('@ungap/url-search-params');

var bodyParser = require('body-parser')


const app = express();

app.use('/dist', express.static('./dist'));

app.get("*", async (request, res) => {

  const staticContext = {};
  const start = Date.now();

  const context = {};
  const stream = renderToString(
    <StaticRouter location={request.url} context={context}>
      <App />
    </StaticRouter>
  );

  stream.on("data", function handleData() {
      console.log("Render Start: ",);
      stream.off("data", handleData);
      res.useChunkedEncodingByDefault = true;
      res.writeHead(200, {
        "content-type": "text/html",
        "content-transfer-encoding": "chunked",
        "x-content-type-options": "nosniff"
      });

      res.flushHeaders();

      res.write(parts[0]);

    });



    await new Promise((resolve, reject) => {
      stream.on("error", err => {
        stream.unpipe(res);
        reject(err);
      });
      stream.on("end", () => {
        console.log("Render End: ", Date.now() - start);
        res.write(parts[1]);
        res.end();
        resolve();
      });
      stream.pipe(
        res,
        { end: false }
      );
    });



});

console.log(`listening on http://localhost:${PORT}`);
app.listen(PORT);
