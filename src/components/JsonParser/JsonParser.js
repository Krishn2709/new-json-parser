"use client";
import { useDispatch, useSelector } from "react-redux";
import {
  setInput,
  setParsedOutput,
  setError,
} from "../../lib/store/features/jsonParseSlice";
import styles from "./JsonParser.module.scss";

const convertToString = (obj) => {
  let jsonString = JSON.stringify(obj, null, 2);
  jsonString = jsonString.replace(/"([^"]+)":/g, "$1:");

  return jsonString;
};

const JsonParser = () => {
  const dispatch = useDispatch();
  const { input, parsedOutput, error, isValid } = useSelector(
    (state) => state.json
  );

  const handleInputChange = (e) => {
    dispatch(setInput(e.target.value));
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
    } catch (err) {
      dispatch(setError("Invalid JSON format: " + err.message));
    }
  };

  return (
    <div className={styles.jsonParser}>
      <div className={styles.inputSection}>
        <label htmlFor="jsonInput" className={styles.label}>
          Enter JSON:
        </label>
        <textarea
          id="jsonInput"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
          className={styles.textArea}
        />
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
          <div className={`${styles.output} ${isValid ? styles.valid : ""}`}>
            {parsedOutput}
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonParser;
