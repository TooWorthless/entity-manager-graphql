import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
    Typography, Button, TextField, Stack
} from "@mui/material";
import Layout from "../components/Layout";

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

const UsersPage: React.FC = () => {
    const { loading, error, data, refetch } = useQuery(GET_USERS);
    const [createUser] = useMutation(CREATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
    if (error) return <Typography color="error">Ошибка загрузки: {error.message}</Typography>;

    const handleCreateUser = async () => {
        await createUser({ variables: { name, email } });
        setName("");
        setEmail("");
        refetch();
    };

    const handleDeleteUser = async (id: string) => {
        console.log('id :>> ', id);
        await deleteUser({ variables: { id } });
        refetch();
    };

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Users</Typography>

            {/* Форма создания */}
            <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button variant="contained" onClick={handleCreateUser}>Add User</Button>
            </Stack>

            {/* Таблица пользователей */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.getUsers?.length ? (
                            data.getUsers.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Button color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
};

export default UsersPage;
