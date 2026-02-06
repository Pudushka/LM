import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production, fetch from Supabase
  const brand = {
    id: user.id,
    name: "GeoNexo",
    domain: "geonexo.com",
    keywords: ["AI search optimization", "AI SEO", "AI visibility"],
    created_at: new Date().toISOString(),
  };

  return NextResponse.json(brand);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, domain, keywords } = body;

  if (!name || !domain) {
    return NextResponse.json(
      { error: "Name and domain are required" },
      { status: 400 }
    );
  }

  // In production, update in Supabase
  // await supabase.from('brands').update({ name, domain, keywords }).eq('user_id', user.id);

  return NextResponse.json({
    success: true,
    brand: { name, domain, keywords },
  });
}
