# Run It Back - Chrome Extension

A powerful Chrome extension for capturing, inspecting, and replaying network requests.

## Features

- 🔄 Capture and replay HTTP requests
- 📝 Edit request details before replaying
- 🔍 Inspect request and response data
- 🛠️ DevTools integration for advanced debugging

## Installation

### Development Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd runitback
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build the extension:
```bash
npm run build
```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` directory from the project

### Production Installation

[Add Chrome Web Store link when available]

## Usage

### Capturing Requests

[Add screenshot of request capture interface]

1. Click the extension icon in your browser toolbar
2. Navigate to the "Capture" tab
3. Browse your target website - requests will be automatically captured

### Replaying Requests

[Add screenshot of request replay interface]

1. Select a captured request from the list
2. Click the "Replay" button to send the request
3. View the response in the details panel

### Editing Requests

[Add screenshot of request editor]

1. Select a request from the list
2. Click "Edit Request"
3. Modify headers, body, or other request details
4. Save changes and replay the modified request

### DevTools Integration

[Add screenshot of DevTools panel]

1. Open Chrome DevTools (F12)
2. Navigate to the "Run It Back" panel
3. Access advanced debugging features and request history

## Project Structure

```
src/
├── background/     # Background script
├── content/        # Content scripts
├── devtools/       # DevTools panel
├── popup/          # Extension popup
├── components/     # React components
├── services/       # Core services
└── models/         # TypeScript interfaces
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build extension for production
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Tech Stack

- React
- TypeScript
- Vite
- Chrome Extension APIs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add license information]

## Support

[Add support information or contact details]
