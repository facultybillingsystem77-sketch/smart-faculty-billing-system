"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPayload } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { WorkloadClassifier } from "@/lib/ai/classifier"
import { calculateHours } from "@/lib/utils"

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  timeIn: z.string().min(1, "Please enter time in"),
  timeOut: z.string().min(1, "Please enter time out"),
  subject: z.string().min(1, "Please select a subject"),
  activity: z.string().min(5, "Activity description must be at least 5 characters"),
  category: z.enum(["lecture", "lab", "evaluation", "admin_work", "research_work"]),
  description: z.string().optional(),
  location: z.string().optional(),
})

interface WorklogFormProps {
  user: UserPayload
  onSubmit: () => void
  onCancel: () => void
  initialData?: any
}

export function WorklogForm({ user, onSubmit, onCancel, initialData }: WorklogFormProps) {
  const [subjects, setSubjects] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [aiClassification, setAiClassification] = React.useState<string>("")
  const { toast } = useToast()
  const classifier = React.useMemo(() => new WorkloadClassifier(), [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: new Date(),
      timeIn: "09:00",
      timeOut: "10:00",
      subject: "",
      activity: "",
      category: "lecture",
      description: "",
      location: "",
    },
  })

  React.useEffect(() => {
    fetchSubjects()
  }, [])

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "activity" && value.activity) {
        const classification = classifier.classify(value.activity)
        setAiClassification(
          `AI suggests: ${classification.category} (${Math.round(
            classification.confidence * 100
          )}% confidence)`
        )
        if (classification.confidence > 0.6) {
          form.setValue("category", classification.category)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, classifier])

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch subjects:", error)
    }
  }

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const totalHours = calculateHours(values.timeIn, values.timeOut)
      
      const response = await fetch("/api/worklogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user.id,
          totalHours,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Work log submitted successfully!",
        })
        onSubmit()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to submit work log",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="timeIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time In</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Out</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your work activity..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {aiClassification || "AI will automatically classify your activity"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lecture">Lecture</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="evaluation">Evaluation</SelectItem>
                  <SelectItem value="admin_work">Admin Work</SelectItem>
                  <SelectItem value="research_work">Research Work</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Room A101, Online" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Any additional details..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Work Log"}
          </Button>
        </div>
      </form>
    </Form>
  )
}