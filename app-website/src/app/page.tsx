"use client"; // Enable client-side rendering for state management
import React, { useState, useEffect } from "react";
import GrokTile from "../components/GrokTile";
import GrokTileViewer from "../components/GrokTileViewer";
import { ChatData } from "@/types/chatData";
import { ViewMode } from "@/types/viewer";

declare global {
  interface Window {
    grokExtensionInstalled?: boolean;
  }
}

export default function Home() {
  const [tiles, setTiles] = useState<ChatData[]>([]);
  const [selectedTile, setSelectedTile] = useState<ChatData | null>(null);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number>(-1);
  const [isTestMode, setIsTestMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [defaultViewMode, setDefaultViewMode] = useState<ViewMode>("pretty");
  const [showExtensionAlert, setShowExtensionAlert] = useState<boolean>(false);

  // Filter tiles based on search term
  const filteredTiles = tiles.filter(
    (tile) =>
      tile.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tile.responses.some((response) =>
        response.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  useEffect(() => {
    const extensionInstalled = window.grokExtensionInstalled === true;
    if (extensionInstalled) {
      const handleMessage = (event: MessageEvent) => {
        if (event.source !== window || !event.data) {
          return;
        }
        switch (event.data.type) {
          case "chatDataResponse":
            if (event.data.data) {
              setTiles(event.data.data);
            } else {
              console.warn("No data received from extension.");
            }
            break;
          case "deleteChatResponse":
            window.postMessage({ type: "getChatData" }, "*");
            break;
          default:
            console.warn(`Unhandled message type: ${event.data.type}`);
        }
      };
      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "getChatData" }, "*");
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    } else {
      setIsTestMode(true);
      setTiles(getTestData());
      setShowExtensionAlert(true); // Show alert when extension is not installed
    }
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedTileIndex((prevIndex) => {
          let newIndex = prevIndex;
          if (event.key === "ArrowDown") {
            newIndex = Math.min(prevIndex + 1, filteredTiles.length - 1);
          } else if (event.key === "ArrowUp") {
            newIndex = Math.max(prevIndex - 1, 0);
          }
          if (newIndex >= 0 && newIndex < filteredTiles.length) {
            setSelectedTile(filteredTiles[newIndex]);
          } else {
            setSelectedTile(null);
          }
          return newIndex;
        });
      } else if (event.key === "Escape" && selectedTile) {
        event.preventDefault();
        setSelectedTile(null);
        setSelectedTileIndex(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filteredTiles, selectedTile]);

  const onDelete = (tile: ChatData) => {
    if (isTestMode) {
      setTiles(tiles.filter((t) => t.id !== tile.id));
    } else {
      window.postMessage({ type: "deleteChat", data: tile }, "*");
    }
    // Reset selection if the deleted tile was selected
    if (selectedTile?.id === tile.id) {
      setSelectedTile(null);
      setSelectedTileIndex(-1);
    }
  };

  // Handle view mode change
  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newMode = event.target.value as ViewMode;
    setDefaultViewMode(newMode);
  };

  // Handle sidebar item click
  const handleSidebarClick = (tile: ChatData, index: number) => {
    setSelectedTile(tile);
    setSelectedTileIndex(index);
  };

  // Handle tile click from grid
  const handleTileClick = (tile: ChatData) => {
    const index = filteredTiles.findIndex((t) => t.id === tile.id);
    setSelectedTile(tile);
    setSelectedTileIndex(index);
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161b22] p-4 border-r border-[#30363d] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        <ul>
          {filteredTiles.map((tile, index) => (
            <li
              key={tile.id}
              className={`p-2 rounded cursor-pointer ${
                index === selectedTileIndex
                  ? "bg-[#2d333b]"
                  : "hover:bg-[#1c2526]"
              }`}
              onClick={() => handleSidebarClick(tile, index)}
            >
              {tile.title}
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center">
        {/* Extension Alert */}
        {showExtensionAlert && (
          <div className="w-full max-w-6xl mb-6 bg-[#2d333b] border border-[#58a6ff] rounded-lg p-4 flex justify-between items-center">
            <p className="text-[#c9d1d9]">
              The Grok extension is not installed. Note: Full functionality is not
              yet available in test mode.
            </p>
            <button
              onClick={() => setShowExtensionAlert(false)}
              className="text-[#58a6ff] hover:text-[#8b949e] transition duration-200"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        )}
        <div className="w-full max-w-6xl mb-6">
          {/* View Mode Dropdown */}
          <div className="mb-4">
            <label htmlFor="viewMode" className="mr-2">
              Default View Mode:
            </label>
            <select
              id="viewMode"
              value={defaultViewMode}
              onChange={handleViewModeChange}
              className="p-2 rounded bg-[#1c2526] text-[#c9d1d9] border border-[#30363d] focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="pretty">Pretty</option>
              <option value="raw">Raw</option>
              <option value="json">JSON</option>
            </select>
          </div>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded bg-[#1c2526] text-[#c9d1d9] border border-[#30363d] focus:outline-none focus:border-[#58a6ff]"
          />
        </div>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTiles.map((tile) => (
            <GrokTile
              key={tile.id}
              chatData={tile}
              onDelete={() => onDelete(tile)}
              onClick={() => handleTileClick(tile)}
            />
          ))}
        </div>
        {selectedTile && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => {
              setSelectedTile(null);
              setSelectedTileIndex(-1);
            }}
          >
            <div className="" onClick={(e) => e.stopPropagation()}>
              <GrokTileViewer
                chatData={selectedTile}
                defaultViewMode={defaultViewMode}
              />
            </div>
          </div>
        )}
        <footer className="mt-auto text-center text-sm text-[#8b949e] py-4">
          View and manage your exports.
        </footer>
      </div>
    </main>
  );
}

function getTestData(): ChatData[] {
  const testData: ChatData[] = [
    {
      id: "53a347cb-5a74-42fb-8f23-6cb6c7d84c0f",
      title: "Simple C Console Greeting Script",
      responses: [
        "show me a 10 line c# script",
        'Below is a concise 10-line C# script that demonstrates a simple console application. This script reads a user\'s name from input and greets them. It can be executed in a C# scripting environment (e.g., via `dotnet-script` or a similar tool) or compiled as a basic console program.\n\n```csharp\nusing System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Please enter your name:");\n        string name = Console.ReadLine();\n        Console.WriteLine($"Hello, {name}. This is a 10-line C# script.");\n    }\n}\n```',
        "Explore C# console applications further",
        '### Introduction to C# Console Applications\n\nC# console applications are command-line programs developed using the .NET framework, ideal for tasks such as automation, data processing, and scripting without a graphical user interface. They leverage the System.Console class for input and output operations, enabling efficient interaction via the terminal. This exploration builds upon the basic greeting script provided earlier, delving into structure, features, and practical implementations.\n\n### Basic Structure\n\nA standard C# console application follows this framework:\n\n- **Namespace and Class Declaration**: Encapsulates the code within a namespace for organization.\n- **Main Method**: Serves as the entry point, defined as `static void Main(string[] args)` to accept command-line arguments.\n- **Using Directives**: Import necessary namespaces, such as `System` for console operations.\n\nHere is an expanded example that incorporates command-line arguments and basic error handling:\n\n```csharp\nusing System;\n\nnamespace ConsoleAppExample\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            if (args.Length == 0)\n            {\n                Console.WriteLine("Error: No arguments provided. Usage: Program.exe <name>");\n                return;\n            }\n\n            string name = args[0];\n            Console.WriteLine($"Hello, {name}. This application demonstrates argument handling.");\n        }\n    }\n}\n```\n\nThis code checks for input arguments and provides usage instructions if none are supplied, promoting robustness.\n\n### Key Features and Best Practices\n\n- **Input and Output**: Utilize `Console.ReadLine()` for user input and `Console.WriteLine()` for formatted output. For advanced formatting, employ string interpolation or `String.Format()`.\n- **Command-Line Arguments**: Access via the `args` array in `Main()`, facilitating parameterized execution.\n- **Error Handling**: Implement try-catch blocks to manage exceptions, ensuring graceful failure. For instance:\n  ```csharp\n  try\n  {\n      int number = int.Parse(Console.ReadLine());\n      Console.WriteLine($"Parsed number: {number}");\n  }\n  catch (FormatException)\n  {\n      Console.WriteLine("Invalid input. Please enter a valid integer.");\n  }\n  ```\n- **Asynchronous Operations**: In modern .NET versions (e.g., .NET 9 as of 2025), use `async Task Main()` for non-blocking I/O, enhancing performance for network or file operations.\n- **Configuration and Dependencies**: Integrate appsettings.json for configuration or NuGet packages like System.CommandLine for sophisticated argument parsing.\n- **Deployment**: Compile to a single executable using `dotnet publish --self-contained` for cross-platform distribution.\n\n### Advanced Example: Simple Calculator\n\nConsider this console application that performs basic arithmetic, demonstrating loops and conditional logic:\n\n```csharp\nusing System;\n\nnamespace SimpleCalculator\n{\n    class Program\n    {\n        static void Main()\n        {\n            while (true)\n            {\n                Console.WriteLine("Enter operation (+, -, *, /) or \'q\' to quit:");\n                string operation = Console.ReadLine();\n                if (operation == "q") break;\n\n                Console.WriteLine("Enter first number:");\n                double num1 = double.Parse(Console.ReadLine());\n\n                Console.WriteLine("Enter second number:");\n                double num2 = double.Parse(Console.ReadLine());\n\n                double result = 0;\n                switch (operation)\n                {\n                    case "+": result = num1 + num2; break;\n                    case "-": result = num1 - num2; break;\n                    case "*": result = num1 * num2; break;\n                    case "/": result = num1 / num2; break;\n                    default: Console.WriteLine("Invalid operation."); continue;\n                }\n\n                Console.WriteLine($"Result: {result}");\n            }\n        }\n    }\n}\n```\n\nThis example uses a loop for repeated interactions and a switch statement for operation selection, illustrating control flow in console environments.\n\n### Further Resources\n\nTo deepen your understanding, consult the official Microsoft documentation on .NET console applications or explore open-source repositories on platforms like GitHub for real-world implementations. If you require specifics on a particular feature, such as integration with external libraries, please provide additional details.',
      ],
    },
    {
      id: "3e09bd00-336a-4d4f-a64d-903f16a7088f",
      title: "Python Script: Squares Calculation Example",
      responses: [
        "create a 10 line python script",
        '<xaiArtifact artifact_id="49f8dd58-d61b-42a0-8162-8e9f0eea1c77" artifact_version_id="f87fec86-6ad1-425c-8997-6e04ef29adcc" title="simple_script.py" contentType="text/python">\n# Generate a list of squares for numbers 1 to 10\nsquares = [i**2 for i in range(1, 11)]\n# Print the list of squares\nprint("Squares of numbers 1 to 10:", squares)\n# Calculate and print the sum of squares\nsum_squares = sum(squares)\nprint("Sum of squares:", sum_squares)\n# Find and print the maximum square\nmax_square = max(squares)\nprint("Maximum square:", max_square)\n</xaiArtifact>',
        "Make the script more interactive",
        '<xaiArtifact artifact_id="49f8dd58-d61b-42a0-8162-8e9f0eea1c77" artifact_version_id="1e493313-97de-4bf1-bddc-2ed7d3b24d12" title="interactive_script.py" contentType="text/python">\n# Prompt user for a range of numbers\nstart = int(input("Enter start number (1 or greater): "))\nend = int(input("Enter end number (up to 20): "))\n# Validate input\nif start < 1 or end > 20 or start > end:\n    print("Invalid range! Use numbers where 1 <= start <= end <= 20.")\nelse:\n    # Generate and print squares in the given range\n    squares = [i**2 for i in range(start, end + 1)]\n    print(f"Squares from {start} to {end}: {squares}")\n    print(f"Sum of squares: {sum(squares)}")\n    print(f"Maximum square: {max(squares)}")\n</xaiArtifact>',
      ],
    },
    {
      id: "a29b3eb4-9eef-4bc4-8a6e-ac1b37112252",
      title: "Bash scripting",
      responses: [
        "show me a simple bash script",
        'Below is a simple Bash script that prints "Hello, World!" to the console. This example demonstrates basic script structure, including the shebang line for interpreter specification and an executable command.\n\n```bash\n#!/bin/bash\n\n# This is a comment explaining the script\'s purpose.\necho "Hello, World!"\n```\n\nTo execute this script, save it to a file (e.g., `hello.sh`), make it executable with `chmod +x hello.sh`, and run it using `./hello.sh`. This serves as a foundational template for more complex scripts.',
      ],
    },
    {
      id: "aefe1141-a4fb-496d-b353-5d228a24e520",
      title: "ReactJS: Components, Hooks, and Examples",
      responses: [
        "reactjs framework with examples",
        "### Overview of ReactJS\n\nReactJS, commonly referred to as React, is an open-source JavaScript library developed by Facebook (now Meta) for building dynamic and interactive user interfaces, particularly for single-page applications. It is not a full-fledged framework like Angular or Vue.js, as it focuses primarily on the view layer, but it is often used in conjunction with other libraries or tools to form a complete application ecosystem, such as React Router for navigation or Redux for state management. React emphasizes component-based architecture, enabling developers to create reusable UI elements that efficiently update in response to data changes through a virtual DOM (Document Object Model) mechanism, which minimizes direct manipulation of the actual DOM for improved performance.\n\nKey features of React include:\n- **Component-Based Structure**: Applications are composed of independent, reusable components that manage their own state and logic.\n- **JSX Syntax**: A syntax extension that allows HTML-like code within JavaScript, facilitating the creation of UI elements.\n- **Unidirectional Data Flow**: Data flows in one direction from parent to child components, ensuring predictable behavior.\n- **Hooks**: Introduced in React 16.8, hooks like `useState` and `useEffect` enable functional components to manage state and side effects without class-based syntax.\n- **Virtual DOM**: React maintains a lightweight representation of the DOM, reconciling changes efficiently to optimize rendering.\n\nReact is widely adopted due to its flexibility, large community support, and integration with modern tools like Create React App for scaffolding projects.\n\n### Installation and Setup\n\nTo begin working with React, install it via npm (Node Package Manager). Assuming Node.js is installed, create a new project as follows:\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\nThis command initializes a development server at `http://localhost:3000`.\n\n### Key Examples\n\nBelow are structured examples demonstrating fundamental React concepts. These assume a basic project setup and are intended for illustrative purposes. Code snippets are provided in JSX and JavaScript.\n\n#### 1. Basic Functional Component\nA simple stateless component that renders static content.\n\n```jsx\n// src/App.js\nimport React from 'react';\n\nfunction Greeting() {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n      <p>This is a basic React component.</p>\n    </div>\n  );\n}\n\nexport default Greeting;\n```\n\nIn this example, `Greeting` is a functional component that returns JSX markup. It can be imported and rendered in the main application file.\n\n#### 2. Component with Props\nProps allow passing data from parent to child components.\n\n```jsx\n// src/ParentComponent.js\nimport React from 'react';\nimport ChildComponent from './ChildComponent';\n\nfunction ParentComponent() {\n  return (\n    <ChildComponent name=\"Alice\" age={30} />\n  );\n}\n\nexport default ParentComponent;\n\n// src/ChildComponent.js\nimport React from 'react';\n\nfunction ChildComponent(props) {\n  return (\n    <div>\n      <h2>Hello, {props.name}!</h2>\n      <p>You are {props.age} years old.</p>\n    </div>\n  );\n}\n\nexport default ChildComponent;\n```\n\nHere, `name` and `age` are props passed from `ParentComponent` to `ChildComponent`, demonstrating data propagation.\n\n#### 3. Stateful Component with Hooks\nUsing `useState` to manage local state.\n\n```jsx\n// src/Counter.js\nimport React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Current count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\nThis component initializes state with `useState` and updates it via an event handler, illustrating reactive UI updates.\n\n#### 4. Lifecycle Management with useEffect\nHandling side effects, such as fetching data.\n\n```jsx\n// src/DataFetcher.js\nimport React, { useState, useEffect } from 'react';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    fetch('https://api.example.com/data')\n      .then(response => response.json())\n      .then(data => setData(data))\n      .catch(error => console.error('Error fetching data:', error));\n  }, []); // Empty dependency array runs effect once on mount\n\n  return (\n    <div>\n      {data ? <p>Data loaded: {JSON.stringify(data)}</p> : <p>Loading...</p>}\n    </div>\n  );\n}\n\nexport default DataFetcher;\n```\n\nThe `useEffect` hook simulates an API call on component mount, updating the state upon completion.\n\n### Best Practices\n- Organize components into a modular directory structure (e.g., `components/`, `pages/`).\n- Use tools like ESLint for code quality and PropTypes for type-checking props.\n- For complex state management, integrate Redux or Context API.\n- Ensure accessibility by adhering to ARIA standards in JSX.\n\nFor further exploration, refer to the official React documentation at react.dev, which provides comprehensive tutorials and API references. If you require additional examples or clarification on specific aspects, please provide more details.",
      ],
    },
    {
      id: "65061fe7-03a7-4809-bd3d-784fb371452a",
      title: "CSS Frameworks: Overview and Examples",
      responses: [
        "css framework with examples",
        '### Overview of CSS Frameworks\n\nCSS frameworks are pre-written collections of CSS styles, components, and utilities designed to accelerate web development by providing responsive, consistent, and customizable design elements. They enable developers to build user interfaces efficiently without starting from scratch, often incorporating features such as grid systems, typography, and interactive components. Based on current trends in 2025, the following are among the most popular CSS frameworks, selected for their widespread adoption, features, and community support. Each is described below with key features, advantages, disadvantages, and a practical code example to illustrate basic usage.\n\n### Popular CSS Frameworks with Examples\n\n#### 1. Bootstrap\nBootstrap is an open-source framework emphasizing responsive, mobile-first design. It includes a comprehensive grid system, pre-built components (e.g., buttons, modals, navbars), and JavaScript plugins for interactivity. It is ideal for prototyping and enterprise applications due to its extensive ecosystem and cross-browser compatibility.\n\n**Key Features:** Grid system dividing screens into columns; supports Sass for customization; built-in JavaScript for elements like carousels and tooltips.  \n**Pros:** Large community, rapid development, ensures responsiveness.  \n**Cons:** Sites may appear uniform; larger file size if not optimized.  \n\n**Example: Responsive Navbar and Button**  \nThis example demonstrates a basic responsive navigation bar that collapses on smaller screens, along with a primary button. Include the Bootstrap CDN in your HTML file.\n\n```html\n<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">\n  <title>Bootstrap Example</title>\n</head>\n<body>\n  <!-- Responsive Navbar -->\n  <nav class="navbar navbar-expand-lg bg-body-tertiary">\n    <div class="container-fluid">\n      <a class="navbar-brand" href="#">Navbar</a>\n      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n        <span class="navbar-toggler-icon"></span>\n      </button>\n      <div class="collapse navbar-collapse" id="navbarNav">\n        <ul class="navbar-nav">\n          <li class="nav-item">\n            <a class="nav-link active" aria-current="page" href="#">Home</a>\n          </li>\n          <li class="nav-item">\n            <a class="nav-link" href="#">Features</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <!-- Primary Button -->\n  <div class="container mt-3">\n    <button type="button" class="btn btn-primary">Primary Button</button>\n  </div>\n\n  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>\n</body>\n</html>\n```\n\n\n#### 2. Tailwind CSS\nTailwind CSS adopts a utility-first approach, allowing developers to apply styles directly in HTML via classes, reducing the need for custom CSS. It is highly customizable and optimized for performance, making it suitable for projects requiring unique branding.\n\n**Key Features:** Utility classes for elements like colors, spacing, and typography; just-in-time compilation to minimize file sizes; supports Flexbox and CSS Grid.  \n**Pros:** Granular control, fast development, lightweight output.  \n**Cons:** Steeper learning curve due to numerous classes; may lead to verbose HTML.  \n\n**Example: Styled Button and Basic Card**  \nThis example uses utility classes to create a button with hover effects and a card component. Ensure Tailwind is installed or use the CDN for testing.\n\n```html\n<!doctype html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <script src="https://cdn.tailwindcss.com"></script>\n</head>\n<body>\n  <!-- Button -->\n  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">\n    Click Me\n  </button>\n\n  <!-- Basic Card -->\n  <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">\n    <img class="w-full" src="image.jpg" alt="Card Image">\n    <div class="px-6 py-4">\n      <div class="font-bold text-xl mb-2">Card Title</div>\n      <p class="text-gray-700 text-base">\n        This is a simple card description.\n      </p>\n    </div>\n    <div class="px-6 pt-4 pb-2">\n      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#tag1</span>\n    </div>\n  </div>\n</body>\n</html>\n```\n\n\n#### 3. Bulma\nBulma is a Flexbox-based framework that is CSS-only, focusing on modularity and responsiveness without JavaScript dependencies. It offers clean, modern components and is easy to customize with Sass.\n\n**Key Features:** Modular import system; tile-based grids; components like columns, heroes, and forms.  \n**Pros:** Lightweight, browser-compatible, simple to learn.  \n**Cons:** Lacks built-in JavaScript; fewer advanced animations.  \n\n**Example: Columns and Hero Section**  \nThis example creates a responsive column layout within a hero section. Link the Bulma CSS CDN.\n\n```html\n<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">\n  <title>Bulma Example</title>\n</head>\n<body>\n  <!-- Hero Section -->\n  <section class="hero is-primary">\n    <div class="hero-body">\n      <div class="container">\n        <h1 class="title">Hero Title</h1>\n        <h2 class="subtitle">Hero Subtitle</h2>\n      </div>\n    </div>\n  </section>\n\n  <!-- Columns -->\n  <div class="container mt-5">\n    <div class="columns">\n      <div class="column is-one-third">\n        <p>Column 1</p>\n      </div>\n      <div class="column is-one-third">\n        <p>Column 2</p>\n      </div>\n      <div class="column is-one-third">\n        <p>Column 3</p>\n      </div>\n    </div>\n  </div>\n</body>\n</html>\n```\n(Note: This example is derived from standard Bulma documentation patterns, as the specific page query returned insufficient content.)\n\n#### 4. Foundation\nFoundation provides a robust toolkit for responsive design, including grids, UI components, and accessibility features. It is modular and supports both websites and emails, with a focus on flexibility.\n\n**Key Features:** Flexbox and CSS Grid options; responsive typography; Motion UI for animations.  \n**Pros:** Scalable for enterprise use; accessible by default.  \n**Cons:** More complex setup; steeper learning curve.  \n\n**Example: Basic Grid Container**  \nThis example uses a simple grid for layout. Include the Foundation CDN.\n\n```html\n<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/foundation-sites@6.7.5/dist/css/foundation.min.css">\n  <title>Foundation Example</title>\n</head>\n<body>\n  <div class="grid-container">\n    <div class="grid-x grid-margin-x">\n      <div class="cell small-12 medium-6 large-4">\n        <p>Cell 1</p>\n      </div>\n      <div class="cell small-12 medium-6 large-8">\n        <p>Cell 2</p>\n      </div>\n    </div>\n  </div>\n</body>\n</html>\n```\n\n\n#### 5. Chakra UI\nChakra UI is a React-specific component library with CSS-in-JS styling, emphasizing accessibility and theming. It supports dark mode and is ideal for React applications.\n\n**Key Features:** ARIA-compliant components; runtime theme switching; props-based styling.  \n**Pros:** Excellent for React; built-in accessibility.  \n**Cons:** Tied to React; potential performance overhead from CSS-in-JS.  \n\n**Example: Themed Button (Requires React Setup)**  \nIn a React component file:\n\n```jsx\nimport { Button, ChakraProvider } from \'@chakra-ui/react\';\n\nfunction App() {\n  return (\n    <ChakraProvider>\n      <Button colorScheme="blue" size="lg">Click Me</Button>\n    </ChakraProvider>\n  );\n}\n\nexport default App;\n```\nThis creates a large blue button with theme support.\n\n### Comparison Table\n\n| Framework     | Best For                  | Layout System | JavaScript Included | File Size Impact |\n|---------------|---------------------------|---------------|---------------------|------------------|\n| Bootstrap    | Prototyping, Beginners   | Flexbox      | Yes                | Medium          |\n| Tailwind CSS | Customization, Speed     | Flexbox & Grid | No                 | Low (Optimized) |\n| Bulma        | Lightweight Projects     | Flexbox      | No                 | Low             |\n| Foundation   | Enterprise, Scalability  | Flexbox & Grid | Optional           | Medium          |\n| Chakra UI    | React Apps, Accessibility| Flexbox & Grid | No (React Props)   | Medium          |\n\nWhen selecting a framework, consider project requirements such as team expertise, performance needs, and integration with other tools. For further details, consult official documentation.',
      ],
    },
    {
      id: "a6e4b58e-3852-4005-9887-c7e0a621859a",
      title: "Basic C++ Hello World Program",
      responses: [
        "show me a c++ program",
        '```cpp\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n```\n\nThis is a basic C++ program that outputs the message "Hello, World!" to the console. It includes the iostream header for input/output operations, defines a main function as the entry point, uses std::cout to print the string, and returns 0 to indicate successful execution.',
        "Enhance with user input",
        '```cpp\n#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    std::cout << "Please enter your name: ";\n    std::getline(std::cin, name);\n    std::cout << "Hello, " << name << "!" << std::endl;\n    return 0;\n}\n```\n\nThis C++ program enhances the basic "Hello, World!" example by incorporating user input. It includes the iostream and string headers for input/output and string handling. The main function prompts the user to enter their name, reads the input using std::getline to handle full lines including spaces, and then outputs a personalized greeting. The program returns 0 to indicate successful execution.',
        "Compare C++ with Python input handling",
      ],
    },

    {
      id: "4e09bd00-336a-4d4f-a64d-903f16a7088f",
      title: "Scripting CPython",
      responses: [
        "create a 10 line python script",
        '<xaiArtifact artifact_id="49f8dd58-d61b-42a0-8162-8e9f0eea1c77" artifact_version_id="f87fec86-6ad1-425c-8997-6e04ef29adcc" title="simple_script.py" contentType="text/python">\n# Generate a list of squares for numbers 1 to 10\nsquares = [i**2 for i in range(1, 11)]\n# Print the list of squares\nprint("Squares of numbers 1 to 10:", squares)\n# Calculate and print the sum of squares\nsum_squares = sum(squares)\nprint("Sum of squares:", sum_squares)\n# Find and print the maximum square\nmax_square = max(squares)\nprint("Maximum square:", max_square)\n</xaiArtifact>',
        "Make the script more interactive",
        '<xaiArtifact artifact_id="49f8dd58-d61b-42a0-8162-8e9f0eea1c77" artifact_version_id="1e493313-97de-4bf1-bddc-2ed7d3b24d12" title="interactive_script.py" contentType="text/python">\n# Prompt user for a range of numbers\nstart = int(input("Enter start number (1 or greater): "))\nend = int(input("Enter end number (up to 20): "))\n# Validate input\nif start < 1 or end > 20 or start > end:\n    print("Invalid range! Use numbers where 1 <= start <= end <= 20.")\nelse:\n    # Generate and print squares in the given range\n    squares = [i**2 for i in range(start, end + 1)]\n    print(f"Squares from {start} to {end}: {squares}")\n    print(f"Sum of squares: {sum(squares)}")\n    print(f"Maximum square: {max(squares)}")\n</xaiArtifact>',
      ],
    },
  ];

  return testData;
}
