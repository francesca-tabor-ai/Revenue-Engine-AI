import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user (password: Admin123!)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@revenueengine.ai' },
    update: {},
    create: {
      email: 'admin@revenueengine.ai',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', adminUser.email)

  // Create demo user
  const userPasswordHash = await bcrypt.hash('User123!', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@revenueengine.ai' },
    update: {},
    create: {
      email: 'demo@revenueengine.ai',
      passwordHash: userPasswordHash,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
    },
  })
  console.log('Created demo user:', demoUser.email)

  // Create organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: 'TEAM',
    },
  })
  console.log('Created organization:', org.name)

  // Link demo user to org
  await prisma.user.update({
    where: { id: demoUser.id },
    data: { organizationId: org.id },
  })

  // Pipeline stages
  const stages = await Promise.all([
    prisma.pipelineStage.create({ data: { organizationId: org.id, name: 'Qualification', order: 1, conversionRate: 25 } }),
    prisma.pipelineStage.create({ data: { organizationId: org.id, name: 'Discovery', order: 2, conversionRate: 40 } }),
    prisma.pipelineStage.create({ data: { organizationId: org.id, name: 'Proposal', order: 3, conversionRate: 60 } }),
    prisma.pipelineStage.create({ data: { organizationId: org.id, name: 'Negotiation', order: 4, conversionRate: 80 } }),
    prisma.pipelineStage.create({ data: { organizationId: org.id, name: 'Closed Won', order: 5, conversionRate: 100 } }),
  ])
  console.log('Created pipeline stages:', stages.length)

  // Accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        organizationId: org.id,
        name: 'TechCorp Inc',
        domain: 'techcorp.com',
        industry: 'Technology',
        revenue: 5000000,
      },
    }),
    prisma.account.create({
      data: {
        organizationId: org.id,
        name: 'Global Solutions',
        domain: 'globalsolutions.io',
        industry: 'Consulting',
        revenue: 2500000,
      },
    }),
    prisma.account.create({
      data: {
        organizationId: org.id,
        name: 'StartupXYZ',
        domain: 'startupxyz.com',
        industry: 'SaaS',
        revenue: 500000,
      },
    }),
  ])
  console.log('Created accounts:', accounts.length)

  // Contacts
  const contacts = await Promise.all([
    prisma.contact.create({
      data: {
        organizationId: org.id,
        accountId: accounts[0].id,
        email: 'john@techcorp.com',
        firstName: 'John',
        lastName: 'Smith',
        title: 'VP of Sales',
        phone: '+1-555-0100',
      },
    }),
    prisma.contact.create({
      data: {
        organizationId: org.id,
        accountId: accounts[0].id,
        email: 'jane@techcorp.com',
        firstName: 'Jane',
        lastName: 'Doe',
        title: 'Director of Ops',
        phone: '+1-555-0101',
      },
    }),
    prisma.contact.create({
      data: {
        organizationId: org.id,
        accountId: accounts[1].id,
        email: 'alex@globalsolutions.io',
        firstName: 'Alex',
        lastName: 'Johnson',
        title: 'CTO',
      },
    }),
  ])
  console.log('Created contacts:', contacts.length)

  // Leads
  await prisma.lead.createMany({
    data: [
      { organizationId: org.id, accountId: accounts[2].id, email: 'lead1@startupxyz.com', firstName: 'Sarah', lastName: 'Connor', source: 'Web', score: 85, status: 'QUALIFIED' },
      { organizationId: org.id, email: 'lead2@newco.com', firstName: 'Mike', lastName: 'Brown', source: 'Referral', score: 72, status: 'NEW' },
      { organizationId: org.id, accountId: accounts[0].id, contactId: contacts[0].id, email: 'john@techcorp.com', firstName: 'John', lastName: 'Smith', source: 'Inbound', score: 90, status: 'CONVERTED' },
    ],
  })
  console.log('Created leads')

  // Deals
  const deals = await Promise.all([
    prisma.deal.create({ data: { organizationId: org.id, accountId: accounts[0].id, contactId: contacts[0].id, stageId: stages[3].id, name: 'TechCorp Enterprise License', value: 120000, status: 'OPEN', probability: 75, riskScore: 15 } }),
    prisma.deal.create({ data: { organizationId: org.id, accountId: accounts[1].id, contactId: contacts[2].id, stageId: stages[2].id, name: 'Global Solutions Integration', value: 85000, status: 'OPEN', probability: 50, riskScore: 30 } }),
    prisma.deal.create({ data: { organizationId: org.id, accountId: accounts[2].id, stageId: stages[0].id, name: 'StartupXYZ Pilot', value: 25000, status: 'OPEN', probability: 20, riskScore: 45 } }),
    prisma.deal.create({ data: { organizationId: org.id, accountId: accounts[0].id, stageId: stages[4].id, name: 'TechCorp Renewal', value: 95000, status: 'WON', probability: 100 } }),
  ])
  const leadsCreated = await prisma.lead.findMany({ take: 3 })
  console.log('Created deals')


  // CRM Connections
  await prisma.crmConnection.createMany({
    data: [
      { organizationId: org.id, provider: 'salesforce', status: 'connected', lastSyncAt: new Date() },
      { organizationId: org.id, provider: 'hubspot', status: 'pending' },
    ],
  })
  console.log('Created CRM connections')

  // Integrations
  await prisma.integration.createMany({
    data: [
      { organizationId: org.id, name: 'Salesforce CRM', type: 'sales', status: 'active', config: {} },
      { organizationId: org.id, name: 'Outreach', type: 'sales', status: 'active', config: {} },
      { organizationId: org.id, name: 'HubSpot Marketing', type: 'marketing', status: 'inactive', config: {} },
    ],
  })
  console.log('Created integrations')

  // Playbooks
  await prisma.playbook.createMany({
    data: [
      { organizationId: org.id, name: 'Enterprise Discovery', description: 'Discovery calls for enterprise deals', type: 'sales', isActive: true, steps: [] },
      { organizationId: org.id, name: 'SMB Onboarding', description: 'Quick start for SMB customers', type: 'onboarding', isActive: true, steps: [] },
    ],
  })
  console.log('Created playbooks')

  // Forecasts
  await prisma.forecast.createMany({
    data: [
      { organizationId: org.id, period: '2024-Q1', type: 'pipeline', value: 450000, confidence: 85 },
      { organizationId: org.id, period: '2024-Q1', type: 'revenue', value: 325000, confidence: 78 },
      { organizationId: org.id, period: '2024-Q2', type: 'pipeline', value: 520000, confidence: 72 },
    ],
  })
  console.log('Created forecasts')

  // Settings
  await prisma.setting.createMany({
    data: [
      { organizationId: org.id, key: 'lead_score_threshold', value: 70 },
      { organizationId: org.id, key: 'deal_alert_risk', value: 40 },
      { organizationId: org.id, key: 'forecast_frequency', value: 'weekly' },
    ],
  })
  console.log('Created settings')

  // Activities
  if (deals[0] && leadsCreated[0]) {
    await prisma.activity.createMany({
      data: [
        { type: 'email', subject: 'Initial outreach', description: 'Sent intro email', relatedType: 'deal', relatedId: deals[0].id, occurredAt: new Date() },
        { type: 'call', subject: 'Discovery call', description: '60 min discovery', relatedType: 'deal', relatedId: deals[0].id, occurredAt: new Date() },
        { type: 'meeting', subject: 'Demo session', description: 'Product demo', relatedType: 'lead', relatedId: leadsCreated[0].id, occurredAt: new Date() },
      ],
    })
  }
  console.log('Created activities')

  console.log('\n✅ Database seeded successfully!')
  console.log('Admin: admin@revenueengine.ai / Admin123!')
  console.log('Demo user: demo@revenueengine.ai / User123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
