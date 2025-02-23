import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
    List, ListItem, ListItemText, CircularProgress, Button, TextField, Stack, MenuItem, Select, FormControl, InputLabel,
    Typography
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

const GET_POSTS_BY_AUTHOR = gql`
  query GetPostsByAuthor($authorId: String!) {
    getPosts {
      id
      title
      author {
        id
      }
    }
  }
`;

const GET_COMMENTS = gql`
  query {
    getComments {
      id
      text
      author {
        name
      }
      post {
        title
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($text: String!, $authorId: String!, $postId: String!) {
    createComment(text: $text, authorId: $authorId, postId: $postId) {
      id
      text
      author {
        name
      }
      post {
        title
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: String!) {
    deleteComment(id: $id)
  }
`;

const CommentsPage: React.FC = () => {
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS_BY_AUTHOR, {
        skip: !selectedAuthor,
        variables: { authorId: selectedAuthor },
    });

    const { loading: commentsLoading, error: commentsError, data: commentsData, refetch } = useQuery(GET_COMMENTS);
    const [createComment] = useMutation(CREATE_COMMENT);
    const [deleteComment] = useMutation(DELETE_COMMENT);

    const [text, setText] = useState("");
    const [selectedPost, setSelectedPost] = useState("");

    const handleCreateComment = async () => {
        if (!selectedAuthor || !selectedPost) {
            alert("Please select an author and a post!");
            return;
        }
        await createComment({ variables: { text, authorId: selectedAuthor, postId: selectedPost } });
        setText("");
        setSelectedAuthor("");
        setSelectedPost("");
        refetch();
    };

    const handleDeleteComment = async (id: string) => {
        await deleteComment({ variables: { id } });
        refetch();
    };

    if (usersLoading || commentsLoading || postsLoading) return <CircularProgress />;
    if (usersError || commentsError || postsError) return <p>Error loading data</p>;

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Comments</Typography>

            {/* Форма создания комментария */}
            <Stack spacing={2} direction="row" sx={{ mb: 3 }}>
                <TextField label="Comment" value={text} onChange={(e) => setText(e.target.value)} />

                {/* Выбор автора */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Author</InputLabel>
                    <Select value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
                        {usersData.getUsers.map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Выбор поста (только посты выбранного автора) */}
                <FormControl sx={{ minWidth: 200 }} disabled={!selectedAuthor}>
                    <InputLabel>Post</InputLabel>
                    <Select value={selectedPost} onChange={(e) => setSelectedPost(e.target.value)}>
                        {postsData?.getPosts
                            .filter((post: any) => post.author.id === selectedAuthor)
                            .map((post: any) => (
                                <MenuItem key={post.id} value={post.id}>
                                    {post.title}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleCreateComment}>Add Comment</Button>
            </Stack>

            <List>
                {commentsData.getComments.map((comment: any) => (
                    <ListItem key={comment.id}>
                        <ListItemText primary={comment.text} secondary={`${comment.author.name} on "${comment.post.title}"`} />
                        <Button color="error" onClick={() => handleDeleteComment(comment.id)}>Delete</Button>
                    </ListItem>
                ))}
            </List>
        </Layout>
    );
};

export default CommentsPage;
