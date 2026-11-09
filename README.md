
# A Quiet Room — An AI Supportive Coach

### AI Engineering Challenge | AI Makerspace

A full-stack LLM application prototype built through AI-assisted development as part of my ongoing AI Engineering Bootcamp.

**[View the source repository](https://github.com/ccustis/The-AI-Engineer-Challenge)**

## Project Overview

This project represents an early step in my transition from leading AI research, governance, and organizational strategy to building and experimentally evaluating AI applications.

Using the AI Makerspace course starter as a foundation, I developed a conversational interface for a supportive AI coach. The application connects a custom Next.js frontend to a Python/FastAPI backend, which uses the OpenAI API to generate responses.

My goals were to understand the components of a functioning LLM application, practice AI-assisted software development, troubleshoot integration problems, and begin identifying questions about reliability, safety, and evaluation.

This is an educational prototype, not a production application or a clinically validated mental-health service.

## What I Built and Practiced

### 1. Conversational User Interface

Developed a custom Next.js/React interface designed for a calm, supportive conversational experience.

The interface includes:

- Suggested conversation starters
- A message composer and conversation display
- In-session conversation history
- Loading indicators and error feedback
- Message-length validation
- Controls to clear the current conversation

The user experience emphasizes simplicity, readability, and thoughtful interaction.

### 2. Frontend and Backend Integration

Connected the frontend to the course's FastAPI backend through a `/api/chat` endpoint.

The application uses the OpenAI API to generate responses based on a supportive-coach system instruction.

I explored how requests move through the application, how API responses are handled, and how configuration and service errors affect the experience.

### 3. Conversation Context and Error Handling

Implemented application logic to include earlier conversation turns in subsequent requests, within a defined context-size budget.

The frontend also translates common API failures into understandable messages, including missing configuration, unavailable services, and exhausted API credits.

Conversation history is held in the active browser session rather than saved in an application database.

### 4. Local Development and Deployment Configuration

Worked with:

- Local Python and Node.js development environments
- FastAPI and Uvicorn
- Next.js development and API proxy configuration
- Environment variables and API credentials
- Git and GitHub version control
- Vercel deployment and routing configuration

The repository includes configuration for routing frontend traffic and backend API requests through the application.

## Technical Architecture

```text
User / Browser
      |
      v
Next.js / React Interface
      |
      | POST /api/chat
      v
FastAPI Backend
      |
      v
OpenAI API
      |
      v
Generated Response
      |
      v
Conversation Interface
```

### Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js, React, TypeScript |
| Backend | Python, FastAPI |
| LLM integration | OpenAI API |
| Development | Cursor, Git, GitHub |
| Python environment | uv |
| Deployment configuration | Vercel |

### Key Implementation Files

- [Frontend interface](frontend/components/ChatStudio.tsx)
- [API client and context handling](frontend/lib/chat.ts)
- [FastAPI backend](api/index.py)
- [Local API proxy configuration](frontend/next.config.ts)
- [Vercel configuration](vercel.json)

## Running the Project Locally

### Backend

From the project root:

```bash
uv sync
export OPENAI_API_KEY="your-api-key"
uv run uvicorn api.index:app --reload
```

The API runs at `http://127.0.0.1:8000`.

### Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

A valid OpenAI API key and available API credits are required for model-generated responses.

## What I Learned

This exercise helped me develop practical understanding of:

- The distinction between an LLM, an API, and an application built around the model
- The roles of frontend, backend, and model-provider services
- System instructions and conversation-context management
- How failures in configuration, connectivity, or API access affect application behavior
- The opportunities and limitations of AI-assisted coding
- The importance of testing the complete application rather than assuming that functioning components guarantee a functioning system

### A Larger Research Question

My previous research with Partnership on AI examined how documentation can make AI transparency and accountability more actionable.

Building this prototype brings that question into a technical setting:

**What evidence would establish that an AI application is not only functional, but also reliable, safe, and appropriately governed?**

A working interface and successful API response do not establish answer quality, user safety, or dependable behavior across different situations.

## Current Limitations

This is an introductory prototype. It is not a trained or fine-tuned model, a production-grade assistant, or a validated safety system.

Important limitations include:

- No systematic evaluation benchmark has yet been documented
- No demonstrated reliability or safety performance metrics
- No persistent conversation database
- No retrieval-augmented generation or external-tool integration
- No implemented specialized clinical-safety assessment
- Dependence on the availability and billing status of the model API

Although the interface keeps conversation history in the browser session, submitted messages are sent to the backend and OpenAI API. Users should not enter sensitive personal information.

## Next Steps: From Application Development to Evaluation

My next goal is to extend this learning into empirical AI safety research.

Planned investigations include:

1. **Behavioral evaluation:** Test responses across defined scenarios and evaluate consistency, instruction following, and failure patterns.
2. **Safety and boundary testing:** Investigate how the system handles ambiguous, sensitive, or potentially harmful requests.
3. **Traceability:** Develop better visibility into requests, responses, failures, and the evidence available to reviewers.
4. **Comparative evaluation:** Introduce alternative prompts or interventions and compare outcomes using reproducible measures.

These are planned research directions, not completed features.

## Project Origins and Acknowledgments

This application was developed as part of the [AI Makerspace AI Engineer Challenge](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge).

The challenge provided the starter repository, initial backend foundation, and instructional framework. My work focused on configuring and extending the application, developing its user experience through AI-assisted coding, connecting its components, troubleshooting integration, and reflecting on the technical and research implications.

## About This Learning Journey

I am a computer scientist, researcher, and organizational strategist with a background in AI governance, technical systems, and interdisciplinary research.

My current technical development is focused on connecting that foundation to practical LLM engineering, experimentation, and evaluation.

The larger objective is to contribute to AI research that moves beyond statements of responsible practice toward observable, testable evidence of trustworthy system behavior.
