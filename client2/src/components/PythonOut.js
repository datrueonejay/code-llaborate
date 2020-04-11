import React, { useState, useEffect } from "react";
import http from "../http";

import { Button, Form } from "react-bootstrap";
import Suggestions from "./Suggestions";

const apiPython = require("../apiPython.js");

export default function Editor(props)