import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constant';


const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVar = makeVar(false);
export const authTokenVar = makeVar(token);

console.log("default value of isLoggedInVar is:", isLoggedInVar());
console.log("default value of authTokenVar is:", authTokenVar());

export const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    isLoggedIn: {
                        read() {
                            return isLoggedInVar();
                        }
                    },
                    authTokenVar: {
                        read() {
                            return authTokenVar();
                        }
                    }
                }
            }
        }
    })
});