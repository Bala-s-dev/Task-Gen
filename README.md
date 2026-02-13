# Task Generator 🚀

Task Generator is an AI-powered technical planning tool that transforms high-level project goals into actionable engineering tasks and user stories. It uses Large Language Models (LLMs) to automate the breakdown of complex requirements into structured workflows.

## 🛠️ Tech Stack

* **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
* **AI Engine**: [Groq Cloud SDK](https://groq.com/) (Llama 3.3 70B)
* **Rate Limiting**: [Upstash Redis](https://upstash.com/)
* **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

## 🔄 Workflow

The application follows a structured path from requirement gathering to task management:

1.  **Requirement Input**: Users provide a project goal, target audience, technical constraints, and potential risks through the `SpecForm`.
2.  **AI Generation**: The system sends these details to the Groq API. The AI generates a JSON-structured response containing 5 user stories and engineering tasks categorized into Frontend, Backend, Database, Testing, and Deployment.
3.  **Data Persistence**: The generated specification, user stories, and task groups are saved to the PostgreSQL database via Prisma.
4.  **Interactive Board**: Users are redirected to a Kanban-style board where they can:
    * **Drag and Drop**: Reorder tasks within groups or move them between categories.
    * **Manage Status**: Toggle completion status and edit task descriptions in real-time.
    * **Priority Tracking**: View and assign task priorities (High, Medium, Low).
5.  **Export**: The final technical plan can be viewed as a summarized export for team documentation.

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* A PostgreSQL database (e.g., [Neon](https://neon.tech/))
* Groq API Key
* Upstash Redis Credentials

### Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/Bala-s-dev/Task-Gen.git](https://github.com/Bala-s-dev/Task-Gen.git)
    cd Task-Gen
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://..."
    GROQ_API_KEY="gsk_..."
    UPSTASH_REDIS_REST_URL="https://..."
    UPSTASH_REDIS_REST_TOKEN="..."
    ```

4.  **Database Sync**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

* `/app`: Next.js App Router and API routes (logic for generation, saving, and fetching).
* `/components`: Reusable UI components (TaskBoard, SortableTask, SpecForm).
* `/lib`: Shared library configurations for Prisma, Groq, and Rate Limiting.
* `/prisma`: Database schema definition.
