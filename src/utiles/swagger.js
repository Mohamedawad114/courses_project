import swaggerJsdoc from "swagger-jsdoc"; 
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Courses API Docs",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", 
        },
      },
      schemas: {
        Course: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            period: { 
              type: "string",
              example: "6M, 1Y, 20D"
            },
            type: { 
              type: "string", 
              enum: ["online", "offline", "twice"] 
            },
            price: { type: "number" },
            categoryId: { type: "number", minimum: 1 },
            roadmap: { type: "string" },
          },
          required: ["name", "period", "type", "price", "categoryId", "roadmap"],
        },
        CourseUpdate: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            period: { 
              type: "string",
              example: "6M, 1Y, 20D"
            },
            type: { 
              type: "string", 
              enum: ["online", "offline", "twice"] 
            },
            price: { type: "number" },
            categoryId: { type: "number", minimum: 1 },
            roadmap: { type: "string" },
          },
        },
        DeletePhotoCourse: {
          type: "object",
          properties: {
            id: { type: "number", minimum: 1 },
          },
          required: ["id"],
        },
        Booking: {
          type: "object",
          required: ["courseId", "instructorId", "course_type"],
          properties: {
            courseId: { type: "integer", example: 1 },
            instructorId: { type: "integer", example: 5 },
            course_type: { type: "string", enum: ["online", "offline"], example: "online" },
          },
        },
        BookingReply: {
          type: "object",
          required: ["reply"],
          properties: {
            reply: { type: "string", enum: ["confirm", "cancel"], example: "confirm" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      }
    ],
  },
  apis: ["./**/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
