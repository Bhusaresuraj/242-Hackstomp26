import { spawn } from 'node:child_process';
import path from 'node:path';

export const runtime = 'nodejs';

const scriptPath = path.join(
  process.cwd(),
  'src',
  'app',
  'Ngos',
  'recommendintervention.py'
);

function runPythonInference(payload) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [scriptPath], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0 && !stdout) {
        reject(new Error(stderr || `Python process exited with code ${code}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim());

        if (parsed.error) {
          reject(new Error(parsed.error));
          return;
        }

        resolve(parsed);
      } catch {
        reject(new Error(stderr || 'Invalid JSON returned by ML inference script.'));
      }
    });

    child.stdin.write(JSON.stringify(payload || {}));
    child.stdin.end();
  });
}

export async function GET() {
  try {
    const result = await runPythonInference({});
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await runPythonInference(payload);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
