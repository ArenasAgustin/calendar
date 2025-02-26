"use client";

import Calendar from "@/components/Calendar";

export default function Page({ params }: { params: { year: string } }) {
  return <Calendar initialYear={Number.parseInt(params.year)} />;
}
