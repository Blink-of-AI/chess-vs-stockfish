import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'node_modules/stockfish/src');
const publicDir = join(process.cwd(), 'public');

// Copy the single-threaded engine (works without SharedArrayBuffer/CORS headers)
const sfJs = join(srcDir, 'stockfish-nnue-16-single.js');
if (existsSync(sfJs)) copyFileSync(sfJs, join(publicDir, 'stockfish-nnue-16-single.js'));

// Copy the WASM file
const sfWasm = join(srcDir, 'stockfish-nnue-16-single.wasm');
if (existsSync(sfWasm)) copyFileSync(sfWasm, join(publicDir, 'stockfish-nnue-16-single.wasm'));

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
