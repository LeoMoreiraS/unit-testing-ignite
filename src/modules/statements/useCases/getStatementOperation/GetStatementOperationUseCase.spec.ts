import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import 'reflect-metadata';
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let newUser:User;

describe("Get statement operation Use Case test",()=>{
  beforeAll(async ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    newUser =  await createUserUseCase.execute({
      email: "valid_email@email.com",
      name: "valid_name",
      password: "valid_password"
    });
  });

  it("Should get statement operation", async ()=>{

    const statement = await createStatementUseCase.execute({ user_id: newUser.id ?? '', type: 'deposit' as OperationType , amount: 123, description: '1'});
    const statementOp = await getStatementOperationUseCase.execute({ user_id:newUser.id ?? '', statement_id: statement.id ?? '' });
    expect(statementOp.amount).toBe(123);
  });

  it("Should not get a statement with invalid user", async ()=>{
    try{
        await getStatementOperationUseCase.execute({ user_id: '', statement_id: ''});
        expect(true).toBeFalsy();
    }catch(error){
        expect(error).toBeInstanceOf(AppError);
        expect(error).toEqual({ message: 'User not found', statusCode:  404 });
    }
  });

  it("Should not get a statement with invalid statement", async ()=>{
    try{
        await getStatementOperationUseCase.execute({ user_id: newUser.id ??'', statement_id: ''});
        expect(true).toBeFalsy();
    }catch(error){
        expect(error).toBeInstanceOf(AppError);
        expect(error).toEqual({ message: "Statement not found", statusCode:  404 });
    }
  });

});
