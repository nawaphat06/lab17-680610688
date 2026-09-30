// 5.1
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  // 5.1
  const getSemesterLabel = (sem?: string) => {
    if (sem === "1") return "ภาคการศึกษาที่ 1";
    if (sem === "2") return "ภาคการศึกษาที่ 2";
    if (sem === "3") return "ภาคฤดูร้อน";
    return "-";
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {/* 5.1 */}
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              {/* 5.1 */}
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              {/* 5.1 */}
              <TableCell className="font-medium">{course.courseId}</TableCell>
              {/* 5.1 */}
              <TableCell>{course.courseTitle}</TableCell>
              {/* 5.1 */}
              <TableCell>
                {course.program ? (
                  <Badge variant="outline">{course.program}</Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              {/* 5.1 */}
              <TableCell>{getSemesterLabel(course.semester)}</TableCell>
              {/* 5.1 */}
              <TableCell className="max-w-[200px] text-xs text-muted-foreground whitespace-pre-wrap">
                {course.description || "-"}
              </TableCell>
              {/* 5.1 */}
              <TableCell>
                <div className="space-y-1">
                  {course.instructors && course.instructors.length > 0 ? (
                    course.instructors.map((inst, i) => (
                      <div key={i} className="text-xs">
                        <p className="font-medium text-foreground">
                          {inst.name}
                        </p>
                        <p className="text-muted-foreground">{inst.email}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      ยังไม่มีผู้สอน
                    </span>
                  )}
                </div>
              </TableCell>
              {/* 5.1 */}
              <TableCell>
                <Badge variant={course.notifyByEmail ? "default" : "secondary"}>
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
