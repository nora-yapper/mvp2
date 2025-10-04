"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Building2, Check, Save } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StartupInfo {
  companyName: string
  industry: string
  stage: string
  description: string
  targetMarket: string
  keyProblem: string
  solution: string
  businessModel: string
  teamSize: string
  funding: string
}

export default function HomebaseTaskPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const task = searchParams.get("task")
  const component = searchParams.get("component")

  const [startupInfo, setStartupInfo] = useState<StartupInfo>({
    companyName: "",
    industry: "",
    stage: "",
    description: "",
    targetMarket: "",
    keyProblem: "",
    solution: "",
    businessModel: "",
    teamSize: "",
    funding: "",
  })

  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load existing startup info
    const saved = localStorage.getItem("startupInfo")
    if (saved) {
      setStartupInfo(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)

    // Save to localStorage
    localStorage.setItem("startupInfo", JSON.stringify(startupInfo))

    // Update homebase components
    const homebaseComponents = JSON.parse(localStorage.getItem("homebaseComponents") || "[]")
    const updatedComponents = homebaseComponents.map((comp: any) => {
      if (comp.id === "about-startup") {
        return {
          ...comp,
          preview: startupInfo.companyName || "Click to add startup details",
          completed: true,
        }
      }
      return comp
    })
    localStorage.setItem("homebaseComponents", JSON.stringify(updatedComponents))

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    setIsSaved(true)
    setIsLoading(false)

    // Reset saved state after 2 seconds
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleInputChange = (field: keyof StartupInfo, value: string) => {
    setStartupInfo((prev) => ({ ...prev, [field]: value }))
    setIsSaved(false)
  }

  if (task === "startup-info" || component === "about-startup") {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Navigation Bar */}
        <div className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/homebase")}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homebase
              </Button>
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="h-5 w-5" />
                <span className="font-medium">Startup Information</span>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-xl font-semibold text-white">About Your Startup</CardTitle>
                <p className="text-gray-400 mt-2">
                  Tell us about your startup to get personalized insights and recommendations.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-300 font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      value={startupInfo.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Enter your company name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

{/* Industry */}
<div className="space-y-2">
  <Label htmlFor="industry" className="text-gray-300 font-medium">
    Industry *
  </Label>
  <Select
    value={startupInfo.industry}
    onValueChange={(value) => handleInputChange("industry", value)}
  >
    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
      <SelectValue placeholder="e.g., FinTech, HealthTech, SaaS" />
    </SelectTrigger>
    <SelectContent className="bg-gray-700 border-gray-600 text-white">
      <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
      <SelectItem value="Enterprise Software">Enterprise Software</SelectItem>
      <SelectItem value="SaaS">SaaS</SelectItem>
      <SelectItem value="HealthTech">HealthTech</SelectItem>
      <SelectItem value="BioTech">BioTech</SelectItem>
      <SelectItem value="FinTech">FinTech</SelectItem>
      <SelectItem value="EdTech">EdTech</SelectItem>
      <SelectItem value="Energy & CleanTech">Energy & CleanTech</SelectItem>
      <SelectItem value="Transportation & Mobility">Transportation & Mobility</SelectItem>
      <SelectItem value="Robotics & Automation">Robotics & Automation</SelectItem>
      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
      <SelectItem value="Semiconductors & Hardware">Semiconductors & Hardware</SelectItem>
      <SelectItem value="Food & AgTech">Food & AgTech</SelectItem>
      <SelectItem value="E-commerce & Retail">E-commerce & Retail</SelectItem>
      <SelectItem value="Marketing & AdTech">Marketing & AdTech</SelectItem>
      <SelectItem value="Media & Entertainment">Media & Entertainment</SelectItem>
      <SelectItem value="Gaming">Gaming</SelectItem>
      <SelectItem value="Real Estate & PropTech">Real Estate & PropTech</SelectItem>
      <SelectItem value="Travel & Hospitality">Travel & Hospitality</SelectItem>
      <SelectItem value="Logistics & Supply Chain">Logistics & Supply Chain</SelectItem>
      <SelectItem value="Legal Tech">Legal Tech</SelectItem>
      <SelectItem value="HR Tech & Recruitment">HR Tech & Recruitment</SelectItem>
      <SelectItem value="Telecom">Telecom</SelectItem>
      <SelectItem value="Cloud Infrastructure">Cloud Infrastructure</SelectItem>
      <SelectItem value="Blockchain & Web3">Blockchain & Web3</SelectItem>
      <SelectItem value="DeepTech">DeepTech</SelectItem>
      <SelectItem value="IoT">IoT</SelectItem>
      <SelectItem value="Fashion & Apparel">Fashion & Apparel</SelectItem>
      <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
      <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
      <SelectItem value="Home & Living">Home & Living</SelectItem>
      <SelectItem value="Kids & Family">Kids & Family</SelectItem>
      <SelectItem value="Music & Audio">Music & Audio</SelectItem>
      <SelectItem value="Event Tech">Event Tech</SelectItem>
      <SelectItem value="Social & Community">Social & Community</SelectItem>
      <SelectItem value="Dating & Relationships">Dating & Relationships</SelectItem>
      <SelectItem value="Other">Other</SelectItem>
    </SelectContent>
  </Select>
</div>


{/* Stage */}
<div className="space-y-2">
  <Label htmlFor="stage" className="text-gray-300 font-medium">
    Stage *
  </Label>
  <Select
    value={startupInfo.stage}
    onValueChange={(value) => handleInputChange("stage", value)}
  >
    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
      <SelectValue placeholder="e.g., Idea, MVP, Growth, Scale" />
    </SelectTrigger>
    <SelectContent className="bg-gray-700 border-gray-600 text-white">
      <SelectItem value="Ideation / Discovery">Ideation / Discovery</SelectItem>
      <SelectItem value="Validation / Pre-MVP">Validation / Pre-MVP</SelectItem>
      <SelectItem value="MVP Development">MVP Development</SelectItem>
      <SelectItem value="Early Traction">Early Traction</SelectItem>
      <SelectItem value="Growth / Product–Market Fit">Growth / Product–Market Fit</SelectItem>
      <SelectItem value="Scaling">Scaling</SelectItem>
      <SelectItem value="Maturity / Expansion">Maturity / Expansion</SelectItem>
    </SelectContent>
  </Select>
</div>


                  {/* Target Market */}
                  <div className="space-y-2">
                    <Label htmlFor="targetMarket" className="text-gray-300 font-medium">
                      Target Market
                    </Label>
                    <Input
                      id="targetMarket"
                      value={startupInfo.targetMarket}
                      onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                      placeholder="Who are your customers?"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

{/* Team Size */}
<div className="space-y-2">
  <Label htmlFor="teamSize" className="text-gray-300 font-medium">
    Team Size
  </Label>
  <Select
    value={startupInfo.teamSize}
    onValueChange={(value) => handleInputChange("teamSize", value)}
  >
    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500">
      <SelectValue placeholder="e.g., 1-5, 6-10, 11-25" />
    </SelectTrigger>
    <SelectContent className="bg-gray-700 border-gray-600 text-white">
      <SelectItem value="1-5">1-5</SelectItem>
      <SelectItem value="6-10">6-10</SelectItem>
      <SelectItem value="11-25">11-25</SelectItem>
      <SelectItem value="26-50">26-50</SelectItem>
      <SelectItem value="51-100">51-100</SelectItem>
      <SelectItem value="101-200">101-200</SelectItem>
      <SelectItem value="201-500">201-500</SelectItem>
      <SelectItem value="501-1000">501-1000</SelectItem>
      <SelectItem value="1000+">1000+</SelectItem>
    </SelectContent>
  </Select>
</div>


                  {/* Funding */}
                  <div className="space-y-2">
                    <Label htmlFor="funding" className="text-gray-300 font-medium">
                      Funding Status
                    </Label>
                    <Input
                      id="funding"
                      value={startupInfo.funding}
                      onChange={(e) => handleInputChange("funding", e.target.value)}
                      placeholder="e.g., Bootstrapped, Pre-seed, Seed"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Full-width fields */}
                <div className="mt-6 space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-300 font-medium">
                      Company Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={startupInfo.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Briefly describe what your company does..."
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Key Problem */}
                  <div className="space-y-2">
                    <Label htmlFor="keyProblem" className="text-gray-300 font-medium">
                      Key Problem You're Solving
                    </Label>
                    <Textarea
                      id="keyProblem"
                      value={startupInfo.keyProblem}
                      onChange={(e) => handleInputChange("keyProblem", e.target.value)}
                      placeholder="What problem does your startup solve?"
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Solution */}
                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-gray-300 font-medium">
                      Your Solution
                    </Label>
                    <Textarea
                      id="solution"
                      value={startupInfo.solution}
                      onChange={(e) => handleInputChange("solution", e.target.value)}
                      placeholder="How does your product/service solve the problem?"
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Business Model */}
                  <div className="space-y-2">
                    <Label htmlFor="businessModel" className="text-gray-300 font-medium">
                      Business Model
                    </Label>
                    <Textarea
                      id="businessModel"
                      value={startupInfo.businessModel}
                      onChange={(e) => handleInputChange("businessModel", e.target.value)}
                      placeholder="How do you make money?"
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : isSaved ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Saved Successfully
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Information
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Task Not Found</h1>
        <p className="text-gray-400 mb-6">The requested task could not be found.</p>
        <Button onClick={() => router.push("/homebase")} className="bg-blue-600 hover:bg-blue-700 text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Homebase
        </Button>
      </div>
    </div>
  )
}
