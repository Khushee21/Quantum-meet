export type SessionUser = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
};

export type SessionData = {
    user: SessionUser;
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        expiresAt: Date;
        token: string;
        ipAddress?: string;
        userAgent?: string;
    };
};
