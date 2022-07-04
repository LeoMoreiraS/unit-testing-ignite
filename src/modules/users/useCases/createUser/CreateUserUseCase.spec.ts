import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { compareSync } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case test",()=>{
  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create a user", async ()=>{

    const user = await createUserUseCase.execute({
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password"
      });

    expect(user.email).toEqual("valid_email@email.com");
    expect(user.name).toEqual("valid_name");
    expect(compareSync("valid_password", user.password)).toBeTruthy();

  });
  it("Should not create a duplicate user", async ()=>{
    try{

     await createUserUseCase.execute({
          email: "valid_email@email.com",
          name: "valid_name",
          password: "valid_password"
        });
      expect(true).toBeFalsy();
    }catch(error){
      expect(error).toBeInstanceOf(AppError);
      expect(error).toEqual({ message: 'User already exists', statusCode: 400 });

    }

  });
});
