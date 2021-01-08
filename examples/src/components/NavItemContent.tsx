import {makeStyles, Typography} from "@material-ui/core";
import React, {FC, useCallback} from "react";
import {INavItem} from "./_types/INavItem";

const useStyles = makeStyles({
    anchor: {
        marginTop: -60,
        paddingTop: 60,
    },
});

export const NavItemContent: FC<{
    item: INavItem;
    depth?: number;
    onHeaderClick?: (item: INavItem) => void;
}> = ({item, depth = 0, onHeaderClick: onClick}) => {
    if ("divider" in item) return <></>;

    const styles = useStyles();
    return (
        <>
            <Typography
                onClick={useCallback(() => onClick?.(item), [])}
                id={item.name.replace(/\s/g, "_")}
                className={styles.anchor}
                variant={("h" + (depth + 2)) as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"}
                component="span"
                display="block">
                {item.name}
            </Typography>
            {item.content}
            {item.children?.map((item, i) => (
                <NavItemContent
                    key={i}
                    item={item}
                    depth={depth + 1}
                    onHeaderClick={onClick}
                />
            ))}
        </>
    );
};
