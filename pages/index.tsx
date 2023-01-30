import { useState } from 'react'
import Head from 'next/head'

import { FooterSite } from '@/components/FooterSite'
import { HeaderSite } from '@/components/HeaderSite'

export default function Home() {
  const [loading, setLoading] = useState<Boolean>(false)
  const [destination, setDestination] = useState('')
  const [generatedDestination, setGeneratedDestination] = useState<String>('')

  const onHandleClick = async(e: { preventDefault: () => void }) => {
    e.preventDefault()
    setGeneratedDestination("")
    setDestination("")
    setLoading(true)

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: destination,
      }),
    })

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body

    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      setGeneratedDestination((prev) => prev + chunkValue)
    }

    setLoading(false)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Traveling</title>
        <meta name="description" content="Your automated travel agent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
      </Head>
      <HeaderSite />
      <main className="flex flex-1 flex-col items-center justify-center max-w-4xl mt-12 mb-12 mx-8 text-center sm:container">
        <h2 className="mb-4 text-3xl font-bold text-slate-900 sm:text-6xl ">
          Generate your travel plan in seconds
        </h2>
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-4/5 rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/3"
          placeholder={
            "e.g. Medellín, NYC, Madrid"
          }
        />
        {!loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-4/5 sm:w-1/3"
            onClick={(e) => onHandleClick(e)}
          >
            Generate your travel plan &rarr;
          </button>
        )}
        {loading && (
          <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-4/5 sm:w-1/3"
            disabled
          >
            ...
          </button>
        )}
        {generatedDestination && (
          <div className="mt-9">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 mx-auto sm:text-4xl ">
              Your travel plan:
            </h2>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-4 transition border">
                <p className="text-sm whitespace-pre-wrap">{generatedDestination}</p>
              </div>
            </div>
          </div>
        )}
      </main>
      <FooterSite />
    </div>
  )
}
