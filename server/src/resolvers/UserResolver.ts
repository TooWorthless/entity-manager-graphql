import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../graphql/UserType";
import { UserModel } from "../models/User";

// @Resolver()
// export class UserResolver {
//     @Query(() => [User])
//     async getUsers() {
//         return await UserModel.find();
//     }

//     @Mutation(() => User)
//     async createUser(@Arg("name") name: string, @Arg("email") email: string) {
//         const user = new UserModel({ name, email });
//         await user.save();
//         return user;
//     }
// }


@Resolver()
export class UserResolver {
    @Query(() => [User])
    async getUsers() {
        return await UserModel.find();
    }

    @Mutation(() => User)
    async createUser(@Arg("name") name: string, @Arg("email") email: string) {
        const user = new UserModel({ name, email });
        await user.save();
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id") id: string) {
        console.log('id :>> ', id);
        const deleted = await UserModel.findByIdAndDelete(id);
        return !!deleted;
    }

    @Mutation(() => User, { nullable: true })
    async updateUser(@Arg("id") id: string, @Arg("name", { nullable: true }) name?: string, @Arg("email", { nullable: true }) email?: string) {
        const updatedUser = await UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
        return updatedUser;
    }
}
