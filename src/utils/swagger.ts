export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "A simple Express User API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
              example: 1,
            },
            username: {
              type: "string",
              description: "Username",
              example: "user1",
            },
            email: {
              type: "string",
              description: "User email",
              example: "user1@example.com",
            },
            password: {
              type: "string",
              description: "User password",
              example: "password123",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2022-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Update date",
              example: "2022-01-01T00:00:00Z",
            },
            posts: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Post",
              },
            },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Post ID",
              example: 1,
            },
            title: {
              type: "string",
              description: "Post title",
              example: "Post Title",
            },
            slug: {
              type: "string",
              description: "Post slug",
              example: "post-title",
            },
            content: {
              type: "string",
              description: "Post content",
              example: "This is the content of the post.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2022-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Update date",
              example: "2022-01-01T00:00:00Z",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Comment ID",
              example: 1,
            },
            content: {
              type: "string",
              description: "Comment content",
              example: "This is a comment.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
              example: "2022-01-01T00:00:00Z",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            post: {
              $ref: "#/components/schemas/Post",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.ts"], // files containing annotations as above
};
