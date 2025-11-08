'use client'

import { FeedbackCards } from "@/components/list"

export default function Feedbacks (){
    return (
        <div className="flex h-screen ">
          
          <div className="flex-1 flex flex-col overflow-hidden">
            
            <main className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Feedbacks</h1>
                  <p className="text-muted-foreground mt-1">Track and manage all student feedbacks.</p>
                </div>
                <FeedbackCards/>
              </div>
            </main>
          </div>
        </div>
      )
}