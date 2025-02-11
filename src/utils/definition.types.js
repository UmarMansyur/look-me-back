const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(4).max(20),
    password: z.string().min(8).max(20)
});

const registerSchema = z.object({
    username: z.string().min(4).max(20),
    password: z.string().min(8).max(20),
    email: z.string().email(),
    phone: z.string().min(10).max(13),
    date_of_birth: z.date(),
    address: z.string(),
    role: z.enum(['Administrator', 'Kepala Pegawai', 'Pegawai'])
});

const updateSchema = z.object({
    username: z.string().min(4).max(20),
    email: z.string().email(),
    phone: z.string().min(10).max(13),
    date_of_birth: z.date(),
    address: z.string()
});

module.exports = {
    loginSchema,
    registerSchema,
    updateSchema
};