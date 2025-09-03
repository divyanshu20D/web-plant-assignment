import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Task from "@/lib/models/Task";
import { requireAuth } from "@/lib/middleware";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authUser = requireAuth(request);
    const { searchParams } = new URL(request.url);

    const { id } = await context.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: id,
      userId: authUser.userId,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Build query
    const query: any = { projectId: id };

    const status = searchParams.get("status");
    if (status && ["todo", "in-progress", "done"].includes(status)) {
      query.status = status;
    }

    // Build sort
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "desc" ? -1 : 1;
    const sort: any = {};
    sort[sortBy] = order;

    const tasks = await Task.find(query).sort(sort);

    return NextResponse.json({ tasks });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const authUser = requireAuth(request);
    const { title, description, status, dueDate } = await request.json();

    const { id } = await context.params;
    console.log("id", id);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid project id this one" },
        { status: 400 }
      );
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: id,
      userId: authUser.userId,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId: id,
    });

    return NextResponse.json({ task });
  } catch (error) {
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
