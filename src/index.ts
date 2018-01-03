#!/usr/bin/env node

import { Program } from "./Program";

const program: Program = new Program(process.argv);
program.runAsync()
    .catch((reason: Error) => {
        console.error(reason.message);
    });
