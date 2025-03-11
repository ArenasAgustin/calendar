import { writeFileSync, readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { DayNote } from "@/utils/types";

interface JSONToFileFunction {
  (obj: DayNote[]): void;
}

const JSONToFile: JSONToFileFunction = (obj: DayNote[]): void =>
  writeFileSync("notes.json", JSON.stringify(obj, null, 2));

export const GET = async (): Promise<NextResponse> => {
  try {
    const data = readFileSync("notes.json", "utf8");
    return new NextResponse(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error reading file", { status: 500 });
  }
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: DayNote[] = await req.json();
    if (
      !Array.isArray(body) ||
      !body.every((note) => typeof note === "object")
    ) {
      return new NextResponse("Invalid data format", { status: 400 });
    }
    JSONToFile(body);
    return new NextResponse("Success", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error writing file", { status: 500 });
  }
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const newNote: DayNote = await req.json();
    if (typeof newNote !== "object") {
      return new NextResponse("Invalid data format", { status: 400 });
    }
    const data = readFileSync("notes.json", "utf8");
    const notes: DayNote[] = JSON.parse(data);
    notes.push(newNote);
    JSONToFile(notes);
    return new NextResponse("Success", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Error updating file", { status: 500 });
  }
};
