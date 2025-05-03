// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Textarea } from "@/components/ui/textarea"
// import { ArrowLeft, BookOpen, Brain, Check, FileText, MessageSquare, AlertCircle } from "lucide-react"
// import { Label } from "@/components/ui/label"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"

// // Mock test data
// const mockTestex = {
//   questions: [
//     {
//       id: 1,
//       type: "mcq",
//       text: "Which of the following is NOT a primary data structure?",
//       options: [
//         { id: "a", text: "Arrays" },
//         { id: "b", text: "Linked Lists" },
//         { id: "c", text: "Trees" },
//         { id: "d", text: "Stacks" },
//       ],
//       correctAnswer: "c",
//     },
//     {
//       id: 2,
//       type: "subjective",
//       text: "Explain the concept of recursion and provide a simple example.",
//       expectedKeywords: ["base case", "recursive case", "stack", "function calls itself"],
//     },
//     {
//       id: 3,
//       type: "mcq",
//       text: "What is the time complexity of binary search?",
//       options: [
//         { id: "a", text: "O(1)" },
//         { id: "b", text: "O(log n)" },
//         { id: "c", text: "O(n)" },
//         { id: "d", text: "O(n²)" },
//       ],
//       correctAnswer: "b",
//     },
//   ],
// }

// export default function TestPage() {
//   const [currentQuestion, setCurrentQuestion] = useState(0)
//   const [answers, setAnswers] = useState({})
//   const [showResults, setShowResults] = useState(false)
//   const [score, setScore] = useState(0)
//   const [weakAreas, setWeakAreas] = useState([])
//   const [testSource, setTestSource] = useState(null)
//   const [authorized, setAuthorized] = useState(false)
//   const [mockTest, setMockTest] = useState(mockTestex)
//   const router = useRouter()

//   useEffect(() => {
//     // In a real app, this would check session/auth state
//     // For now, we'll check if there's a test source in localStorage
//     const source = localStorage.getItem("PDFtext")
//     // console.log("Test source from localStorage:", source)
//     console.log(JSON.parse(source))
//     if (source ) {
//       setTestSource(source)
//       setMockTest(JSON.parse(source))
//       setAuthorized(true)
//     } else {
//       // Check if there's a weak topic test authorization
//       const weakTopicTest = localStorage.getItem("weakTopicTest")
//       if (weakTopicTest) {
//         setTestSource("weak_topics")
//         setAuthorized(true)
//         localStorage.removeItem("weakTopicTest") // Use once only
//       }else{
//         router.push("/summarizer")
//       }
//     }
//   }, [])

//   const question = mockTest.questions[currentQuestion]
//   const totalQuestions = mockTest.questions.length
//   const progress = ((currentQuestion + 1) / totalQuestions) * 100

//   const handleMCQAnswer = (value) => {
//     setAnswers({ ...answers, [question.id]: value })
//   }

//   const handleSubjectiveAnswer = (e) => {
//     setAnswers({ ...answers, [question.id]: e.target.value })
//   }

//   const handleNext = async() => {
//     if (currentQuestion < totalQuestions - 1) {
//       setCurrentQuestion(currentQuestion + 1)
//     } else {
//       // Calculate results
//       let calculatedScore = 0
//       const weakTopics = []

//       // mockTest.questions.forEach((q) => {
//       //   if (q.type === "mcq") {
//       //     if (answers[q.id] === q.correctAnswer) {
//       //       calculatedScore += 1
//       //     } else {
//       //       weakTopics.push("Topic related to: " + q.text)
//       //     }
//       //   } else if (q.type === "subjective") {
//       //     // Simple keyword-based scoring for subjective questions
//       //     const answer = answers[q.id] || ""
//       //     let keywordsFound = 0
//       //     q.expectedKeywords.forEach((keyword) => {
//       //       if (answer.toLowerCase().includes(keyword.toLowerCase())) {
//       //         keywordsFound += 1
//       //       }
//       //     })

//       //     const percentageFound = keywordsFound / q.expectedKeywords.length
//       //     if (percentageFound >= 0.7) {
//       //       calculatedScore += 1
//       //     } else {
//       //       weakTopics.push("Topic related to: " + q.text)
//       //     }
//       //   }
//       // })

//       try {
//         const response = await fetch('http://localhost:5002/evaluate', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             answers: answers,
//             questions: mockTest.questions,
//           }),
//         });
    
//         if (!response.ok) {
//           return response.json({ error: 'AI server error' }, { status: 500 });
//         }
    
//         const result = await response.json();
//         return response.json(result);
//       } catch (err) {
//         return NextResponse.json({ error: 'Failed to reach AI server' }, { status: 500 });
//       }



//       console.log(answers)
//       setScore((calculatedScore / totalQuestions) * 100)
//       setWeakAreas(weakTopics)
//       setShowResults(true)
//     }
//   }

//   const handlePrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1)
//     }
//   }

//   const handleRetakeTest = () => {
//     setCurrentQuestion(0)
//     setAnswers({})
//     setShowResults(false)
//     setScore(0)
//     setWeakAreas([])
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* Sidebar */}
//       <div className="hidden w-72 p-6 border-r border-border md:block">
//         <div className="flex items-center mb-10 space-x-3">
//           <Brain className="w-8 h-8 text-primary" />
//           <h1 className="text-2xl font-bold">StudyAI</h1>
//         </div>
//         <nav className="space-y-3">
//           <Link href="/dashboard" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
//             <FileText className="w-6 h-6 mr-4" />
//             Dashboard
//           </Link>
//           <Link href="/summarizer" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
//             <BookOpen className="w-6 h-6 mr-4" />
//             Summarizer
//           </Link>
//           <Link href="/test" className="flex items-center w-full p-3 text-lg rounded-lg bg-accent text-primary">
//             <Brain className="w-6 h-6 mr-4" />
//             Test
//           </Link>
//           <Link href="/chat" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
//             <MessageSquare className="w-6 h-6 mr-4" />
//             AI Chat
//           </Link>
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-6 md:p-10">
//         <div className="flex items-center mb-8">
//           <Link href="/dashboard" className="mr-4">
//             <Button variant="ghost" size="icon" className="h-10 w-10">
//               <ArrowLeft className="w-6 h-6" />
//             </Button>
//           </Link>
//           <h1 className="text-3xl font-bold">Test Page</h1>
//         </div>

//         {!authorized ? (
//           <Card className="border-2">
//             <CardHeader>
//               <CardTitle className="text-2xl">Access Restricted</CardTitle>
//               <CardDescription className="text-lg">You need proper authorization to take a test</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Unauthorized Access</AlertTitle>
//                 <AlertDescription>
//                   Tests can only be accessed after summarizing content or from your dashboard based on your weak topics.
//                 </AlertDescription>
//               </Alert>
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <h3 className="text-lg font-medium mb-2">How to access tests:</h3>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>Upload and summarize a PDF or text in the Summarizer section, then click "Take Test"</li>
//                     <li>Access personalized tests from your Dashboard based on your weak topics</li>
//                   </ul>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={() => router.push("/dashboard")}>
//                 Go to Dashboard
//               </Button>
//               <Button onClick={() => router.push("/summarizer")}>Go to Summarizer</Button>
//             </CardFooter>
//           </Card>
//         ) : (
//           <>
//             {!showResults ? (
//               <Card className="border-2">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-2xl">
//                         Question {currentQuestion + 1} of {totalQuestions}
//                       </CardTitle>
//                       <CardDescription className="text-lg">
//                         {question.type === "mcq" ? "Multiple Choice Question" : "Subjective Question"}
//                       </CardDescription>
//                     </div>
//                     <div className="text-lg text-muted-foreground">
//                       Test Source: {testSource === "weak_topics" ? "Weak Topics" : "Summarized Content"}
//                     </div>
//                   </div>
//                   <Progress value={progress} className="h-3 mt-4" />
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="text-xl font-medium">{question.text}</div>

//                   {question.type === "mcq" ? (
//                     <RadioGroup value={answers[question.id]} onValueChange={handleMCQAnswer}>
//                       {question.options.map((option) => (
//                         <div key={option.id} className="flex items-center space-x-3 p-3 rounded hover:bg-accent/30">
//                           <RadioGroupItem value={option.id} id={`option-${option.id}`} className="h-6 w-6" />
//                           <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-lg">
//                             {option.text}
//                           </Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                   ) : (
//                     <Textarea
//                       placeholder="Type your answer here..."
//                       className="min-h-[200px] text-lg p-4"
//                       value={answers[question.id] || ""}
//                       onChange={handleSubjectiveAnswer}
//                     />
//                   )}
//                 </CardContent>
//                 <CardFooter className="flex justify-between">
//                   <Button
//                     variant="outline"
//                     onClick={handlePrevious}
//                     disabled={currentQuestion === 0}
//                     className="h-12 text-lg"
//                   >
//                     Previous
//                   </Button>
//                   <Button onClick={handleNext} disabled={!answers[question.id]} className="h-12 text-lg">
//                     {currentQuestion < totalQuestions - 1 ? "Next" : "Finish Test"}
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ) : (
//               <div className="space-y-8">
//                 <Card className="border-2">
//                   <CardHeader>
//                     <CardTitle className="text-2xl">Test Results</CardTitle>
//                     <CardDescription className="text-lg">
//                       Based on your performance, we've identified your strengths and areas for improvement
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     <div>
//                       <h3 className="mb-3 text-xl font-medium">Your Score</h3>
//                       <div className="flex items-end gap-2 mb-4">
//                         <p className="text-4xl font-bold">{Math.round(score)}</p>
//                         <p className="text-xl text-muted-foreground">/ 100</p>
//                       </div>
//                       <div className="h-8 w-full bg-accent/30 rounded-full overflow-hidden">
//                         <div
//                           className="h-full bg-primary rounded-full transition-all duration-1000"
//                           style={{ width: `${score}%` }}
//                         ></div>
//                       </div>
//                     </div>

//                     {weakAreas.length > 0 && (
//                       <div>
//                         <h3 className="mb-3 text-xl font-medium">Weak Areas</h3>
//                         <div className="flex flex-wrap gap-3">
//                           {weakAreas.map((area, index) => (
//                             <Badge key={index} variant="outline" className="text-lg py-2 px-4">
//                               {area}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                   <CardFooter>
//                     <Button onClick={handleRetakeTest} className="w-full h-14 text-lg">
//                       Take Another Test
//                     </Button>
//                   </CardFooter>
//                 </Card>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <Card className="border-2">
//                     <CardHeader>
//                       <CardTitle className="text-2xl">Recommended Study Materials</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <ul className="space-y-3">
//                         <li className="flex items-center gap-3">
//                           <Check className="w-6 h-6 text-green-500" />
//                           <span className="text-lg">Data Structures and Algorithms Fundamentals</span>
//                         </li>
//                         <li className="flex items-center gap-3">
//                           <Check className="w-6 h-6 text-green-500" />
//                           <span className="text-lg">Recursion Practice Problems</span>
//                         </li>
//                         <li className="flex items-center gap-3">
//                           <Check className="w-6 h-6 text-green-500" />
//                           <span className="text-lg">Time Complexity Analysis</span>
//                         </li>
//                       </ul>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-2">
//                     <CardHeader>
//                       <CardTitle className="text-2xl">Next Steps</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <Link href="/summarizer">
//                         <Button variant="outline" className="w-full h-12 justify-start text-lg">
//                           <BookOpen className="w-5 h-5 mr-3" />
//                           Review Study Materials
//                         </Button>
//                       </Link>
//                       <Link href="/chat">
//                         <Button variant="outline" className="w-full h-12 justify-start text-lg">
//                           <MessageSquare className="w-5 h-5 mr-3" />
//                           Ask AI for Help
//                         </Button>
//                       </Link>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, Brain, Check, FileText, MessageSquare, AlertCircle, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast" // Assuming you have this component

// Mock test data
const mockTestex = {
  questions: [
    {
      id: 1,
      type: "mcq",
      text: "Which of the following is NOT a primary data structure?",
      options: [
        { id: "a", text: "Arrays" },
        { id: "b", text: "Linked Lists" },
        { id: "c", text: "Trees" },
        { id: "d", text: "Stacks" },
      ],
      correctAnswer: "c",
    },
    {
      id: 2,
      type: "subjective",
      text: "Explain the concept of recursion and provide a simple example.",
      expectedKeywords: ["base case", "recursive case", "stack", "function calls itself"],
    },
    {
      id: 3,
      type: "mcq",
      text: "What is the time complexity of binary search?",
      options: [
        { id: "a", text: "O(1)" },
        { id: "b", text: "O(log n)" },
        { id: "c", text: "O(n)" },
        { id: "d", text: "O(n²)" },
      ],
      correctAnswer: "b",
    },
  ],
}

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [weakAreas, setWeakAreas] = useState([])
  const [wrongMcqAnswers, setWrongMcqAnswers] = useState([])
  const [testSource, setTestSource] = useState(null)
  const [authorized, setAuthorized] = useState(false)
  const [mockTest, setMockTest] = useState(mockTestex)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would check session/auth state
    // For now, we'll check if there's a test source in localStorage
    const source = localStorage.getItem("PDFtext")
    
    if (source) {
      try {
        const parsedSource = JSON.parse(source)
        setTestSource("summarized_content")
        setMockTest(parsedSource)
        setAuthorized(true)
      } catch (error) {
        console.error("Error parsing test source:", error)
        // Fallback to mock test if parsing fails
        setTestSource("fallback")
        setAuthorized(true)
      }
    } else {
      // Check if there's a weak topic test authorization
      const weakTopicTest = localStorage.getItem("weakTopicTest")
      if (weakTopicTest) {
        setTestSource("weak_topics")
        setAuthorized(true)
        localStorage.removeItem("weakTopicTest") // Use once only
      } else {
        router.push("/summarizer")
      }
    }
  }, [])

  const question = mockTest.questions[currentQuestion]
  const totalQuestions = mockTest.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleMCQAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value })
  }

  const handleSubjectiveAnswer = (e) => {
    setAnswers({ ...answers, [question.id]: e.target.value })
  }

  const handleNext = async () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate results
      setIsLoading(true)
      
      try {
        const response = await fetch('http://localhost:5002/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: answers,
            questions: mockTest.questions,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Server responded with an error');
        }
    
      const result = await response.json();
      const percentage = result.percentage;
      const scores = result;
      const weakTopicsArray = result.weakTopics?.map(item => item.question) || [];

  // Send to /test to store in DB
      const res1 = await fetch("http://localhost:3000/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: Math.round(percentage),
          weakTopics: weakTopicsArray.join(', ')
        }),
      });
        
        // Set state with the evaluation results
        setScore(result.score);
        setMaxScore(result.maxScore);
        setPercentage(result.percentage);
        setWeakAreas(result.weakTopics || []);
        setWrongMcqAnswers(result.wrongMcqAnswers || []);
        setShowResults(true);

        console.log("Evaluation result:", result);

      } catch (err) {
        console.error("Error evaluating test:", err);
        toast({
          title: "Evaluation Error",
          description: "There was a problem evaluating your test. Using fallback method.",
          variant: "destructive",
        });
        
        // Fallback calculation if server fails
        let calculatedScore = 0;
        const weakTopics = [];
        
        mockTest.questions.forEach((q) => {
          if (q.type === "mcq") {
            if (answers[q.id] === q.correctAnswer) {
              calculatedScore += 1;
            } else {
              weakTopics.push({
                question: "Topic related to: " + q.text,
                whatiswrong: ["Incorrect answer"]
              });
            }
          } else if (q.type === "subjective") {
            // Simple keyword-based scoring for subjective questions
            const answer = answers[q.id] || "";
            let keywordsFound = 0;
            q.expectedKeywords.forEach((keyword) => {
              if (answer.toLowerCase().includes(keyword.toLowerCase())) {
                keywordsFound += 1;
              }
            });

            const percentageFound = keywordsFound / q.expectedKeywords.length;
            if (percentageFound >= 0.7) {
              calculatedScore += 1;
            } else {
              weakTopics.push({
                question: "Topic related to: " + q.text,
                whatiswrong: ["Missing key concepts"]
              });
            }
          }
          
        });
        
        setScore(calculatedScore);
        setMaxScore(totalQuestions);
        setPercentage((calculatedScore / totalQuestions) * 100);
        setWeakAreas(weakTopics);
        setShowResults(true);
        
        
        


      } finally {
        setIsLoading(false);
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRetakeTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setScore(0)
    setMaxScore(0)
    setPercentage(0)
    setWeakAreas([])
    setWrongMcqAnswers([])
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden w-72 p-6 border-r border-border md:block">
        <div className="flex items-center mb-10 space-x-3">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">StudyAI</h1>
        </div>
        <nav className="space-y-3">
          <Link href="/dashboard" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <FileText className="w-6 h-6 mr-4" />
            Dashboard
          </Link>
          <Link href="/summarizer" className="flex items-center w-full p-3 text-lg rounded-lg hover:bg-accent">
            <BookOpen className="w-6 h-6 mr-4" />
            Summarizer
          </Link>
          <Link href="/test" className="flex items-center w-full p-3 text-lg rounded-lg bg-accent text-primary">
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
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Test Page</h1>
        </div>

        {!authorized ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Access Restricted</CardTitle>
              <CardDescription className="text-lg">You need proper authorization to take a test</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Unauthorized Access</AlertTitle>
                <AlertDescription>
                  Tests can only be accessed after summarizing content or from your dashboard based on your weak topics.
                </AlertDescription>
              </Alert>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">How to access tests:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Upload and summarize a PDF or text in the Summarizer section, then click "Take Test"</li>
                    <li>Access personalized tests from your Dashboard based on your weak topics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button onClick={() => router.push("/summarizer")}>Go to Summarizer</Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            {!showResults ? (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Question {currentQuestion + 1} of {totalQuestions}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {question.type === "mcq" ? "Multiple Choice Question" : "Subjective Question"}
                      </CardDescription>
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Test Source: {testSource === "weak_topics" ? "Weak Topics" : testSource === "fallback" ? "Practice Test" : "Summarized Content"}
                    </div>
                  </div>
                  <Progress value={progress} className="h-3 mt-4" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-xl font-medium">{question.text}</div>

                  {question.type === "mcq" ? (
                    <RadioGroup value={answers[question.id]} onValueChange={handleMCQAnswer}>
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-3 rounded hover:bg-accent/30">
                          <RadioGroupItem value={option.id} id={`option-${option.id}`} className="h-6 w-6" />
                          <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-lg">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Textarea
                      placeholder="Type your answer here..."
                      className="min-h-[200px] text-lg p-4"
                      value={answers[question.id] || ""}
                      onChange={handleSubjectiveAnswer}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="h-12 text-lg"
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext} 
                    disabled={!answers[question.id] || isLoading} 
                    className="h-12 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      currentQuestion < totalQuestions - 1 ? "Next" : "Finish Test"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="space-y-8">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">Test Results</CardTitle>
                    <CardDescription className="text-lg">
                      Based on your performance, we've identified your strengths and areas for improvement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-xl font-medium">Your Score</h3>
                      <div className="flex items-end gap-2 mb-4">
                        <p className="text-4xl font-bold">{Math.round(percentage)}</p>
                        <p className="text-xl text-muted-foreground">/ 100</p>
                      </div>
                      <div className="h-8 w-full bg-accent/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="mt-3 text-lg">{score} out of {maxScore} questions answered correctly</p>
                    </div>

                    {weakAreas.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-xl font-medium">Areas for Improvement</h3>
                        <div className="space-y-4">
                          {weakAreas && weakAreas.map((area, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">{area.question}</h4>
                              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {area && area.whatiswrong.map((issue, i) => (
                                  <li key={i}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {wrongMcqAnswers && wrongMcqAnswers.length > 0 && (
                      <div>
                        <h3 className="mb-3 text-xl font-medium">Incorrect Multiple Choice Answers</h3>
                        <div className="space-y-4">
                          {wrongMcqAnswers.map((answer, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <h4 className="font-medium mb-2">{answer.question}</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 bg-red-100 rounded">
                                  <span className="font-medium">Your answer:</span> {answer.yourAnswer}
                                </div>
                                <div className="p-2 bg-green-100 rounded">
                                  <span className="font-medium">Correct answer:</span> {answer.correctAnswer}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleRetakeTest} className="w-full h-14 text-lg">
                      Take Another Test
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-2xl">Recommended Study Materials</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {weakAreas.length > 0 ? (
                          weakAreas.slice(0, 3).map((area, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <Check className="w-6 h-6 text-green-500" />
                              <span className="text-lg">Resources for: {area.question.slice(0, 50)}...</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-center gap-3">
                              <Check className="w-6 h-6 text-green-500" />
                              <span className="text-lg">Great job! Continue with advanced topics</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-2xl">Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Link href="/summarizer">
                        <Button variant="outline" className="w-full h-12 justify-start text-lg">
                          <BookOpen className="w-5 h-5 mr-3" />
                          Review Study Materials
                        </Button>
                      </Link>
                      <Link href="/chat">
                        <Button variant="outline" className="w-full h-12 justify-start text-lg">
                          <MessageSquare className="w-5 h-5 mr-3" />
                          Ask AI for Help
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}