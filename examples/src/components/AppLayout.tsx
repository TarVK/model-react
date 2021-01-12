import React, {FC, useCallback, useEffect} from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {makeStyles, useTheme, Theme, createStyles} from "@material-ui/core/styles";
import {INavItem} from "./_types/INavItem";
import {NavItem} from "./NavItem";
import {NavItemContent} from "./NavItemContent";
import GitHubIcon from "@material-ui/icons/GitHub";
import {Box, Container, Tooltip} from "@material-ui/core";

// src: https://material-ui.com/components/drawers/#responsive-drawer
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
        },
        drawer: {
            [theme.breakpoints.up("sm")]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        appBar: {
            marginLeft: drawerWidth,
            [theme.breakpoints.up("sm")]: {
                width: `calc(100% - ${drawerWidth}px)`,
            },
        },
        appBarInner: {
            display: "flex",
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up("sm")]: {
                display: "none",
            },
        },
        toolbar: theme.mixins.toolbar,
        version: {
            ...theme.mixins.toolbar,
            display: "flex",
            alignItems: "center",
            padding: theme.spacing(2),
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(1),
            [theme.breakpoints.up("sm")]: {
                padding: theme.spacing(3),
            },
            ...theme.typography.body1,
        },
    })
);

export const AppLayout: FC<{items: INavItem[]}> = ({items}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = useCallback(
        () => setMobileOpen(mobileOpen => !mobileOpen),
        []
    );

    const onNav = useCallback(item => {
        window.location.hash = item.name.replace(/\s/g, "_");
    }, []);

    const drawer = (
        <div>
            <Box className={classes.version}>Version 4.0.1</Box>
            <Divider />
            <List>
                {items.map((item, i) => (
                    <NavItem key={i} item={item} onClick={onNav} />
                ))}
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.appBarInner}>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Model React
                    </Typography>
                    <Box flex={1} />
                    <Tooltip title="View on github" placement="bottom">
                        <IconButton
                            component="a"
                            color="inherit"
                            href="https://github.com/TarVK/model-react"
                            aria-label="view on github">
                            <GitHubIcon fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="Mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        variant="temporary"
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open>
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Container maxWidth="md" style={{padding: 0}}>
                    {items.map((item, i) => (
                        <NavItemContent key={i} item={item} onHeaderClick={onNav} />
                    ))}
                </Container>
                <Box height="100vh" />
            </main>
        </div>
    );
};
