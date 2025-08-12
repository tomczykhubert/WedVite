import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
 
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })
    const user = session?.user;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // Get the target path from the URL
    const target = req.nextUrl.pathname.replace("/api/uploads", "");
    
    // Construct full path to the image - store outside of public folder
    const privatePath = join(process.cwd(), "private", "uploads", target);

    try {
      // Read the image file
      const imageBuffer = await fs.readFile(privatePath);
      
      // Determine content type based on file extension
      const ext = target.split('.').pop()?.toLowerCase();
      const contentType = ext === 'png' ? 'image/png' : 
                         ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 
                         ext === 'gif' ? 'image/gif' : 
                         'application/octet-stream';

      const headers = new Headers();
      headers.set("Content-Type", contentType);
      
      return new NextResponse(imageBuffer, { 
        status: 200, 
        statusText: "OK", 
        headers 
      });

    } catch (error) {
      return new NextResponse("Image not found", { status: 404 });
    }

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}