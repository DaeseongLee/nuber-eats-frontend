module.exports = {
    client: {
        inCludes: ["./src/**/*.{tsx,ts}"],
        tagName: 'gql',
        service: {
            name: "nuber-eats-backend",
            url: "http://localhost:4000/graphql",
        },
    },
}