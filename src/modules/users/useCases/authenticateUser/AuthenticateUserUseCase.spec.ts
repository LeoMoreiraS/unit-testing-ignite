import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let inMemoryUsersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case test",()=>{
  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should authenticate a user", async ()=>{

     await createUserUseCase.execute({
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password"
      });

    const auth = await authenticateUserUseCase.execute({ email:"valid_email@email.com", password:"valid_password" });

    expect(auth.token).toBeDefined();
  });

  it("Should not authenticate a invalid user", async ()=>{
    try{

      const auth = await authenticateUserUseCase.execute({ email:"valid_email@email.com", password:"invalid_password" });
      expect(true).toBeFalsy();
    }catch(error){
      expect(error).toBeInstanceOf(AppError);
      expect(error).toEqual({ message: "Incorrect email or password", statusCode:  401 });

    }

    try{
      const auth = await authenticateUserUseCase.execute({ email:"invalid_email@email.com", password:"valid_password" });
      expect(true).toBeFalsy();
    }catch(error){
      expect(error).toBeInstanceOf(AppError);
      expect(error).toEqual({ message: "Incorrect email or password", statusCode:  401 });

    }
  });
});
