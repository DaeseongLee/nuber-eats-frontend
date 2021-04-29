import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { Login, LOGIN_MUTATION } from "../../pages/login";
import userEvent from "@testing-library/user-event";
import { render, RenderResult, waitFor } from "../../test-utils";

describe("<Login/>", () => {
    let renderResult: RenderResult;
    let mockedClient: MockApolloClient;
    beforeEach(async () => {
        await waitFor(async () => {
            mockedClient = createMockClient();
            renderResult = render(
                <ApolloProvider client={mockedClient}>
                    <Login />
                </ApolloProvider>
            );
        });

    });

    it("should render OK", async () => {
        await waitFor(() => {
            expect(document.title).toBe("login | Nuber Eats");
        });
    });
    it("display email validation errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        await waitFor(() => {
            userEvent.type(email, "this@wont");
        });
        let errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);
        await waitFor(() => {
            userEvent.clear(email);
        });
        errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Email is required/i);
    });

    it("display password required errors", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const submitBtn = getByRole("button");
        await waitFor(() => {
            userEvent.type(email, "this@wont.com");
            userEvent.click(submitBtn);
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/Password is required/i);
    });

    it("submit form and calls mutation", async () => {
        const { getByPlaceholderText, getByRole } = renderResult;
        const email = getByPlaceholderText(/email/i);
        const password = getByPlaceholderText(/password/i);
        const submitBtn = getByRole("button");
        const formData = {
            email: "real@test.com",
            password: "123",
        };
        const mockedMutationResponse = jest.fn().mockResolvedValue({
            data: {
                login: {
                    ok: true,
                    token: "xxx",
                    error: "mutation-error",
                }
            }
        });
        mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
        jest.spyOn(Storage.prototype, "setItem");
        await waitFor(() => {
            userEvent.type(email, formData.email);
            userEvent.type(password, formData.password);
            userEvent.click(submitBtn);
        });
        expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
        expect(mockedMutationResponse).toHaveBeenCalledWith({
            loginInput: {
                email: formData.email,
                password: formData.password,
            },
        });
        const errorMessage = getByRole("alert");
        expect(errorMessage).toHaveTextContent(/mutation-error/i);
        expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "xxx");
    });
});