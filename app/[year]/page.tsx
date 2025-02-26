import Calendar from "@/components/Calendar";

export default async function Page({ params }: { params: { year: string } }) {
  const { year } = await params;
  return <Calendar initialYear={Number.parseInt(year)} />;
}
