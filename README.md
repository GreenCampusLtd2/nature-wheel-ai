# Nature Wheel AI Orchestrator

Nature Wheel is an AI-centered application that allows users to enter their location to generate a beautiful, highly detailed "Birds of Britain" style nature poster. The artwork intricately maps local flora and fauna phenomena onto a 12-month seasonal circular calendar.

## V1 UI Mockup

This V1 codebase provides a beautiful, modern Chat Interface powered by React and Vite. It utilizes a deep earthy green color palette with premium glassmorphism effects to create a highly immersive experience.

Currently, the UI simulates the progress of an AI Swarm, giving the user a visual timeline of the subagents working in the background.

## System Architecture: Gemini Native Subagent Swarm

The backend of Nature Wheel relies heavily on **Google Antigravity's Native Subagent System (Gemini)**. Instead of complex external API routes, the application uses an internal AI swarm that passes context natively.

### 1. The Orchestrator
The main process that interfaces with the user. It receives the location input, asks clarifying questions, and dispatches the subagents.

### 2. `nature_research_agent`
- **Role**: Conducts deep research into the specific location provided by the user.
- **Task**: Catalogs key seasonal events across land, sea, and air (e.g., migrating birds, spawning fish, flowering trees).
- **Output**: A structured dataset grouped by month/season.

### 3. `nature_layout_agent`
- **Role**: Data-visualization and wireframing.
- **Task**: Takes the research database and plots it onto a 12-month circular calendar layout. It places biological text and descriptions in optimal spatial arrangements (e.g., grouping marine events together).
- **Output**: A `Layout_SVG` file acting as the scaffolding for the artwork.

### 4. `nature_artist_agent`
- **Role**: Master digital illustrator.
- **Task**: Uses the `Layout_SVG` as a structural prompt. It generates a huge, A1-style, realistic nature poster utilizing the `generate_image` tool, layering beautiful animal and plant illustrations over the calendar wheel.
- **Output**: The final high-resolution nature artwork.

## Getting Started (Local Development)

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173` to interact with the UI.
