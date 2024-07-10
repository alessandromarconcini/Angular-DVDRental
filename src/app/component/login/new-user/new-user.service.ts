import {Apollo, gql, QueryRef} from "apollo-angular";
import { Injectable } from '@angular/core';

export interface DoubleUser {
  result:boolean
}

@Injectable()
export class NewUserService {

  // MUTAZIONI

  // Mutation per la registrazione di un nuovo utente
  signUpMutation = gql`
    mutation SignUp($username: String!, $password: String!) {
      signUp(username:$username, password: $password) {
        username,
        password
      }
    }
  `;

  // QUERY
  private double_user_query: QueryRef<{double_user: DoubleUser}, {username:string}>;

  constructor(private apollo: Apollo) {

    this.double_user_query = this.apollo.watchQuery({
      query: gql`query double_user ($username: String!){
        double_user (username:$username){
          result
        }
      }`
    });
  }

  // METODI

  async signUp(username: string, password: string): Promise<void> {

    try {
      await this.apollo.mutate({
        mutation: this.signUpMutation,
        variables: {
          username: username,
          password: password
        }
      }).subscribe()
      console.log('Registration successful.');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  async isDoubleUser(username:string): Promise<DoubleUser> {

    const res = await this.double_user_query.refetch({username});
    const value =  res.data.double_user
    return value
  }

}
