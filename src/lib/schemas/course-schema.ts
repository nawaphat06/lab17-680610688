// 1.1
import { z } from "zod";
import type { Course } from "@/lib/types";

// 1.1
export const createCourseFormSchema = (existingCourses: Course[]) =>
  z.object({
    // 1.3
    courseId: z
      .string()
      .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
      .refine(
        (val) =>
          !existingCourses.some(
            (c) => c.courseId.toLowerCase() === val.trim().toLowerCase(),
          ),
        { message: "รหัสวิชานี้มีอยู่แล้ว" },
      ),

    // 1.3
    courseTitle: z
      .string()
      .min(1, "กรอกชื่อวิชา")
      .max(100, "ชื่อวิชาต้องมีความยาวไม่เกิน 100 ตัวอักษร"),

    // 3.1
    program: z.enum(["CPE", "ISNE"], {
  message: "เลือกหลักสูตร",
}),

    // 3.2
    semester: z.enum(["1", "2", "3"], {
  message: "เลือกภาคการศึกษา",
}),

    // 3.3
    description: z
      .string()
      .max(100, "รายละเอียดยาวได้ไม่เกิน 100 ตัวอักษร")
      .optional()
      .or(z.literal("")),

    // 2.1, 2.2, 2.3
    instructors: z
      .array(
        z.object({
          // 2.2
          name: z.string().min(1, "กรอกชื่อผู้สอน"),

          // 2.2
          email: z
            .string()
            .min(1, "อีเมลไม่ถูกต้อง")
            .email("อีเมลไม่ถูกต้อง")
            .refine((email) => email.endsWith("@cmu.ac.th"), {
              message: "ต้องเป็นอีเมล @cmu.ac.th",
            }),
        }),
      )
      .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
      .max(3, "มีผู้สอนได้ไม่เกิน 3 คน")
      // 2.3
      .refine(
        (items) => {
          const emails = items
            .map((i) => i.email.toLowerCase().trim())
            .filter(Boolean);
          return new Set(emails).size === emails.length;
        },
        {
          message: "อีเมลผู้สอนซ้ำกัน",
        },
      ),

    // 3.4
    notifyByEmail: z.boolean().default(false),
  });

// 1.1
export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;
