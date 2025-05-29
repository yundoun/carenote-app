"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Pill } from "lucide-react"

interface ResidentProps {
  name: string
  age: number
  gender: "male" | "female"
  room: string
  conditions: string[]
  warnings?: string[]
  medications?: string[]
}

export default function ResidentCard({
  name,
  age,
  gender,
  room,
  conditions,
  warnings = [],
  medications = [],
}: ResidentProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className="w-full mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-muted rounded-full p-3 text-2xl">👤</div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {name} ({age}세/{gender === "male" ? "남" : "여"})
              </h3>
            </div>
            <p className="text-muted-foreground mt-1">
              {room}호 | {conditions.join(", ")}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {warnings.map((warning, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {warning}
                </Badge>
              ))}

              {medications.map((medication, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                >
                  <Pill className="h-3 w-3" />
                  {medication}
                </Badge>
              ))}
            </div>

            {expanded && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">상세 정보</h4>
                <p className="text-sm text-muted-foreground">
                  이 섹션에는 입주자의 상세 정보가 표시됩니다. 식이 제한, 알레르기, 선호도, 일상 활동 지원 필요 사항
                  등이 포함될 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
