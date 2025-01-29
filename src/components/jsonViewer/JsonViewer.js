import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import styles from "./JsonViewer.module.scss";

const JsonViewer = ({ data }) => {
  const [expandedKeys, setExpandedKeys] = useState({});

  const toggleExpand = (expand) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [expand]: !prev[expand],
    }));
  };

  const renderValue = (value, keyPath) => {
    if (Array.isArray(value)) {
      const isExpanded = expandedKeys[keyPath];
      return (
        <div>
          <div
            className={styles.collapsibleKey}
            onClick={() => toggleExpand(keyPath)}
            aria-expanded={isExpanded}
            role="button"
            tabIndex={0}
          >
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
            <span className={styles.key}>Array [{value.length}]</span>
          </div>
          {isExpanded && (
            <div className={styles.collapsibleContent}>
              {value.map((item, index) => (
                <div key={`${keyPath}-${index}`} className={styles.arrayItem}>
                  {renderValue(item, `${keyPath}-${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else if (typeof value === "object" && value !== null) {
      const isExpanded = expandedKeys[keyPath];
      return (
        <div>
          <div
            className={styles.collapsibleKey}
            onClick={() => toggleExpand(keyPath)}
            aria-expanded={isExpanded}
            role="button"
            tabIndex={0}
          >
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
            <span className={styles.key}>Object</span>
          </div>
          {isExpanded && (
            <div className={styles.collapsibleContent}>
              {Object.entries(value).map(([key, val]) => (
                <div key={`${keyPath}-${key}`} className={styles.objectItem}>
                  <span className={styles.key}>{key}:</span>{" "}
                  {renderValue(val, `${keyPath}-${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else if (typeof value === "boolean") {
      return (
        <span className={`${styles.value} ${styles.boolean}`}>
          {value ? "true" : "false"}
        </span>
      );
    } else if (value === null) {
      return <span className={`${styles.value} ${styles.null}`}>null</span>;
    } else if (typeof value === "string") {
      return (
        <span className={`${styles.value} ${styles.string}`}>{value}</span>
      );
    } else if (typeof value === "number") {
      return (
        <span className={`${styles.value} ${styles.number}`}>{value}</span>
      );
    } else {
      return <span className={styles.value}>{value}</span>;
    }
  };

  return <div className={styles.jsonViewer}>{renderValue(data, "root")}</div>;
};

export default JsonViewer;
