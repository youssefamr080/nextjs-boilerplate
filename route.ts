import { NextRequest, NextResponse } from "next/server";

// ✅ تعريف نوع البيانات المرسلة
interface RequestBody {
  message: string;
}

// ✅ تعريف نوع استجابة API Gemini
interface GeminiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
  error?: { message: string };
}

export async function POST(req: NextRequest) {
  try {
    // ✅ التحقق من مفتاح API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ مفتاح API غير موجود!");
      return NextResponse.json(
        { error: "خطأ في تكوين الخادم: مفتاح API غير موجود" },
        { status: 500 }
      );
    }

    // ✅ التحقق من نوع الطلب
    const contentType = req.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "⚠️ نوع المحتوى غير مدعوم" },
        { status: 415 }
      );
    }

    // ✅ استخراج البيانات
    const { message } = (await req.json()) as RequestBody;
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "⚠️ يجب إرسال رسالة نصية صحيحة" },
        { status: 400 }
      );
    }

    // ✅ إنشاء الطلب إلى Gemini API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // مهلة 10 ثوانٍ

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    // ✅ التحقق من استجابة API
    if (!response.ok) {
      const errorData = (await response.json()) as GeminiResponse;
      console.error("❌ خطأ من API:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "⚠️ حدث خطأ أثناء الاتصال بـ API" },
        { status: response.status }
      );
    }

    const data = (await response.json()) as GeminiResponse;

    // ✅ التحقق من وجود إجابة صحيحة
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
      return NextResponse.json(
        { error: "⚠️ لم يتم العثور على إجابة" },
        { status: 404 }
      );
    }

    // ✅ إرجاع الاستجابة المنظمة
    return NextResponse.json({
      reply: data.candidates[0].content.parts[0].text,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ خطأ في الخادم:", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "⏳ انتهت مهلة الطلب" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "❌ حدث خطأ داخلي أثناء معالجة الطلب" },
      { status: 500 }
    );
  }
}
