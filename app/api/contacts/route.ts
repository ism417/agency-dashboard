import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

const DAILY_CONTACT_LIMIT = 50
const CONTACTS_PER_PAGE = 10

export async function GET(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Get page parameter from URL
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = CONTACTS_PER_PAGE
  const skip = (page - 1) * limit
  
  // Get total count for pagination
  const totalContacts = await prisma.contact.count()
  const totalPages = Math.ceil(totalContacts / limit)
  
  // Get today's date at midnight (UTC)
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  
  // Get the most recent usage record for this user
  const previousUsage = await prisma.dailyUsage.findFirst({
    where: { userId },
    orderBy: { date: 'desc' }
  })
  
  // Get or create daily usage record
  let dailyUsage = await prisma.dailyUsage.findUnique({
    where: {
      userId_date: {
        userId,
        date: today
      }
    }
  })
  
  // Determine all-time viewed pages
  let allTimeViewedPages: number[] = []
  if (previousUsage?.allTimeViewedPages) {
    allTimeViewedPages = previousUsage.allTimeViewedPages.split(',').filter(p => p).map(Number)
  }
  
  // Check if all pages have been viewed - if so, reset everything
  if (allTimeViewedPages.length >= totalPages && allTimeViewedPages.length > 0) {
    allTimeViewedPages = []
  }
  
  if (!dailyUsage) {
    dailyUsage = await prisma.dailyUsage.create({
      data: {
        userId,
        date: today,
        contactViews: 0,
        viewedPages: '',
        allTimeViewedPages: allTimeViewedPages.join(',')
      }
    })
  }
  
  // Parse viewed pages for this hour
  const viewedPagesThisHour = dailyUsage.viewedPages
    ? dailyUsage.viewedPages.split(',').filter(p => p).map(Number)
    : []
  
  // Get all-time viewed pages from current record
  const currentAllTimeViewed = dailyUsage.allTimeViewedPages
    ? dailyUsage.allTimeViewedPages.split(',').filter(p => p).map(Number)
    : []
  
  // Check if this page was already viewed ever (not just this hour)
  const isNewPageEver = !currentAllTimeViewed.includes(page)
  const isNewPageThisHour = !viewedPagesThisHour.includes(page)
  
  // Only count against limit if it's a NEW page ever (not in allTimeViewedPages)
  if (isNewPageEver && isNewPageThisHour) {
    // Check if limit has been reached today
    if (dailyUsage.contactViews >= DAILY_CONTACT_LIMIT) {
      return NextResponse.json({ 
        error: 'Daily limit reached',
        limitReached: true,
        contactViews: dailyUsage.contactViews,
        limit: DAILY_CONTACT_LIMIT,
        viewedPages: viewedPagesThisHour,
        allTimeViewedPages: currentAllTimeViewed,
        contacts: [],
        totalContacts: 0,
        currentPage: page,
        totalPages: totalPages
      }, { status: 429 })
    }
    
    // Check if viewing this page would exceed the limit
    const newContactViews = dailyUsage.contactViews + limit
    
    if (newContactViews > DAILY_CONTACT_LIMIT) {
      return NextResponse.json({ 
        error: 'Viewing this page would exceed your daily limit',
        limitReached: true,
        contactViews: dailyUsage.contactViews,
        limit: DAILY_CONTACT_LIMIT,
        viewedPages: viewedPagesThisHour,
        allTimeViewedPages: currentAllTimeViewed,
        contacts: [],
        totalContacts: 0,
        currentPage: page,
        totalPages: totalPages
      }, { status: 429 })
    }
  }
  
  const contacts = await prisma.contact.findMany({ 
    take: limit,
    skip: skip,
  })
  
  // Update usage only if this is a NEW page ever (not previously viewed)
  if (isNewPageEver) {
    const newContactViews = dailyUsage.contactViews + limit
    
    // Add to allTimeViewedPages and viewedPages this hour
    const updatedAllTimeViewed = [...currentAllTimeViewed, page].sort((a, b) => a - b)
    const updatedViewedPagesThisHour = [...viewedPagesThisHour, page].sort((a, b) => a - b)
    
    await prisma.dailyUsage.update({
      where: { id: dailyUsage.id },
      data: {
        contactViews: newContactViews,
        viewedPages: updatedViewedPagesThisHour.join(','),
        allTimeViewedPages: updatedAllTimeViewed.join(','),
        limitReachedAt: newContactViews >= DAILY_CONTACT_LIMIT ? new Date() : null
      }
    })
  }
  
  // Calculate updated pages for response
  let responseViewedPages = viewedPagesThisHour
  let responseAllTimeViewed = currentAllTimeViewed
  
  if (isNewPageEver) {
    // New page ever - add to both lists
    responseAllTimeViewed = [...currentAllTimeViewed, page].sort((a, b) => a - b)
    responseViewedPages = [...viewedPagesThisHour, page].sort((a, b) => a - b)
  }
  
  return NextResponse.json({ 
    contacts, 
    totalContacts,
    currentPage: page,
    totalPages: totalPages,
    contactViews: isNewPageEver ? dailyUsage.contactViews + limit : dailyUsage.contactViews,
    limit: DAILY_CONTACT_LIMIT,
    viewedPages: responseViewedPages,
    allTimeViewedPages: responseAllTimeViewed
  })
}