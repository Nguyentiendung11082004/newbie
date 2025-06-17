import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Student Manager API',
            version: '1.0.0',
            description: 'Tài liệu API hệ thống quản lý sinh viên',
        },
        servers: [
            {
                //   url: 'https://api-studentmanager.onrender.com',   api khi deploy
                url: 'http://localhost:8080/api/v1/'
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/**/*.ts')],
}
const swaggerSpec = swaggerJsdoc(options); 

export { swaggerUi, swaggerSpec }