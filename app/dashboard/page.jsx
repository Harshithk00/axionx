"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, FileText, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { set } from "react-hook-form"

// Mock user data
const userData = {
  username: "johndoe",
  fieldOfStudy: "Computer Science",
  year: "Third Year",
  score: 78,
  weakTopics: ["Data Structures", "Algorithms", "Database Systems"],
  scoreHistory: [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 70 },
    { month: "Mar", score: 68 },
    { month: "Apr", score: 72 },
    { month: "May", score: 75 },
    { month: "Jun", score: 78 },
  ],
}

export default function DashboardPage() {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        userData.username = data.user.username;
        userData.fieldOfStudy = data.user.fos;
        if (data.user) {
          if (data.user.year == '1') {
            data.user.year = 'First Year';
          } else if (data.user.year == '2') {
            data.user.year = 'Second Year';
          } else if (data.user.year == '3') {
            data.user.year = 'Third Year';
          } else if (data.user.year == '4') {
            data.user.year = 'Fourth Year';
          }
        }
        userData.year = data.user.year;
        
        const weakTopics1 = data.user.weaktopics.split(",");
        console.log(weakTopics1);
        const scoresarr = JSON.parse(data.user.scores);


        setUser(userData);
        userData.score = data.user.score;
        userData.weakTopics = weakTopics1;
        userData.scoreHistory = scoresarr;
        console.log(data.user); // { username, fos, year }
      } else {
        console.error(data.error);
      }
    }
  
    fetchUser();
  }, []);

  const router = useRouter()

  const startWeakTopicTest = (topic) => {
    // In a real app, this would set up a test focused on the weak topic
    localStorage.setItem("weakTopicTest", topic)
    router.push("/test")
  }

  // Find the highest score to normalize the chart
  const maxScore = Math.max(...userData.scoreHistory.map((item) => item.score))

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-72 p-6 border-r border-border md:block">
        <div className="flex items-center mb-10 space-x-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">StudyAI</h1>
        </div>
        <nav className="space-y-3">
          <Link href="/dashboard" className="flex items-center w-full p-3 text-lg rounded-lg bg-accent text-primary">
            <FileText className="w-6 h-6 mr-4" />
            Dashboard
          </Link>
          <Link href="/summarizer" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <BookOpen className="w-6 h-6 mr-4" />
            Summarizer
          </Link>
          <Link href="/test" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <Brain className="w-6 h-6 mr-4" />
            Test
          </Link>
          <Link href="/chat" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <MessageSquare className="w-6 h-6 mr-4" />
            AI Chat
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" size="lg" className="text-lg">
            Log Out
          </Button>
        </div>

        {/* User info */}
        <div className="grid gap-6 mb-10 md:grid-cols-3">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">Username</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData.username}</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">Field of Study</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{userData.fieldOfStudy}</p>
              <p className="text-lg text-muted-foreground mt-1">{userData.year}</p>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-muted-foreground">Current Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{userData.score}</p>
                <p className="text-lg text-muted-foreground">/ 100</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Score Graph */}
        <Card className="mb-10 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Score Progress</CardTitle>
            <CardDescription className="text-lg">Your performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {userData.scoreHistory.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(item.score / 100) * 100}%`,
                      minHeight: "10%",
                    }}
                  ></div>
                  <div className="text-sm font-medium">{item.month}</div>
                  <div className="text-sm font-bold">{item.score}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weak topics */}
        <Card className="mb-10 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Weak Topics</CardTitle>
            <CardDescription className="text-lg">Areas where you need to improve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {userData.weakTopics.map((topic, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-lg py-2 px-4 cursor-pointer hover:bg-accent"
                  onClick={() => startWeakTopicTest(topic)}
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/summarizer" className="block">
            <Card className="h-full transition-all hover:shadow-lg border-2 hover:border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">PDF Summarizer</CardTitle>
                <CardDescription className="text-lg">Generate summaries from your study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full h-14 text-lg" size="lg">
                  Start
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/test" className="block">
            <Card className="h-full transition-all hover:shadow-lg border-2 hover:border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Take a Test</CardTitle>
                <CardDescription className="text-lg">Test your knowledge and identify weak areas</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full h-14 text-lg" size="lg">
                  Start
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat" className="block">
            <Card className="h-full transition-all hover:shadow-lg border-2 hover:border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">AI Chat Bot</CardTitle>
                <CardDescription className="text-lg">Get help with your study questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full h-14 text-lg" size="lg">
                  Start
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
