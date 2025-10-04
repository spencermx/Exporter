# Grok Exporter

## Overview
Grok Exporter is a web application designed to manage and visualize chat data stored in Chrome extension storage. It presents chat entries as a grid of interactive tiles, each displaying a title and a preview of the conversation content. Users can click a tile to view the full conversation in an expanded viewer, with options to perform operations such as editing or deleting entries. This tool is particularly useful for users of the Grok AI platform who wish to archive, analyze, or export their conversation history stored locally in Chrome.

## Browser Extension
<img width="354" height="275" alt="browserextension" src="https://github.com/user-attachments/assets/8a30c33a-9769-457f-9493-b52664229a16" />

*Figure 1: Browser extension interface.*

### Export
#### Start Export
<img width="1224" height="538" alt="exporting" src="https://github.com/user-attachments/assets/ed9ac912-726a-41aa-a27e-1ee024d0d1b8" />

*Figure 2: Export process initiation.*

#### Export Complete
<img width="1224" height="538" alt="exportsuccess" src="https://github.com/user-attachments/assets/31413d33-a597-418b-88ab-a6545d185388" />

*Figure 3: Successful export completion.*

## Features
- **Tile Grid Display**: View all chat entries as a responsive grid, with each tile showing the chat title and a 200-character content preview.
- **Expanded Viewer**: Click a tile to access a detailed view of the conversation, rendered in a preformatted block for readability.
- **Interactive Operations**: Perform actions like editing or deleting chat entries directly from the viewer (delete operation removes entries from Chrome storage).
- **Theming**: Dark, GitHub-inspired design with smooth hover effects, subtle shadows, and blue/red accents for interactive elements. Implemented using CSS with variables for easy customization.
- **Responsive Design**: Adapts to various screen sizes using a flexible grid layout.

## Tech Stack
- Frontend: HTML, CSS, and JavaScript (with potential use of frameworks like React for dynamic components).
- Storage: Chrome Storage API for managing chat data.
- Build Tools: Node.js and npm for dependency management and development.

## Contributing
Contributions are welcome. Please fork the repository, create a feature branch, and submit a pull request. For bugs, open an issue with details on reproduction steps.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Disclaimer
This project is an independent, third-party tool and is not affiliated with, endorsed by, or sponsored by xAI or the Grok AI platform. It is developed solely for educational and personal use purposes.
