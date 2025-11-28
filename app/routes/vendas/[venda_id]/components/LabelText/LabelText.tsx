import React from "react";
import styles from "./LabelText.module.css";
interface LabelTextProps {
    label: string;
    text: string;
    style?: React.CSSProperties;
    styleLabel?: React.CSSProperties;
    styleValue?: React.CSSProperties;
}

function LabelText({ label, text, style, styleLabel, styleValue }: LabelTextProps) {
    return (
        <div className={styles.content} style={style}>
            <p className={styles.label} style={styleLabel}>{label}:</p>
            <p style={styleValue}>{text}</p>
        </div>
    )
}

export default LabelText;