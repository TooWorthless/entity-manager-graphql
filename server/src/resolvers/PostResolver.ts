import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Post } from "../graphql/PostType";
import { PostModel } from "../models/Post";
import mongoose from "mongoose";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async getPosts() {
        return await PostModel.find().populate("author");
    }

    @Mutation(() => Post)
    async createPost(@Arg("title") title: string, @Arg("content") content: string, @Arg("authorId") authorId: string) {
        const post = new PostModel({ title, content, author: authorId });
        await post.save();
        return post.populate("author");
    }

    @Mutation(() => Boolean)
    async deletePost(@Arg("id") id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }

        const deleted = await PostModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error("Post not found");
        }

        return true;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(@Arg("id") id: string, @Arg("title", { nullable: true }) title?: string, @Arg("content", { nullable: true }) content?: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }

        const updatedPost = await PostModel.findByIdAndUpdate(id, { title, content }, { new: true }).populate("author");
        if (!updatedPost) {
            throw new Error("Post not found");
        }

        return updatedPost;
    }
}
