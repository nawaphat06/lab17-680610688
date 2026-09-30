import { useState } from "react";
// 1.2, 2.1, 3.3
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
// 1.2
import { zodResolver } from "@hookform/resolvers/zod";
// 2.1, 4.1
import { PlusCircle, X, RotateCcw } from "lucide-react";
import { useEnrollmentStore } from "@/lib/enrollment-store";
// 1.1, 1.2
import {
  createCourseFormSchema,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// 2.1, 4.1
const defaultValues: CourseFormValues = {
  courseId: "",
  courseTitle: "",
  program: undefined as any,
  semester: undefined as any,
  description: "",
  instructors: [{ name: "", email: "" }],
  notifyByEmail: false,
};

export function AddNewCourseDialog() {
  const [open, setOpen] = useState(false);
  const courses = useEnrollmentStore((s) => s.courses);
  const addCourse = useEnrollmentStore((s) => s.addCourse);

  // 1.2
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(createCourseFormSchema(courses)),
    mode: "onBlur",
    defaultValues,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  // 2.1
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructors",
  });

  // 3.3
  const descriptionValue = useWatch({ control, name: "description" }) || "";

  // 4.2
  const onSubmit = (data: CourseFormValues) => {
    addCourse({
      courseId: data.courseId.trim(),
      courseTitle: data.courseTitle.trim(),
      program: data.program,
      semester: data.semester,
      description: data.description?.trim() || "",
      instructors: data.instructors.map((inst) => ({
        name: inst.name.trim(),
        email: inst.email.trim(),
      })),
      notifyByEmail: data.notifyByEmail,
    });
    reset(defaultValues);
    setOpen(false);
  };

  // 4.2
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset(defaultValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4 mr-1.5" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
          <DialogDescription>
            ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว
            ใส่เมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100
            ตัวอักษร แล้วกดบันทึก
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 1.2, 1.3 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="courseId"
                className={errors.courseId ? "text-destructive" : ""}
              >
                รหัสวิชา
              </Label>
              <Input
                id="courseId"
                placeholder="เช่น 261305"
                inputMode="numeric"
                {...register("courseId")}
                aria-invalid={!!errors.courseId}
                className={
                  errors.courseId
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.courseId && (
                <p className="text-xs text-destructive">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* 1.2, 1.3 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="courseTitle"
                className={errors.courseTitle ? "text-destructive" : ""}
              >
                ชื่อวิชา
              </Label>
              <Input
                id="courseTitle"
                placeholder="เช่น Mobile Application Development"
                {...register("courseTitle")}
                aria-invalid={!!errors.courseTitle}
                className={
                  errors.courseTitle
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.courseTitle && (
                <p className="text-xs text-destructive">
                  {errors.courseTitle.message}
                </p>
              )}
            </div>
          </div>
          {/* 3.1 */}
          <div className="space-y-1.5">
            <Label className={errors.program ? "text-destructive" : ""}>
              หลักสูตร
            </Label>
            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={!!errors.program}
                    className={`w-full ${errors.program ? "border-destructive text-destructive" : ""}`}
                  >
                    <SelectValue placeholder="เลือกหลักสูตร">
                      {field.value === "CPE"
                        ? "CPE — วิศวกรรมคอมพิวเตอร์"
                        : field.value === "ISNE"
                          ? "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย"
                          : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPE">
                      CPE — วิศวกรรมคอมพิวเตอร์
                    </SelectItem>
                    <SelectItem value="ISNE">
                      ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.program && (
              <p className="text-xs text-destructive">
                {errors.program.message}
              </p>
            )}
          </div>
          {/* 3.2 */}
          <div className="space-y-1.5">
            <Label className={errors.semester ? "text-destructive" : ""}>
              ภาคการศึกษา
            </Label>
            <Controller
              control={control}
              name="semester"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex gap-4 pt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="1"
                      id="sem-1"
                      aria-invalid={!!errors.semester}
                      className={
                        errors.semester
                          ? "border-destructive text-destructive"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="sem-1"
                      className={errors.semester ? "text-destructive" : ""}
                    >
                      ภาคการศึกษาที่ 1
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="2"
                      id="sem-2"
                      aria-invalid={!!errors.semester}
                      className={
                        errors.semester
                          ? "border-destructive text-destructive"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="sem-2"
                      className={errors.semester ? "text-destructive" : ""}
                    >
                      ภาคการศึกษาที่ 2
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="3"
                      id="sem-3"
                      aria-invalid={!!errors.semester}
                      className={
                        errors.semester
                          ? "border-destructive text-destructive"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="sem-3"
                      className={errors.semester ? "text-destructive" : ""}
                    >
                      ภาคฤดูร้อน
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.semester && (
              <p className="text-xs text-destructive">
                {errors.semester.message}
              </p>
            )}
          </div>
          {/* 3.3 */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className={
                errors.description || descriptionValue.length > 100
                  ? "text-destructive"
                  : ""
              }
            >
              รายละเอียด (ไม่บังคับ)
            </Label>
            <Textarea
              id="description"
              placeholder="พัฒนาแอปพลิเคชันบนอุปกรณ์เคลื่อนที่ด้วย React Native"
              {...register("description")}
              aria-invalid={
                !!errors.description || descriptionValue.length > 100
              }
              className={
                errors.description || descriptionValue.length > 100
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <div className="flex justify-between text-xs">
              <span
                className={
                  descriptionValue.length > 100
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {descriptionValue.length}/100 ตัวอักษร
              </span>
            </div>
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* 2.1, 2.2, 2.3 */}
          <div className="space-y-2">
            <div>
              <Label>ผู้สอน</Label>
              <p className="text-xs text-muted-foreground">
                {fields.length}/3 คน — กรอกชื่อผู้สอน และอีเมล name@cmu.ac.th
                (ห้ามซ้ำกัน)
              </p>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium w-4">{index + 1}.</span>

                  <div className="flex-1">
                    <Input
                      placeholder="กรอกชื่อผู้สอน"
                      {...register(`instructors.${index}.name`)}
                      aria-invalid={!!errors.instructors?.[index]?.name}
                      className={
                        errors.instructors?.[index]?.name
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    {errors.instructors?.[index]?.name && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.instructors[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <Input
                      placeholder="name@cmu.ac.th"
                      {...register(`instructors.${index}.email`)}
                      aria-invalid={!!errors.instructors?.[index]?.email}
                      className={
                        errors.instructors?.[index]?.email
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    {errors.instructors?.[index]?.email && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.instructors[index]?.email?.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {errors.instructors?.root && (
              <p className="text-xs text-destructive">
                {errors.instructors.root.message}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}
              onClick={() => append({ name: "", email: "" })}
            >
              <PlusCircle className="mr-1 h-3.5 w-3.5" /> เพิ่มผู้สอน
            </Button>
          </div>
          {/* 3.4 */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm">รับข่าวสารทางอีเมล</Label>
              <p className="text-xs text-muted-foreground">
                แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
              </p>
            </div>
            <Controller
              control={control}
              name="notifyByEmail"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            {/* 4.1 */}
            <Button
              type="button"
              variant="outline"
              onClick={() => reset(defaultValues)}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" /> ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
