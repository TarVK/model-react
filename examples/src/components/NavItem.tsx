import {
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import React, {FC, useCallback, useState} from "react";
import {INavItem} from "./_types/INavItem";

export const NavItem: FC<{
    item: INavItem;
    onClick: (item: INavItem) => void;
    depth?: number;
}> = ({item, onClick, depth = 0}) => {
    if ("divider" in item) return <Divider />;

    const [opened, setOpened] = useState(true);
    const onClickCallback = useCallback(() => {
        if (item.children) setOpened(o => !o);
        onClick(item);
    }, [item.children]);
    const theme = useTheme();

    return (
        <>
            <ListItem
                button
                onClick={onClickCallback}
                style={{
                    padding: 0,
                    paddingLeft: theme.spacing(2) + depth * theme.spacing(2),
                    paddingRight: theme.spacing(1),
                }}>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.name} />
                {item.children && (opened ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
            {item.children && (
                <Collapse in={opened} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((item, i) => (
                            <NavItem
                                key={i}
                                item={item}
                                depth={depth + 1}
                                onClick={onClick}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
};
