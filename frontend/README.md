# Atelier

A quiet little studio for talking with your supportive mental coach. The page is Next.js. The coach still lives in the FastAPI app at the root of this repo. You type, the page asks `POST /api/chat`, and the reply lands in the conversation. Earlier messages in this tab go along with the new one, so the coach can follow the thread. The API still receives a single message.

Nothing you type is stored. Close the tab and the chat is gone. The OpenAI key stays on the server. The page never asks for it.

## What you need

- Node.js 20.9 or newer (`node -v`). This machine has Node at `~/.local/node` if `node` is not already on your PATH. If the command is missing, run `export PATH="$HOME/.local/node/bin:$PATH"` and try again.
- The Python API from the root README, including an `OPENAI_API_KEY`.

## Run it locally

Use two terminals, both from the repository root unless noted.

**Terminal 1, the coach:**

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

That listens on `http://127.0.0.1:8000`.

**Terminal 2, the studio:**

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

During `npm run dev`, Next.js forwards `/api/chat` to the Python server, so the browser only talks to port 3000. A production build does not use that forward. On Vercel, `/api/*` goes to FastAPI and every other path goes to this page.

## Deploy on Vercel

From the repository root:

```bash
npm install -g vercel
vercel
```

In the Vercel project settings, add `OPENAI_API_KEY` for the deployment. The root `vercel.json` runs this folder as the `web` service and `api/index.py` as the `coach_api` service, on one domain.

## Handy checks

```bash
cd frontend
npm run lint
npm run build
```

Use `npm run dev` while you are trying the coach locally. That is the mode that forwards chat requests to the API on port 8000.
