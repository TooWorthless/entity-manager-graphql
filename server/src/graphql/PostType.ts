import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./UserType";

@ObjectType()
export class Post {
    @Field(() => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => User)
    author: User;

    constructor(id: string, title: string, content: string, author: User) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
