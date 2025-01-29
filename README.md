# JSON Parser Application

A simple and intuitive JSON Parser built with **Next.js 15**, **Redux**, and **SCSS**. This application allows users to paste, format, validate, and view JSON data in a structured manner.

## 🚀 Features

- **JSON Parsing & Validation**: Parses user-input JSON and highlights errors if present.
- **JSON Formatting**: Formats JSON with proper indentation.
- **Collapsible JSON Viewer**: Displays parsed JSON in a structured and collapsible format.
- **Clipboard Integration**: Supports copying and pasting JSON content.
- **Line Numbering**: Shows line numbers for better readability.
- **Error Handling**: Displays validation errors in a user-friendly way.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, SCSS
- **State Management**: Redux
- **Notifications**: React Hot Toast

## 📂 Project Structure

```
📦 json-parser-app
├── 📂 src
│   ├── 📂 components
│   │   ├── 📂 JsonParser (Main JSON Editor & Parser)
│   │   ├── 📂 JsonViewer (Collapsible JSON Viewer)
│   ├── 📂 lib
│   │   ├── 📂 store (Redux Store & Slice for JSON Parsing)
└── 📜 README.md
```

## 💻 Installation & Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Krishn2709/new-json-parser.git
   cd json-parser-app
   ```

2. **Install dependencies**:
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Usage Guide

1. **Paste JSON** into the editor.
2. Click **Format** (🔄) to auto-indent the JSON.
3. Click **Decode** to parse and view the JSON structure.
4. Use **Collapsible View** to navigate complex JSON objects.
5. Click **Copy** (📄) to copy the formatted JSON.

## 🛠️ Development Notes

- **Next.js App Router** is used for routing.
- **Redux** is used for managing JSON state.
- **SCSS Modules** handle styling.
- **React Hot Toast** for user notifications.



