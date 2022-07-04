import { AppError } from "../../../../shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import 'reflect-metadata';
import { User } from "../../../users/entities/User";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let newUser:User;

describe("Create Statement Use Case test",()=>{
  beforeAll(async ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    newUser =  await createUserUseCase.execute({
      email: "valid_email@email.com",
      name: "valid_name",
      password: "valid_password"
    });
  });

  it("Should create a statement", async ()=>{

    const statement = await createStatementUseCase.execute({ user_id:newUser.id ?? '', type: 'deposit' as OperationType , amount: 123, description: '1'});

    expect(statement.id).toBeDefined();
    expect(statement.user_id).toBe(newUser.id );
  });

  it("Should not create a statement with invalid values", async ()=>{
    try{
        await createStatementUseCase.execute({ user_id:newUser.id ?? '', type: 'withdraw' as OperationType , amount: 200, description: '1'});
        expect(true).toBeFalsy();
    }catch(error){
        expect(error).toBeInstanceOf(AppError);
        expect(error).toEqual({ message: "Insufficient funds", statusCode:  400 });
    }
  });

  it("Should not create a statement with invalid user", async ()=>{
    try{
        await createStatementUseCase.execute({ user_id: '', type: 'withdraw' as OperationType , amount: 200, description: '1'});
        expect(true).toBeFalsy();
    }catch(error){
        expect(error).toBeInstanceOf(AppError);
        expect(error).toEqual({ message: 'User not found', statusCode:  404 });
    }
  });

});
