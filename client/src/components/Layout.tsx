import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Panel
                    </Typography>
                    <Button color="inherit" component={Link} to="/users">Users</Button>
                    <Button color="inherit" component={Link} to="/posts">Posts</Button>
                    <Button color="inherit" component={Link} to="/comments">Comments</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>{children}</Container>
        </>
    );
};

export default Layout;
