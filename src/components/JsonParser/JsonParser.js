"use client";

import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInput,
  setParsedOutput,
  setError,
} from "../../lib/store/features/jsonParseSlice";
import styles from "./JsonParser.module.scss";
import { toast } from "react-hot-toast";
import JsonViewer from "../jsonViewer/JsonViewer";

const JsonParser = () => {
  const dispatch = useDispatch();
  const { input, parsedOutput, error, isValid } = useSelector(
    (state) => state.json
  );
  const [inputLineCount, setInputLineCount] = useState(1);
  const [isFormatted, setIsFormatted] = useState(false);
  const [unformattedInput, setUnformattedInput] = useState("");

  const textAreaRef = useRef(null);
  const inputLineNumbersRef = useRef(null);

  const updateLineCount = (text, setCount) => {
    const lines = text.split("\n").length;
    setCount(lines);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    dispatch(setInput(newValue));
    updateLineCount(newValue, setInputLineCount);
  };

  const formatJSON = () => {
    if (!input.trim()) {
      dispatch(setError("Please enter JSON content"));
      return;
    }

    try {
      if (!isFormatted) {
        setUnformattedInput(input);
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, 2);
        dispatch(setInput(formatted));
        updateLineCount(formatted, setInputLineCount);
        toast.success("JSON formatted successfully!");
      } else {
        dispatch(setInput(unformattedInput));
        updateLineCount(unformattedInput, setInputLineCount);
        toast.success("JSON unformatted successfully!");
      }
      setIsFormatted(!isFormatted);
    } catch (err) {
      dispatch(setError("Invalid JSON format: " + err.message));
    }
  };

  const clearContent = () => {
    dispatch(setInput(""));
    dispatch(setParsedOutput(null));
    dispatch(setError(""));
    setInputLineCount(1);
    setIsFormatted(false);
    setUnformattedInput("");
    toast.success("Content cleared!");
  };

  const pasteContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      dispatch(setInput(text));
      updateLineCount(text, setInputLineCount);
      setIsFormatted(false);
      toast.success("Content pasted successfully!");
    } catch (err) {
      toast.error("Failed to paste content. Please try again.");
    }
  };

  const validateAndParseJSON = () => {
    if (!input.trim()) {
      dispatch(setError("Please enter JSON content"));
      return;
    }

    try {
      const parsed = JSON.parse(input);
      dispatch(setParsedOutput(parsed));
    } catch (err) {
      dispatch(setError("Invalid JSON format: " + err.message));
    }
  };

  const formatJSONWithoutQuotes = (obj, indent = 2) => {
    if (obj === null) return "null";
    if (typeof obj === "undefined") return "undefined";
    if (typeof obj === "number") return obj.toString();
    if (typeof obj === "boolean") return obj.toString();
    if (typeof obj === "string") return `${obj}`;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]";
      const items = obj
        .map((item) => formatJSONWithoutQuotes(item, indent))
        .join(",\n");
      return `[\n${items
        .split("\n")
        .map((line) => " ".repeat(indent) + line)
        .join("\n")}\n]`;
    }

    if (typeof obj === "object") {
      if (Object.keys(obj).length === 0) return "{}";
      const pairs = Object.entries(obj)
        .map(([key, value]) => {
          const formattedValue = formatJSONWithoutQuotes(value, indent + 2);
          return `${key}: ${formattedValue}`;
        })
        .join(",\n");
      return `{\n${pairs
        .split("\n")
        .map((line) => " ".repeat(indent) + line)
        .join("\n")}\n}`;
    }

    return obj.toString();
  };

  const copyText = async () => {
    if (!parsedOutput) return;

    try {
      const formattedText = formatJSONWithoutQuotes(parsedOutput);
      await navigator.clipboard.writeText(formattedText);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text. Please try again.");
    }
  };

  const lineNumbers = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1).map((num) => (
      <div key={num} className={styles.lineNumber}>
        {num}
      </div>
    ));
  };

  const handleScroll = (e, lineNumbersRef) => {
    if (lineNumbersRef?.current) {
      lineNumbersRef.current.scrollTop = e?.target?.scrollTop;
    }
  };

  return (
    <div className={styles.jsonParser}>
      <div
        className={`${styles.inputSection} ${error ? styles.errorState : ""}`}
      >
        <div className={styles.inputHeader}>
          <label htmlFor="jsonInput" className={styles.label}>
            Enter JSON:
          </label>
          <div className={styles.inputButtons}>
            <button
              onClick={clearContent}
              className={`${styles.actionButton} ${styles.clearButton}`}
              title="Clear content"
            >
              🗑️
            </button>
            <button
              onClick={pasteContent}
              className={`${styles.actionButton} ${styles.pasteButton}`}
              title="Paste content"
            >
              📋
            </button>
            <button
              onClick={formatJSON}
              className={`${styles.actionButton} ${styles.formatButton}`}
              title={isFormatted ? "Unformat content" : "Format content"}
            >
              🔄
            </button>
          </div>
        </div>
        <div className={styles.textAreaDiv}>
          <div className={styles.lineNumbers} ref={inputLineNumbersRef}>
            {lineNumbers(inputLineCount)}
          </div>
          <textarea
            ref={textAreaRef}
            id="jsonInput"
            value={input}
            onChange={handleInputChange}
            onScroll={(e) => handleScroll(e, inputLineNumbersRef)}
            placeholder="Paste your JSON here..."
            className={styles.textArea}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={validateAndParseJSON} className={styles.parseButton}>
          DECODE
        </button>
      </div>

      <div className={styles.outputSection}>
        <label className={`${styles.label} ${styles.outputlabel}`}>
          Parsed Output:
        </label>
        {error ? (
          <div className={styles.outputDiv}></div>
        ) : (
          <div className={styles.outputContainer}>
            <div className={styles.outputDiv}>
              <div
                className={`${styles.output} ${isValid ? styles.valid : ""}`}
              >
                {parsedOutput && <JsonViewer data={parsedOutput} />}
              </div>
            </div>

            {parsedOutput && (
              <button
                onClick={copyText}
                className={styles.copyButton}
                title="Copy content"
              >
                📄
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonParser;
