import React, {FC, useCallback, useState} from "react";
import ReactMarkdown from "react-markdown";
import {ToggleButtonGroup, ToggleButton} from "@material-ui/lab";
import {JavaScriptIcon} from "./icons/JavaScriptIcon";
import {TypeScriptIcon} from "./icons/TypeScriptIcon";
import CodeIcon from "@material-ui/icons/Code";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {Field, useDataHook} from "model-react";
import {
    Box,
    Collapse,
    Fade,
    IconButton,
    makeStyles,
    Snackbar,
    Tooltip,
} from "@material-ui/core";
import copy from "clipboard-copy";

import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vs} from "react-syntax-highlighter/dist/esm/styles/prism";

// Some code has been taken from: https://github.com/mui-org/material-ui/blob/master/docs/src/modules/components/Demo.js

const showJs = new Field(false);

const useDemoStyle = makeStyles(
    theme => ({
        demo: {
            backgroundColor: "#eee",
            marginBottom: 8,
            padding: 8,
        },
    }),
    {name: "DemoStyle"}
);

/**
 * The example component, to renders the example including description, result and source code
 */
export const Example: FC<{
    MD: string;
    JS: string;
    TS: string;
    result: JSX.Element;
    showCodeInitial?: boolean;
}> = ({MD, JS, TS, result, showCodeInitial = false}) => {
    const {demo} = useDemoStyle();
    const [h] = useDataHook();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [codeVisible, setCodeVisible] = useState(showCodeInitial);
    return (
        <div>
            <ReactMarkdown renderers={renderers}>{MD}</ReactMarkdown>
            <Box className={demo}>{result}</Box>
            <Box justifyContent="center" display="flex" alignItems="top">
                <Fade in={codeVisible}>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={showJs.get(h) ? "js" : "ts"}
                        onChange={(e, v) => showJs.set(v == "js")}>
                        <ToggleButton value="ts" aria-label="show ts source">
                            <TypeScriptIcon />
                        </ToggleButton>
                        <ToggleButton value="js" aria-label="show js source">
                            <JavaScriptIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Fade>
                <Box flex={1} />
                <Tooltip title="Show code" placement="top">
                    <IconButton
                        aria-label={"show code"}
                        onClick={useCallback(() => setCodeVisible(v => !v), [])}>
                        <CodeIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy code" placement="top">
                    <IconButton
                        aria-label={"copy code"}
                        onClick={useCallback(() => {
                            const code = showJs.get(h) ? JS : TS;
                            copy(code).then(() => {
                                setSnackbarMessage("The source code has been copied!");
                                setSnackbarOpen(true);
                            });
                        }, [showJs.get(h), JS, TS])}>
                        <FileCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Collapse in={codeVisible} unmountOnExit>
                {showJs.get(h) ? (
                    <SyntaxHighlighter
                        language="jsx"
                        style={vs}
                        lineProps={{
                            style: {wordBreak: "break-all", whiteSpace: "pre-wrap"},
                        }}
                        wrapLines>
                        {JS}
                    </SyntaxHighlighter>
                ) : (
                    <SyntaxHighlighter
                        language="tsx"
                        style={vs}
                        lineProps={{
                            style: {wordBreak: "break-all", whiteSpace: "pre-wrap"},
                        }}
                        wrapLines>
                        {TS}
                    </SyntaxHighlighter>
                )}
            </Collapse>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={useCallback(() => setSnackbarOpen(false), [])}
                message={snackbarMessage}
            />
        </div>
    );
};

const InlineCodeWrapper: FC = ({children}) => {
    return <>{children}</>;
};
const renderers = {
    code: ({language, value}: {language: string; value: string}) => (
        <SyntaxHighlighter
            PreTag={InlineCodeWrapper}
            style={vs}
            language={language}
            children={value}
        />
    ),
};
