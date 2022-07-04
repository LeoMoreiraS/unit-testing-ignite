import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../../users/entities/User";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import 'reflect-metadata';


let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;

let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let newUser:User;

describe("Get balance Use Case test",()=>{
  beforeAll(async ()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    newUser =  await createUserUseCase.execute({
      email: "valid_email@email.com",
      name: "valid_name",
      password: "valid_password"
    });
  });

  it("Should get a balance", async ()=>{

    await createStatementUseCase.execute({ user_id: newUser.id ?? '', type: 'deposit' as OperationType , amount: 123, description: '1'});
    const balance = await getBalanceUseCase.execute({ user_id:newUser.id ?? ''});
    expect(balance.balance).toBe(123);

  });

  it("Should not get a balance with invalid user", async ()=>{
    try{
        await getBalanceUseCase.execute({ user_id: ''});
        expect(true).toBeFalsy();
    }catch(error){
        expect(error).toBeInstanceOf(AppError);
        expect(error).toEqual({ message: 'User not found', statusCode:  404 });
    }
  });

});
