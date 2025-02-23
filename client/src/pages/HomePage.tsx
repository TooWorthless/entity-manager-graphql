import React from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3" gutterBottom>
                Admin Dashboard
            </Typography>
            <Stack spacing={2} direction="column">
                <Button variant="contained" component={Link} to="/users">Manage Users</Button>
                <Button variant="contained" component={Link} to="/posts">Manage Posts</Button>
                <Button variant="contained" component={Link} to="/comments">Manage Comments</Button>
            </Stack>
        </Container>
    );
};

export default HomePage;
