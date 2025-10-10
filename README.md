# EvoDesigner

EvoDesigner is a co-creative computational system for exploring innovative graphic design solutions. It combines evolutionary computation, machine learning, and procedural generation to help designers generate unexpected ideas for posters, book covers, and other 2D artefacts, while integrating seamlessly into professional design workflows.

---

## Components

1. **Client: InDesign Extension**
   - Provides the UI for interacting with EvoDesigner.
     - Allows designers to express preferences, set concepts, and refine generated designs.
     - Includes interactive exploration of styling variations (Playground).

2. **Server: Services**
   - **Fitness Modules**: Evaluate and guide design evolution.
     - **Novelty**: Measures deviation from existing designs.
     - **Balance**: Assesses visual balance.
     - **Legibility**: Evaluates text readability.
     - **Diversity**: Ensures variety in generated artefacts.
   - **Concept-to-Visuals**: Translates user-defined concepts into visual elements for generation.
