"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, Brain, FileText, MessageSquare, Upload, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function SummarizerPage() {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [importantQuestions, setImportantQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openQuestions, setOpenQuestions] = useState({})
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleFileChange = (e) => {
  const selected = Array.from(e.target.files);
  setFiles((prev) => [...prev, ...selected]);
};
  const handleFileRemove = (file) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  }

useEffect(() => {
  setSummary(
    "This is a generated summary of the uploaded content. It highlights the key concepts and important information that might be relevant for your exam preparation. The summary is designed to be concise while covering all the essential points from the original material.\n\nThe document discusses advanced machine learning techniques with a focus on neural networks and their applications in natural language processing. It covers the evolution of transformer models from basic architectures to more sophisticated implementations like BERT and GPT. The paper also addresses challenges in training large language models, including computational requirements and ethical considerations.",
  )

  setImportantQuestions([
    {
      question: "What are the main components of transformer architecture and how do they function together?",
      answer:
        "The main components of transformer architecture include self-attention mechanisms, feed-forward neural networks, positional encodings, and normalization layers. Self-attention allows the model to weigh the importance of different words in relation to each other. Feed-forward networks process these weighted representations. Positional encodings provide information about word order. Normalization layers help stabilize training. Together, these components enable transformers to process sequences in parallel while capturing complex relationships between elements.",
    },
    {
      question:
        "Compare and contrast encoder-only, decoder-only, and encoder-decoder transformer models with examples.",
      answer:
        "Encoder-only models (like BERT) process the entire input sequence bidirectionally and are best for understanding tasks like classification and NER. Decoder-only models (like GPT) process input autoregressively and excel at text generation. Encoder-decoder models (like T5) use separate components for understanding input and generating output, making them ideal for translation and summarization tasks. BERT focuses on understanding context, GPT on generating coherent text, and T5 on transforming input sequences into different output sequences.",
    },
    {
      question: "Explain the significance of attention mechanisms in modern NLP models.",
      answer:
        "Attention mechanisms revolutionized NLP by allowing models to focus on relevant parts of input when producing output. They enable direct connections between distant words, solving the long-range dependency problem that plagued RNNs. Self-attention specifically lets models weigh the importance of each word in relation to all others, creating rich contextual representations. This breakthrough enabled the development of transformer models that process text in parallel rather than sequentially, dramatically improving both performance and training efficiency.",
    },
    {
      question: "Discuss the ethical considerations and challenges in deploying large language models.",
      answer:
        "Ethical considerations for large language models include bias amplification (models reproducing or amplifying societal biases in training data), environmental impact (substantial energy consumption for training), potential misuse (generating harmful content), privacy concerns (memorization of training data), and accessibility issues (concentration of power with few organizations). Challenges include ensuring fairness, reducing carbon footprint through efficient training, implementing safeguards against misuse, protecting privacy, and democratizing access to these powerful technologies.",
    },
  ])
}, []);
  
  

  const handleTextChange = (e) => {
    setText(e.target.value)
  } 

  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(async () => {
      // In a real app, you would send the file/text to your backend for processing
      try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch('http://localhost:5000/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();

      console.log("Response data:", data);
      setResults(data.results);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(`Error processing files: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
    }, 2000)
  }

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleTakeTest = () => {
    // In a real app, this would set up a test based on the summarized content
    localStorage.setItem("testSource", "summarized_content")
    router.push("/test")
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
          <Link href="/summarizer" className="flex items-center w-full p-3 text-lg rounded-lg bg-accent text-primary">
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
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">PDF and Topic Summarizer</h1>
        </div>

        <Card className="mb-10 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Upload Content</CardTitle>
            <CardDescription className="text-lg">
              Upload a PDF or paste text to generate a summary and important questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pdf" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-14 text-lg">
                <TabsTrigger value="pdf" className="text-lg">
                  PDF Upload
                </TabsTrigger>
                <TabsTrigger value="text" className="text-lg">
                  Text Input
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pdf" className="space-y-6">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg cursor-pointer bg-accent/20 hover:bg-accent/30"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-16 h-16 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-xl text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-lg text-muted-foreground">PDF (MAX. 10MB)</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                </div>
                {files.length > 0 && (
                      <div className="p-4 text-lg bg-accent/20 rounded-lg">
                        <p>Selected files: {files.map((f) => f.name).join(", ")}</p>
                      </div>
                )}

              </TabsContent>
              <TabsContent value="text" className="space-y-6">
                <Textarea
                  placeholder="Paste your text here..."
                  className="min-h-[300px] text-lg p-4"
                  value={text}
                  onChange={handleTextChange}
                />
              </TabsContent>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!files && !text)}
                className="mt-6 h-14 text-lg px-8"
                size="lg"
              >
                {isLoading ? "Processing..." : "Generate Summary"}
              </Button>
            </Tabs>
          </CardContent>
        </Card>

        {(summary || importantQuestions.length > 0) && (
          <div className="space-y-10">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-accent/20 rounded-lg">
                  <p className="whitespace-pre-line text-lg leading-relaxed">{summary}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Important Questions & Answers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {importantQuestions.map((item, index) => (
                  <Collapsible
                    key={index}
                    open={openQuestions[index]}
                    onOpenChange={() => toggleQuestion(index)}
                    className="border rounded-lg"
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-6 text-left bg-accent/20 hover:bg-accent/30 rounded-t-lg">
                      <h3 className="text-xl font-medium">
                        {index + 1}. {item.question}
                      </h3>
                      {openQuestions[index] ? (
                        <ChevronUp className="h-6 w-6 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-6 w-6 shrink-0 text-muted-foreground" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-6 border-t bg-background rounded-b-lg">
                      <p className="text-lg leading-relaxed">{item.answer}</p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={handleTakeTest} className="w-full h-14 text-lg" disabled={!summary}>
                  Take a Test on This Content
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
