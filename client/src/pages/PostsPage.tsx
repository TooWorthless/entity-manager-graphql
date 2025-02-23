import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
    Card, CardContent, Typography, CircularProgress, Button, TextField, Stack, Dialog, DialogActions,
    DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, IconButton
} from "@mui/material";
import Layout from "../components/Layout";

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
    }
  }
`;

const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      content
      author {
        id
        name
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: String!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      author {
        name
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id)
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: String!, $title: String, $content: String) {
    updatePost(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const PostsPage: React.FC = () => {
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
    const { loading: postsLoading, error: postsError, data: postsData, refetch } = useQuery(GET_POSTS);
    const [createPost] = useMutation(CREATE_POST);
    const [deletePost] = useMutation(DELETE_POST);
    const [updatePost] = useMutation(UPDATE_POST);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [editPost, setEditPost] = useState<any>(null);

    const handleCreatePost = async () => {
        if (!authorId) {
            alert("Please select an author!");
            return;
        }
        await createPost({ variables: { title, content, authorId } });
        setTitle("");
        setContent("");
        setAuthorId("");
        refetch();
    };

    const handleDeletePost = async (id: string) => {
        await deletePost({ variables: { id } });
        refetch();
    };

    const handleEditPost = async () => {
        if (editPost) {
            await updatePost({ variables: { id: editPost.id, title: editPost.title, content: editPost.content } });
            setEditPost(null);
            refetch();
        }
    };

    if (usersLoading || postsLoading) return <CircularProgress />;
    if (usersError || postsError) return <p>Error loading data</p>;

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Posts</Typography>

            {/* Форма создания поста */}
            <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField label="Content" value={content} onChange={(e) => setContent(e.target.value)} />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Author</InputLabel>
                    <Select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                        {usersData.getUsers.map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleCreatePost}>Add Post</Button>
            </Stack>

            {/* Список постов */}
            {postsData.getPosts.map((post: any) => (
                <Card key={post.id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h5">{post.title}</Typography>
                        <Typography color="textSecondary">{post.author.name}</Typography>
                        <Typography>{post.content}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            <Button color="error" onClick={() => handleDeletePost(post.id)}>
                                Delete
                            </Button>
                            <Button onClick={() => setEditPost(post)}>
                                Edit
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            ))}

            {/* Модальное окно редактирования */}
            {editPost && (
                <Dialog open={Boolean(editPost)} onClose={() => setEditPost(null)}>
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Title"
                            fullWidth
                            value={editPost.title}
                            onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Content"
                            fullWidth
                            multiline
                            minRows={3}
                            value={editPost.content}
                            onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditPost(null)}>Cancel</Button>
                        <Button variant="contained" onClick={handleEditPost}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Layout>
    );
};

export default PostsPage;
