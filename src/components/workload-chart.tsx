"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WorkloadChart() {
  const [data, setData] = React.useState<any[]>([])
  const [categoryData, setCategoryData] = React.useState<any[]>([])

  React.useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockData = [
      { month: "Jan", hours: 45.5 },
      { month: "Feb", hours: 52.0 },
      { month: "Mar", hours: 48.5 },
      { month: "Apr", hours: 61.2 },
      { month: "May", hours: 55.8 },
      { month: "Jun", hours: 58.3 },
    ]

    const mockCategoryData = [
      { name: "Lecture", value: 65, color: "#3b82f6" },
      { name: "Lab", value: 25, color: "#10b981" },
      { name: "Evaluation", value: 15, color: "#f59e0b" },
      { name: "Admin Work", value: 10, color: "#6b7280" },
      { name: "Research", value: 8, color: "#8b5cf6" },
    ]

    setData(mockData)
    setCategoryData(mockCategoryData)
  }, [])

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="trend">Trend</TabsTrigger>
        <TabsTrigger value="category">By Category</TabsTrigger>
      </TabsList>
      
      <TabsContent value="monthly" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="trend" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="hours" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TabsContent>
      
      <TabsContent value="category" className="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}