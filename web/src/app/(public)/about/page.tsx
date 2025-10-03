import { prisma } from '@/lib/prisma';
import AboutClient from './AboutClient';

export const revalidate = 60;

export default async function AboutPageServer() {
  const aboutPage = await prisma.page.findUnique({ 
    where: { slug: 'about' },
    select: { content: true }
  });
  
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  });

  const siteContent = await prisma.siteContent.findUnique({
    where: { slug: 'main' }
  });

  return (
    <AboutClient 
      aboutContent={aboutPage}
      teamMembers={teamMembers}
      siteContent={siteContent}
    />
  );
}