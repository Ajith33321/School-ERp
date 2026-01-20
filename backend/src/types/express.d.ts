import { Organization } from '../middleware/tenantHandler.js';

declare global {
    namespace Express {
        interface Request {
            orgId?: string;
            user?: {
                id: string;
                role: string;
                orgId: string;
            };
        }
    }
}

