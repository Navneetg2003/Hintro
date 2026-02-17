import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/authRoutes';
import boardRoutes from './routes/boardRoutes';
import listRoutes from './routes/listRoutes';
import taskRoutes from './routes/taskRoutes';

// Import middleware
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler';

// Import services
import { socketService } from './services/socketService';

// Initialize Express app
const app: Express = express();
const httpServer = createServer(app);

// Initialize Socket.io
socketService.initialize(httpServer);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Task Collaboration Platform API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/signup': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get current user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'POST /api/auth/change-password': 'Change password',
        'GET /api/auth/users/search': 'Search users',
      },
      boards: {
        'POST /api/boards': 'Create a new board',
        'GET /api/boards': 'Get all boards for current user',
        'GET /api/boards/:id': 'Get a specific board with lists and tasks',
        'PUT /api/boards/:id': 'Update a board',
        'DELETE /api/boards/:id': 'Delete a board',
        'POST /api/boards/:id/members': 'Add member to board',
        'DELETE /api/boards/:id/members/:memberId': 'Remove member from board',
        'GET /api/boards/:id/activities': 'Get board activity history',
      },
      lists: {
        'POST /api/lists': 'Create a new list',
        'PUT /api/lists/:id': 'Update a list',
        'DELETE /api/lists/:id': 'Delete a list',
        'PUT /api/lists/board/:boardId/reorder': 'Reorder lists in a board',
      },
      tasks: {
        'GET /api/tasks/search': 'Search tasks',
        'POST /api/tasks': 'Create a new task',
        'GET /api/tasks/:id': 'Get a specific task',
        'PUT /api/tasks/:id': 'Update a task',
        'DELETE /api/tasks/:id': 'Delete a task',
        'PUT /api/tasks/:id/move': 'Move task to different list/position',
        'POST /api/tasks/:id/assignees': 'Assign user to task',
        'DELETE /api/tasks/:id/assignees/:assigneeId': 'Unassign user from task',
        'POST /api/tasks/:id/comments': 'Add comment to task',
      },
      websocket: {
        'connection': 'Authenticate with token',
        'board:join': 'Join a board room for real-time updates',
        'board:leave': 'Leave a board room',
        'events': [
          'board:update',
          'list:create',
          'list:update',
          'list:delete',
          'list:reorder',
          'task:create',
          'task:update',
          'task:delete',
          'task:move',
          'member:join',
          'member:leave',
          'activity:new',
        ],
      },
    },
  });
});

// Error handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Task Collaboration Platform Backend              ║
║                                                       ║
║   Server running on: http://localhost:${PORT}           ║
║   API Docs: http://localhost:${PORT}/api                ║
║   Health Check: http://localhost:${PORT}/health         ║
║                                                       ║
║   WebSocket: ws://localhost:${PORT}                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export { app, httpServer };
