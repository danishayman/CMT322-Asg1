import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch all reviews with related complaint and student info
        const { data: reviews, error } = await supabase
            .from("feedback")
            .select(`
        id,
        overall_rating,
        comment,
        repair_quality,
        response_speed,
        sentiment,
        created_at,
        complaints!inner (
          id,
          complaint_id,
          title,
          category
        ),
        users!feedback_student_id_fkey (
          id,
          full_name,
          email
        )
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching reviews:", error);
            return NextResponse.json(
                { error: "Failed to fetch reviews" },
                { status: 500 }
            );
        }

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Error in reviews API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
