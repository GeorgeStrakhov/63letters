import { redirect } from 'next/navigation';
import { dateToGrid, isValidDateString } from '@/app/utils/dateToSeed';
import { encodeGridCompact } from '@/app/utils/gridEncoding';
import InvalidDateGrid from './InvalidDateGrid';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

export default async function DatePage({ params }: PageProps) {
  const { date: dateStr } = await params;
  
  // Validate date
  if (!isValidDateString(dateStr)) {
    return <InvalidDateGrid />;
  }
  
  // Generate initial grid for this date and redirect to it
  const { grid } = dateToGrid(dateStr);
  const encoded = encodeGridCompact(grid);
  redirect(`/${dateStr}/${encoded}`);
}