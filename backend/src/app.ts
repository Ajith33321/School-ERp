import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { tenantHandler } from './middleware/tenantHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import staffAttendanceRoutes from './routes/staffAttendanceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import payrollRoutes from './routes/payrollRoutes.js';
import libraryRoutes from './routes/libraryRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import hostelRoutes from './routes/hostelRoutes.js';
import commRoutes from './routes/commRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import branchRoutes from './routes/branchRoutes.js';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Tenant Handler
app.use(tenantHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendance/staff', staffAttendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/comm', commRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/branches', branchRoutes);

// Base Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to School ERP API' });
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error 💥:', err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        errors: err.errors || []
    });
});

export default app;
