# Knowledge AI – Angular Frontend

A modern Angular frontend for the **Enterprise Document Assistant**, an AI-powered document question-answering application using Retrieval-Augmented Generation (RAG).

The application allows users to interact with an AI assistant, ask questions about uploaded documents, and view answers with relevant document sources.

This frontend integrates with a Java Spring Boot backend powered by LangChain4j, OpenAI, and Qdrant.

## 1. Project Overview

Knowledge AI provides the user-facing interface for an enterprise document assistant.

The application is designed to make information retrieval from uploaded documents more accessible through a conversational interface.

### Key capabilities

- Ask natural-language questions about documents.
- Display AI-generated answers.
- View relevant document sources returned by the backend.
- Communicate with the Spring Boot REST API.
- Run independently as an Angular development application.
- Connect to a backend running locally, in Docker, or on Kubernetes.

## 2. Technology Stack

| Category | Technology |
|---|---|
| Frontend framework | Angular |
| Language | TypeScript |
| UI | HTML and CSS |
| API communication | Angular HTTP client |
| Backend | Java 25 and Spring Boot |
| AI integration | LangChain4j and OpenAI |
| Vector database | Qdrant |
| Package manager | npm |
| Development server | Angular CLI |
| Version control | Git and GitHub |

## 3. System Architecture

```text
                    User
                     |
                     v
              Angular Frontend
             http://localhost:4200
                     |
                     | HTTP REST Requests
                     v
             Spring Boot Backend
                     |
          +----------+----------+
          |                     |
          v                     v
     OpenAI Services       Qdrant Database
          |                     |
          v                     v
     AI Generation         Vector Search
          |                     |
          +----------+----------+
                     |
                     v
             RAG-Based Response
                     |
                     v
               Angular UI
```

The Angular application handles user interaction and presentation. Document retrieval, embeddings, vector search, and AI response generation are handled by the Spring Boot backend.

## 4. Features

### AI Chat Interface

Users can submit questions through the Angular interface.

The frontend sends the question to the backend and displays the generated response.

### Document-Based Answers

The backend uses RAG to retrieve relevant document content before generating a response.

This enables answers grounded in the application's document knowledge base.

### Source References

The interface displays source information returned by the backend, allowing users to identify documents relevant to an answer.

### REST API Integration

The frontend communicates with the Spring Boot application through HTTP requests.

For local development, Angular uses a proxy configuration to forward API requests to the backend.

## 5. Project Structure

The project follows a standard Angular application structure.

```text
knowledge-ai-frontend/
|
+-- src/
|   |
|   +-- app/
|   |   +-- Angular components
|   |   +-- Application configuration
|   |   +-- API integration
|   |
|   +-- assets/
|   +-- styles.css
|
+-- angular.json
+-- package.json
+-- proxy.conf.json
+-- tsconfig.json
+-- README.md
```

The exact component and service structure can be explored in the `src/app` directory.

## 6. Prerequisites

To run the frontend locally, install:

- Node.js
- npm
- Angular CLI, if not already available through the project dependencies
- A running Spring Boot backend

The backend repository is available at:

https://github.com/saiishu6/enterprise-document-assistant-rag

## 7. Installation

Clone the repository:

```bash
git clone https://github.com/saiishu6/knowledge-ai-frontend.git
```

Navigate to the project:

```bash
cd knowledge-ai-frontend
```

Install dependencies:

```bash
npm install
```

## 8. Run the Angular Application

Start the development server:

```bash
npx ng serve --open
```

Open the application at:

```text
http://localhost:4200
```

The Angular development server supports automatic rebuilding and browser updates when frontend source files change.

## 9. Backend API Integration

The frontend uses the Angular development proxy to communicate with the Spring Boot backend.

### Local proxy configuration

The project uses `proxy.conf.json` to forward API requests.

For the current Minikube development setup, requests to `/api` are forwarded to:

```text
http://localhost:9092
```

Example configuration:

```json
{
  "/api": {
    "target": "http://localhost:9092",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

This allows the Angular application to send requests such as:

```text
/api/chat?message=What%20is%20the%20document%20about?
```

The proxy forwards the request to:

```text
http://localhost:9092/chat?message=What%20is%20the%20document%20about?
```

The proxy configuration is intended for local development and is not a production reverse-proxy setup.

## 10. Connecting to Kubernetes

The Spring Boot backend and Qdrant vector database are deployed to a local Minikube Kubernetes cluster.

The Angular application can communicate with the Kubernetes-hosted backend using port forwarding.

Start the backend port-forward:

```bash
kubectl port-forward -n rag-app svc/knowledge-assistant-api 9092:8080
```

Then start Angular:

```bash
npx ng serve --open
```

### Request flow

```text
Angular Browser Application
        |
        v
localhost:4200
        |
        v
Angular Development Proxy
        |
        v
localhost:9092
        |
        v
Kubernetes Port Forward
        |
        v
Spring Boot Service
        |
        v
Spring Boot Pod
        |
        v
Qdrant + OpenAI
```

This approach allows frontend development independently of Kubernetes while using the backend deployed inside the cluster.

## 11. Example User Workflow

1. Start the Spring Boot backend and Qdrant.
2. Start the Angular application.
3. Open the frontend in a browser.
4. Enter a question about an uploaded document.
5. The frontend sends the question to the backend.
6. The backend retrieves relevant document information using Qdrant.
7. OpenAI generates a context-aware answer.
8. The frontend displays the response and its document sources.

## 12. Development Commands

| Command | Purpose |
|---|---|
| `npm install` | Install project dependencies |
| `npx ng serve --open` | Start the development server |
| `npx ng build` | Build the Angular application |
| `npx ng test` | Run configured frontend tests, if available |

For a production build:

```bash
npx ng build
```

Build artifacts are generated according to the output settings in `angular.json`.

## 13. Current Implementation Status

| Feature | Status |
|---|---|
| Angular application setup | Implemented |
| Chat user interface | Implemented |
| Spring Boot API integration | Implemented |
| AI response display | Implemented |
| Document source display | Implemented |
| Local development proxy | Implemented |
| Integration with Minikube backend | Tested |
| Angular production containerization | Future enhancement |
| Angular Kubernetes deployment | Future enhancement |
| Automated frontend CI/CD | Future enhancement |

## 14. Future Enhancements

- Containerize the Angular frontend using Docker and a production web server.
- Deploy the frontend to Kubernetes.
- Integrate frontend builds into a CI/CD pipeline.
- Add automated UI and end-to-end testing.
- Improve loading states and error handling.
- Add authentication and user-specific document access.
- Improve responsive layouts and accessibility.
- Configure a production-ready reverse proxy for frontend and backend communication.

## 15. Related Repositories

**Angular Frontend**

https://github.com/saiishu6/knowledge-ai-frontend

**Spring Boot RAG Backend**

https://github.com/saiishu6/enterprise-document-assistant-rag

---

**Project:** Knowledge AI – Enterprise Document Assistant Frontend

**Purpose:** Angular, TypeScript, REST API integration, and Generative AI portfolio project.
