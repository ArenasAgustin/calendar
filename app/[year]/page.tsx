import Calendar from "@/components/Calendar";

export default async function Page({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return <Calendar initialYear={Number.parseInt(year)} />;
}
