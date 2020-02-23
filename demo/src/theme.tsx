import React from "react";
import {createTheme} from "@deity/falcon-ui";
import {FiTrash2, FiPlus} from "react-icons/fi";

export const theme = createTheme({
    colors: {
        primaryLight: "#8888ff",
        primary: "#4444ff",
        primaryDark: "#0000aa",
    },
    icons: {
        trash: {icon: ({className, ...props}) => <FiTrash2 {...props} />},
        add: {icon: ({className, ...props}) => <FiPlus {...props} />},
        loader: {
            icon: props => (
                <svg viewBox="0 0 50 50" {...props}>
                    <path
                        d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
                        transform="rotate(241.969 25 25)">
                        <animateTransform
                            attributeType="xml"
                            attributeName="transform"
                            type="rotate"
                            from="0 25 25"
                            to="360 25 25"
                            dur="0.8s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>
            ),
            size: "xxl",
            stroke: "transparent",
            fill: "primary",
        },
    },
    fonts: {
        // sans: '"Comic Sans MS", "Comic Sans", cursive',
    },
});
