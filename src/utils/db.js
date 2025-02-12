/** @type {import('@prisma/client').PrismaClient} */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma