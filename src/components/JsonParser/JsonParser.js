"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setInput,
  setParsedOutput,
  setError,
} from "../../lib/store/features/jsonParseSlice";
import styles from "./JsonParser.module.scss";
import { toast } from "react-hot-toast";

const JsonParser = () => {
  const dispatch = useDispatch();
  const { input, parsedOutput, error, isValid } = useSelector(
    (state) => state.json
  );
  const [inputLineCount, setInputLineCount] = useState(1);
  const [outputLineCount, setOutputLineCount] = useState(1);
  const textAreaRef = useRef(null);

  const updateLineCount = (text, setCount) => {
    const lines = text.split("\n").length;
    setCount(lines);
  };

  const convertToString = (obj) => {
    let jsonString = JSON.stringify(obj, null, 2);
    jsonString = jsonString.replace(/"([^"]+)":/g, "$1:");
    return jsonString;
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    dispatch(setInput(newValue));
    updateLineCount(newValue, setInputLineCount);
  };

  const validateAndParseJSON = () => {
    if (!input.trim()) {
      dispatch(setError("Please enter JSON content"));
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = convertToString(parsed);
      dispatch(setParsedOutput(formatted));
      updateLineCount(formatted, setOutputLineCount);
    } catch (err) {
      dispatch(setError("Invalid JSON format: " + err.message));
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(parsedOutput);
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text. Please try again.");
    }
  };

  useEffect(() => {
    updateLineCount(input, setInputLineCount);
    if (parsedOutput) {
      updateLineCount(parsedOutput, setOutputLineCount);
    }
  }, []);

  const lineNumbers = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1).map((num) => (
      <div key={num} className={styles.lineNumber}>
        {num}
      </div>
    ));
  };

  return (
    <div className={styles.jsonParser}>
      <div className={styles.inputSection}>
        <label htmlFor="jsonInput" className={styles.label}>
          Enter JSON:
        </label>
        <div className={styles.textAreaDiv}>
          <div className={styles.lineNumbers}>
            {lineNumbers(inputLineCount)}
          </div>
          <textarea
            ref={textAreaRef}
            id="jsonInput"
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your JSON here..."
            className={styles.textArea}
            wrap="off"
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={validateAndParseJSON} className={styles.parseButton}>
          Parse JSON
        </button>
      </div>

      <div className={styles.outputSection}>
        <label className={styles.label}>Parsed Output:</label>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.outputContainer}>
            <div className={styles.outputDiv}>
              <div className={styles.lineNumbers}>
                {lineNumbers(outputLineCount)}
              </div>
              <div
                className={`${styles.output} ${isValid ? styles.valid : ""}`}
              >
                {parsedOutput}
              </div>
            </div>
            {parsedOutput && (
              <button onClick={copyText} className={styles.copyButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.svg}
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonParser;
