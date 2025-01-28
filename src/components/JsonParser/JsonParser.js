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
import JsonViewer from "../jsonViewer/jsonViewer";

const JsonParser = () => {
  const dispatch = useDispatch();
  const { input, parsedOutput, error, isValid } = useSelector(
    (state) => state.json
  );
  const [inputLineCount, setInputLineCount] = useState(1);
  const [outputLineCount, setOutputLineCount] = useState(1);
  const textAreaRef = useRef(null);
  const inputLineNumbersRef = useRef(null);
  const outputLineNumbersRef = useRef(null);

  const updateLineCount = (text, setCount) => {
    const lines = text.split("\n").length;
    setCount(lines);
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
      dispatch(setParsedOutput(parsed));
      updateLineCount(JSON.stringify(parsed, null, 2), setOutputLineCount);
    } catch (err) {
      dispatch(setError("Invalid JSON format: " + err.message));
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(parsedOutput, null, 2)
      );
      toast.success("Text copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text. Please try again.");
    }
  };

  useEffect(() => {
    updateLineCount(input, setInputLineCount);
    if (parsedOutput) {
      updateLineCount(
        JSON.stringify(parsedOutput, null, 2),
        setOutputLineCount
      );
    }
  }, []);

  const lineNumbers = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1).map((num) => (
      <div key={num} className={styles.lineNumber}>
        {num}
      </div>
    ));
  };

  const handleScroll = (e, lineNumbersRef) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className={styles.jsonParser}>
      <div className={styles.inputSection}>
        <label htmlFor="jsonInput" className={styles.label}>
          Enter JSON:
        </label>
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
            wrap="off"
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={validateAndParseJSON} className={styles.parseButton}>
          DECODE
        </button>
      </div>

      <div className={styles.outputSection}>
        <label className={styles.label}>Parsed Output:</label>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.outputContainer}>
            <div className={styles.outputDiv}>
              <div className={styles.lineNumbers} ref={outputLineNumbersRef}>
                {lineNumbers(outputLineCount)}
              </div>
              <div
                className={`${styles.output} ${isValid ? styles.valid : ""}`}
                onScroll={(e) => handleScroll(e, outputLineNumbersRef)}
              >
                {parsedOutput && <JsonViewer data={parsedOutput} />}
              </div>
            </div>

            {parsedOutput && (
              <button onClick={copyText} className={styles.copyButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v4" />
                  <path d="M21 14H11" />
                  <path d="m15 10-4 4 4 4" />
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
