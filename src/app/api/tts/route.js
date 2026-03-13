import { spawn } from 'node:child_process';
import path from 'node:path';

export const runtime = 'nodejs';

const scriptPath = path.join(
  process.cwd(),
  'src',
  'app',
  'api',
  'tts',
  'generate_audio.py'
);

function runPythonTTS(payload) {
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
        reject(new Error(stderr || 'Invalid JSON returned by TTS script.'));
      }
    });

    child.stdin.write(JSON.stringify(payload));
    child.stdin.end();
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await runPythonTTS(payload);
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
