"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Ticket {
  id: number;
  facility: string;
  description: string;
  imageUrl: string;
}

export default function StaffDashboard() {
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([
    {
      id: 12345,
      facility: "School of Computer Science",
      description: "Broken air conditioner in Lab 3.",
      imageUrl: "/facility1.svg",
    },
    {
      id: 12346,
      facility: "Library",
      description: "Faulty printer near helpdesk.",
      imageUrl: "/facility2.svg",
    },
  ]);

  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);

  const [activeTab, setActiveTab] = useState<"pending" | "active" | "resolved">("active");

  const handleMarkInProgress = (ticket: Ticket) => {
    setPendingTickets(pendingTickets.filter((t) => t.id !== ticket.id));
    setActiveTickets([...activeTickets, ticket]);
  };

  const handleMarkCompleted = (ticket: Ticket) => {
    setActiveTickets(activeTickets.filter((t) => t.id !== ticket.id));
    setResolvedTickets([...resolvedTickets, ticket]);
  };

  const renderTickets = (tickets: Ticket[], status: string) => {
    if (tickets.length === 0) {
      return <p className="text-gray-500 text-sm mt-4">No tickets found.</p>;
    }

    return tickets.map((ticket) => (
      <Card key={ticket.id} className="p-6 shadow-sm mt-4 border border-gray-200">
        <h2 className="font-bold text-lg mb-4">COMPLAIN ID #{ticket.id}</h2>
        <p className="font-semibold">Facility Name</p>
        <p className="text-gray-500 mb-2">{ticket.facility}</p>

        <p className="font-semibold">Description</p>
        <p className="text-gray-500 mb-4">{ticket.description}</p>

        <p className="font-semibold">Uploaded Picture</p>
        <a
          href={ticket.imageUrl}
          target="_blank"
          className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700"
        >
          Click to Open
        </a>

        {status === "pending" && (
          <div className="mt-6">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
              onClick={() => handleMarkInProgress(ticket)}
            >
              Mark as In Progress
            </Button>
          </div>
        )}

        {status === "active" && (
          <div className="mt-6">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
              onClick={() => handleMarkCompleted(ticket)}
            >
              Mark as Completed
            </Button>
          </div>
        )}
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-purple-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">USM Helpdesk</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-purple-800 px-3 py-1 rounded-md">...</button>
          <img
            src="/user-avatar.svg"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex p-6 gap-6">
        {/* Sidebar */}
        <aside className="w-56 border border-gray-200 rounded-md h-fit">
          <button
            onClick={() => setActiveTab("active")}
            className={`block w-full text-left px-4 py-2 font-semibold ${
              activeTab === "active" ? "bg-gray-100" : ""
            }`}
          >
            Active Ticket
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`block w-full text-left px-4 py-2 font-semibold ${
              activeTab === "pending" ? "bg-gray-100" : ""
            }`}
          >
            Pending Ticket
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`block w-full text-left px-4 py-2 font-semibold ${
              activeTab === "resolved" ? "bg-gray-100" : ""
            }`}
          >
            Resolved Ticket
          </button>
        </aside>

        {/* Ticket view */}
        <main className="flex-1">
          {activeTab === "active" && (
            <>
              <h2 className="text-lg font-semibold">Active Tickets</h2>
              {renderTickets(activeTickets, "active")}
            </>
          )}

          {activeTab === "pending" && (
            <>
              <h2 className="text-lg font-semibold">Pending Tickets</h2>
              {renderTickets(pendingTickets, "pending")}
            </>
          )}

          {activeTab === "resolved" && (
            <>
              <h2 className="text-lg font-semibold">Resolved Tickets</h2>
              {renderTickets(resolvedTickets, "resolved")}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
