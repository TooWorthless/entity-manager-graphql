import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./UserType";
import { Post } from "./PostType";

@ObjectType()
export class Comment {
    @Field(() => ID)
    id: string;

    @Field()
    text: string;

    @Field(() => User)
    author: User;

    @Field(() => Post)
    post: Post;

    constructor(id: string, text: string, author: User, post: Post) {
        this.id = id;
        this.text = text;
        this.author = author;
        this.post = post;
    }
}
