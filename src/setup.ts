import cookieParser from "cookie-parser";
import { Context } from "effect";
import express from "express";

// Define base Express.js instance as a dependency.
export class Express extends Context.Tag("Express")<Express, typeof base>() {}

export const base = express().use(cookieParser());
