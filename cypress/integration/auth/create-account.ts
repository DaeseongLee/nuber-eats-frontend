describe("Create Account", () => {
    const user = cy;
    it("should see email / password validation errors", () => {
        user.visit("/");
        user.findByText(/create an account/i).click();
        user.findByPlaceholderText(/email/i).type("non@good");
        user.findByRole("alert").should("have.text", "Please enter a valid email");
        user.findByPlaceholderText(/email/i).clear();
        user.findByRole("alert").should("have.text", "Email is required");
        user.findByPlaceholderText(/email/i).type("real@mail.com");
        user.findByPlaceholderText(/password/i).type("a").clear();
        user.findByRole("alert").should("have.text", "Password is required");
    });
    it("should be able to create account and login", () => {
        user.intercept("http://localhost:4000/graphql", (req) => {
            const { operationName } = req.body;
            if (operationName && operationName === "createAccountMutation") {
                req.reply((res) => {
                    res.send({
                        data: {
                            createAccount: {
                                ok: true,
                                error: null,
                                __typename: "CreateAccountOutput",
                            }
                        }
                    });
                });
            };
        });
        user.visit("/create-account");
        user.findByPlaceholderText(/email/i).type("hsl5539@gmail.com");
        user.findByPlaceholderText(/password/i).type("1234");
        user.findByRole("button").click();
        user.wait(1000);
        user.title().should("eq", "login | Nuber Eats");
        user.findByPlaceholderText(/email/i).type("hsl5539@gmail.com");
        user.findByPlaceholderText(/password/i).type("1234");
        user.findByRole("button").click();
        user.window().its("localStorage.nuber-token").should("be.a", "string");
    });
})