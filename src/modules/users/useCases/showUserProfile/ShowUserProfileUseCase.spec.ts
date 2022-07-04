import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";


import { AppError } from "../../../../shared/errors/AppError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case test",()=>{
  beforeAll(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should create a user", async ()=>{

     const newUser = await inMemoryUsersRepository.create({
        email: "valid_email@email.com",
        name: "valid_name",
        password: "valid_password"
      });

    const user = await showUserProfileUseCase.execute(newUser.id ?? '');

    expect(user.email).toEqual("valid_email@email.com");
    expect(user.name).toEqual("valid_name");
  });

  it("Should not list a invalid user", async ()=>{
    try{

      const user = await showUserProfileUseCase.execute( '');
      expect(true).toBeFalsy();
    }catch(error){
      expect(error).toBeInstanceOf(AppError);
      expect(error).toEqual({ message: 'User not found', statusCode:  404 });

    }

  });
});
