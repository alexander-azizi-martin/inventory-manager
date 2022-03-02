#!/usr/bin/env ts-node
import { writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';

const { error, parsed } = dotenv.config();

if (!error) {
  const SECRET = randomBytes(48).toString('base64');

  const newEnvVars = Object.entries({ ...parsed, SECRET })
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  writeFileSync('.env', `${newEnvVars}\n`);
}
