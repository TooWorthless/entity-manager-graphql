import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Comment } from "../graphql/CommentType";
import { CommentModel } from "../models/Comment";
import mongoose from "mongoose";

@Resolver()
export class CommentResolver {
    @Query(() => [Comment])
    async getComments() {
        return await CommentModel.find().populate("author").populate("post");
    }

    @Mutation(() => Comment)
    async createComment(@Arg("text") text: string, @Arg("authorId") authorId: string, @Arg("postId") postId: string) {
        const comment = new CommentModel({ text, author: authorId, post: postId });
        await comment.save();
        return (await comment.populate("author")).populate("post");
    }

    @Mutation(() => Boolean)
    async deleteComment(@Arg("id") id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }

        const deleted = await CommentModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new Error("Comment not found");
        }

        return true;
    }

    @Mutation(() => Comment, { nullable: true })
    async updateComment(@Arg("id") id: string, @Arg("text", { nullable: true }) text?: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId: ${id}`);
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(id, { text }, { new: true }).populate("author").populate("post");
        if (!updatedComment) {
            throw new Error("Comment not found");
        }

        return updatedComment;
    }
}
